from interface import implements, Interface, default
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, ClassVar
from enum import Enum, IntFlag, auto
from requests import Session
from logging import Logger, getLogger
from bs4 import BeautifulSoup
from pprint import pprint

@dataclass
class Torrent:
    name: str
    seeders: int
    leechers: int
    size: int # in bytes
    date_added: datetime
    magnet: str

    # optional
    uploader: str = field(default="")
    torrent_url: str = field(repr=False, default="")


class ContentType(IntFlag):
    MOVIES = 1 << 1,
    SERIES = 1 << 2,
    ANIME = 1 << 3,
    NSFW = 1 << 4


class TimeRange(Enum):
    DAY = 1,
    WEEK = 7,
    MONTH = 30


@dataclass
class ProviderCapabilities:
    content_types: int
    time_range: TimeRange

    def serves_content(self, content_type: ContentType) -> bool:
        return bool(self.content_types & content_type.value)


class TorrentProvider(Interface):

    def __init__(self, session: Session, logger: Logger):
        pass

    @property
    def caps(self) -> ProviderCapabilities:
        pass

    def search(self, query: str, content_type: ContentType) -> List[Torrent]:
        pass

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> List[Torrent]:
        pass

    # Util functions
    @default
    def parse_date(date: str, formats: List[str]) -> datetime:
        # Remove "th", "rd", "st", "nd"
        import re
        stripped = re.sub(r'(\d)(st|nd|rd|th)', r'\1', date)

        # date formatted as "Sep. 27th '19" or "10pm Nov. 4th"
        date_added = datetime.now()

        for fmt in formats:
            try:
                date_added = datetime.strptime(stripped, fmt)
                break
            except:
                pass

        if date_added.year == 1900:
            now = datetime.now()
            date_added.replace(year=now.year)

            if date_added.day == 1 and date_added.month == 1:
                date_added.replace(day=now.day, month=now.month)

        return date_added

    # In format "{:f} {B/KB/MB/GB/TB}"
    @default
    def parse_size(size: str) -> int:
        size_parsed = size.replace(',', '').upper()
        units = {"B": 1, "KB": 10 ** 3, "MB": 10 ** 6, "GB": 10 ** 9, "TB": 10 ** 12}
        number, unit = [string.strip() for string in size_parsed.split()]
        return int(float(number) * units[unit])

    @default
    def get_column_text(row, class_: str, recursive=True) -> str:
        data = row.find("td", class_=class_)
        if data:
            return data.find(text=True, recursive=recursive)
        else:
            return ""

class LeetxProvider(implements(TorrentProvider)):
    _caps = ProviderCapabilities(
        content_types=ContentType.MOVIES | ContentType.SERIES | ContentType.ANIME | ContentType.NSFW,
        time_range=TimeRange.MONTH
    )
    url = "https://1337x.to/search/{}/1/"

    def __init__(self, session: Session, logger: Logger):
        self.req = session
        self.log = logger

    @property
    def caps(self) -> ProviderCapabilities:
        return LeetxProvider._caps

    def search(self, query: str, content_type: ContentType) -> List[Torrent]:
        self.log.debug("Searching using leetx provider")
        resp = self.req.get(LeetxProvider.url.format(query.replace(" ", "+")))

        if resp.status_code == 200:
            torrents = []
            soup = BeautifulSoup(resp.text, features="html.parser")
            table = soup.find("table")

            for row in table.find_all("tr")[1:]:  #skip the first element
                try:
                    t = Torrent(
                        name=LeetxProvider.get_column_text(row, "name"),
                        seeders=int(LeetxProvider.get_column_text(row, "seeds")),
                        leechers=int(LeetxProvider.get_column_text(row, "leeches")),
                        date_added=LeetxProvider.parse_date(LeetxProvider.get_column_text(row, "coll-date"), ["%b. %d '%y", "%I%p %b. %d"]),
                        size=LeetxProvider.parse_size(LeetxProvider.get_column_text(row, "size", False)),
                        uploader=LeetxProvider.get_column_text(row, "coll-5"),
                        magnet="todo"
                    )
                    torrents.append(t)
                except Exception as ex:
                    self.log.error(f"Error while scraping: {ex}")
                    self.log.error(row)
            return torrents

        self.log.error(f"Page returned status code {resp.status_code}")
        return []

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> List[Torrent]:
        return []


class EztvProvider(implements(TorrentProvider)):
    _caps = ProviderCapabilities(
        content_types=ContentType.MOVIES | ContentType.SERIES,
        time_range=TimeRange.MONTH
    )

    def __init__(self, session: Session, logger: Logger):
        self.req = session
        self.log = logger

    @property
    def caps(self) -> ProviderCapabilities:
        return EztvProvider._caps

    def search(self, query: str, content_type: ContentType) -> List[Torrent]:
        self.log.debug("Searching using eztv provider")
        t = Torrent(
            query + " 1080p",
            datetime.now(),
            20,
            30,
            "lol:lol",
            magnet=""
        )
        return [t]

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> List[Torrent]:
        return []


class TorrentScraper(object):

    def __init__(self):
        self._providers = []
        self.req = Session()
        self.req.headers.update({
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
        })
        self.log = getLogger("TorrentScraper")
        # self._req.headers.update

    def add_provider(self, provider: ClassVar):
        p = provider(self.req, getLogger(provider.__name__))

        if p.caps is not None and p.caps.content_types > 0:
            print(f"Adding {provider.__name__}.")
            print(" ├── Content types: {}".format(
                ", ".join([content_type.name for content_type in ContentType if p.caps.serves_content(content_type)])
            ))
            print(" └── Time range: {}".format(p.caps.time_range.name))
            self._providers.append(p)
            return True
        else:
            print("Provider does not serve any content types")
            return False

    def search(self, query: str, content_type: ContentType) -> List[Torrent]:
        results = []
        for p in self._providers:
            if p.caps.serves_content(content_type):
                results.extend(p.search(query, content_type))
            else:
                print(f"{p.__class__.__name__} does not serve content type '{content_type.name}'")
        return results


class VideoQuality(Enum):
    SD = "480p",
    HD = "720p",
    FULLHD = "1080p",
    HDTV = "HDTV",


class MovieTorrentScraper(TorrentScraper):
    # pairs movies with torrents and gets video quality,
    def search_movie(self, name: str):
        pass

    def search_series(self, name: str, season: int, episode: int, quality=VideoQuality.SD):
        query = "{name} S{season:02d}E{episode:02d} {quality}".format(
            name=name, season=season, episode=episode, quality=str(quality.value[0]))

        #print(query)
        return self.search(query, ContentType.SERIES)


if __name__ == "__main__":
    print("Starting...")

    scraper = MovieTorrentScraper()
    scraper.add_provider(LeetxProvider)
    scraper.add_provider(EztvProvider)

    result = scraper.search_series("silicon valley", season=3, episode=6, quality=VideoQuality.HD)

    pprint(result)
