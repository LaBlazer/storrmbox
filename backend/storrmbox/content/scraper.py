from multiprocessing.dummy import Pool as ThreadPool
from logging import getLogger
from os import getenv, remove, path, rename
import gzip
import shutil
import time
import datetime as dt
from pathlib import Path

from bs4 import BeautifulSoup
from requests import Session

from storrmbox.content.helpers import Parser, DatasetReader
from storrmbox.exceptions import InternalException
from storrmbox.models.content import Content
from storrmbox.torrent.scrapers import ContentType


class ContentScraper(object):

    def __init__(self):
        self.log = getLogger("content_scraper")
        self.req = Session()
        self.req.headers.update({
            "accept-language": "en-US,en"
        })
        self.url = ""
        self.api_key = ""

    def get(self, params={}, api_key=False, url=None):
        if api_key:
            params["apiKey"] = self.api_key

        if url is None:
            url = self.url

        resp = self.req.get(url=url, params=params)

        if resp.status_code == 401:
            raise Exception("Invalid OMDB api key! Please set it in the .env file.")

        if resp.status_code != 200:
            self.log.error(f"Error while scraping content ({resp.status_code})")

        return resp

    def download(self, url, filename):
        with self.req.get(url, stream=True) as r:
            r.raise_for_status()
            with open(filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=16384):
                    if chunk:
                        f.write(chunk)

    def search(self, query: str, page=1):
        return []


class OmdbScraper(ContentScraper):

    def __init__(self):
        super().__init__()
        self.url = "https://www.omdbapi.com/"
        self.api_key = getenv('OMDB_API_KEY')

        if not self.api_key:
            raise Exception("Invalid OMDB api key! Please set it in the .env file.")

    def search(self, query: str, page=1):
        resp = self.get({"s": query, "page": page}, True)

        data = Parser.normalize_dict(resp.json())

        if data["Response"]:
            return data["Search"], data['totalResults']

        self.log.error(f"Error while searching content '{data.get('Error', resp.text)}'")
        return []

    def get_by_imdb_id(self, id: str):
        resp = self.get({"i": id, "plot": "full"}, True)

        data = Parser.normalize_dict(resp.json())

        if data["Response"]:
            return data

        self.log.error(f"Error while searching content '{data.get('Error', resp.text)}'")
        return {}


class ImdbScraper(ContentScraper):
    dataset_url = "https://datasets.imdbws.com/"

    def __init__(self):
        super().__init__()
        self.url = "https://www.imdb.com/"
        self.omdb = OmdbScraper()
        self.dataset_parser = Parser("\\N", "\t")

    def _get_page_ids(self, url: str, params={}):
        resp = self.get(params, url=url)
        soup = BeautifulSoup(resp.text, features="html.parser")
        table = soup.find("tbody")

        res = []
        for row in table.find_all("tr"):
            # title = row.find(class_="titleColumn").find("a").text
            # print(title)

            # If the content has no rating skip it
            stars = row.find("td", class_="imdbRating").find("strong")
            if not stars:
                continue

            # If the release year is larger than current year skip it
            # year = row.find(class_="secondaryInfo").text[1:-1]
            # print(year)
            # if datetime.date.today().year < int(year):
            #     continue

            cid = row.find("td", class_="watchlistColumn").find("div").attrs["data-tconst"]
            res.append(cid)

        return res

    def _download_and_extract_datasets(self, name, force=False):
        do_diff = False
        # Check date and skip if we already have fresh datasets
        if path.isfile(f"datasets/{name}.tsv"):
            file_date = dt.datetime.fromtimestamp(path.getmtime(f"datasets/{name}.tsv")).date()
            if not force and file_date == dt.datetime.now().date():
                print(f"Dataset '{name}' already up to date...")
                return

            # Rename the old dataset and delete the older dataset
            if path.isfile(f"datasets/{name}_old.tsv"):
                remove(f"datasets/{name}_old.tsv")
            rename(f"datasets/{name}.tsv", f"datasets/{name}_old.tsv")
            do_diff = True

        print(f"Downloading and extracting dataset '{name}'...")

        # Download
        self.download(f"{ImdbScraper.dataset_url}title.{name}.tsv.gz", f"datasets/{name}.tsv.gz")

        # Extract
        with gzip.open(f"datasets/{name}.tsv.gz", "rb") as f_in:
            with open(f"datasets/{name}.tsv", "wb") as f_out:
                shutil.copyfileobj(f_in, f_out)

        # Remove the archive
        remove(f"datasets/{name}.tsv.gz")

        print(f"'{name}' downloaded!")
        return do_diff

    def get_content(self, threads=3):
        start_time = time.time()

        pool = ThreadPool(threads)
        pool.map(self._download_and_extract_datasets, ["basics", "episode", "ratings"])
        pool.close()
        pool.join()

        # Create datasets folder if not exists already
        Path("datasets").mkdir(parents=True, exist_ok=True)

        basics = DatasetReader(f"datasets/basics.tsv", self.dataset_parser, 0, True, str, str, str, str, int, int, int,
                               int, str)
        episodes = DatasetReader(f"datasets/episode.tsv", self.dataset_parser, 0, True, str, str, int, int)
        ratings = DatasetReader(f"datasets/ratings.tsv", self.dataset_parser, 0, True, str, float, int)

        # Get series and movies
        print("Getting series and movies")
        for iid, content_type, title, original_title, adult, start_year, end_year, runtime, genres in \
                basics.iterate_data():

            # Skip adult content
            if adult == 1:
                basics.remove_data(iid)
                continue

            # Skip unwanted content
            if content_type not in ["tvMiniSeries", "tvSeries", "tvMovie", "movie"]:
                if content_type != "tvEpisode":
                    basics.remove_data(iid)
                continue

            # Convert content type
            if content_type in ["tvSeries", "tvMiniSeries"]:
                content_type = ContentType.series
            else:
                content_type = ContentType.movie

            # Join rating
            x, average_rating, vote_count = ratings.get_data(iid)

            # Skip content with small number of votes (unpopular content)
            if not vote_count or \
                    (content_type == ContentType.movie and vote_count <= 5000) or \
                    (content_type == ContentType.series and vote_count <= 5000):
                basics.remove_data(iid)

                continue

            yield {
                "imdb_id": iid,
                "type": content_type,
                "title": title,
                "original_title": original_title,
                "year_released": start_year,
                "year_end": end_year,
                "runtime": runtime,
                "genres": genres,
                "rating": average_rating,
                "votes": vote_count
            }

        # Get episodes
        print("Getting episodes")
        for iid, parent_iid, season, episode in episodes.iterate_data():

            # Skip episodes without parent content
            if not basics.has_key(parent_iid):
                basics.remove_data(iid)
                continue

            # Skip too high episode numbers
            if not episode or not season or episode >= 32767:
                basics.remove_data(iid)
                continue

            # Join rating data
            x, average_rating, vote_count = ratings.get_data(iid)

            # Skip episode if it's not released yet
            if not vote_count:
                basics.remove_data(iid)
                continue

            # Join basic data
            x, content_type, title, original_title, adult, start_year, end_year, runtime, genres = basics.get_data(iid)

            yield {
                "imdb_id": iid,
                "type": ContentType.episode,
                "title": (title[:185] + '...') if len(title) > 185 else title,
                "original_title": (original_title[:185] + '...') if len(original_title) > 185 else original_title,
                "year_released": start_year,
                "year_end": end_year,
                "runtime": runtime,
                "genres": genres,
                "rating": average_rating,
                "votes": vote_count,
                "parent_uid": Content.generate_uid(parent_iid),
                "season": season,
                "episode": episode
            }

        print(f"Content updated, took {time.time() - start_time} seconds")

    def get_popular(self, ctype: ContentType):
        url = self.url
        if ctype == ContentType.series:
            url += "chart/tvmeter"
        elif ctype == ContentType.movie:
            url += "chart/moviemeter"
        else:
            raise InternalException("Invalid content type")

        resp = self._get_page_ids(url)

        return resp

    def get_top(self, ctype: ContentType):
        url = self.url
        if ctype == ContentType.series:
            url += "chart/toptv"
        elif ctype == ContentType.movie:
            url += "chart/top"
        else:
            raise InternalException("Invalid content type")

        resp = self._get_page_ids(url, {"sort": "us,des"})

        return resp
