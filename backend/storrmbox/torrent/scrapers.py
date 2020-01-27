from dataclasses import dataclass, field
from datetime import datetime
from typing import List, ClassVar
from enum import Enum
from requests import Session
from logging import Logger, getLogger

from storrmbox.models.content import ContentType


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


class TimeRange(Enum):
    DAY = 1,
    WEEK = 7,
    MONTH = 30


@dataclass
class ProviderCapabilities:
    content_types: List[Enum]
    time_range: TimeRange

    def serves_content(self, content_type: ContentType) -> bool:
        return content_type in self.content_types


class TorrentScraper(object):
    trackers_url = "https://combinatronics.com/ngosang/trackerslist/master/trackers_best.txt"

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

        if p.caps is not None and len(p.caps.content_types) > 0:
            # print(f"Adding {provider.__name__}.")
            # print(" ├── Content types: {}".format(
            #     ", ".join([content_type.name for content_type in ContentType if p.caps.serves_content(content_type)])
            # ))
            # print(" └── Time range: {}".format(p.caps.time_range.name))
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
    FULLHD = "1080p"


class MovieTorrentScraper(TorrentScraper):
    # pairs movies with torrents and gets video quality,
    def search_movie(self, name: str, quality=VideoQuality.SD):
        return []

    def search_series(self, name: str, season: int, episode: int, quality=VideoQuality.SD):
        query = "{name} S{season:02d}E{episode:02d} {quality}".format(
            name=name, season=season, episode=episode, quality=str(quality.value[0]))

        # print(query)
        return self.search(query, ContentType.series)


# if __name__ == "__main__":
#     print("Starting...")
#
#     scraper = MovieTorrentScraper()
#     scraper.add_provider(LeetxProvider)
#     scraper.add_provider(EztvProvider)
#
#     result = scraper.search_series("silicon valley", season=3, episode=6, quality=VideoQuality.HD)
#
#     pprint(result)
