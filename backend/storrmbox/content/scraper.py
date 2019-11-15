from os import getenv
from requests import Session
from logging import Logger, getLogger
from bs4 import BeautifulSoup

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

        data = resp.json()

        if data["Response"] == "True":
            return data["Search"]

        self.log.error(f"Error while searching content '{data.get('Error', resp.text)}'")
        return []

    def get_by_imdb_id(self, id: str):
        resp = self.get({"i": id, "plot": "full"}, True)

        data = resp.json()

        if data["Response"] == "True":
            return data

        self.log.error(f"Error while searching content '{data.get('Error', resp.text)}'")
        return None


class ImdbScraper(ContentScraper):

    def __init__(self):
        super().__init__()
        self.url = "https://www.imdb.com/"
        self.omdb = OmdbScraper()

    def _get_page_ids(self, url: str):
        resp = self.get(url=url)
        soup = BeautifulSoup(resp.text, features="html.parser")
        table = soup.find("tbody")

        res = []
        for row in table.find_all("tr"):
            # title = row.find(class_="titleColumn").find("a").text
            # print(title)
            cid = row.find(class_="watchlistColumn").find("div").attrs["data-tconst"]
            res.append(cid)

        return res

    def popular(self, ctype: ContentType):
        url = self.url
        if ctype == ContentType.SERIES:
            url += "chart/tvmeter"
        elif ctype == ContentType.MOVIE:
            url += "chart/moviemeter"

        resp = self._get_page_ids(url)

        # return [self.omdb.get_by_imdb_id(iid) for iid in resp]
        return resp


