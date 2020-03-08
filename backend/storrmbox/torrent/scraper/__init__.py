from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from logging import getLogger
from typing import List, ClassVar, Iterator, Tuple

from requests import Session

from storrmbox.models.content import ContentType, Content


@dataclass
class Torrent:
    name: str
    seeders: int
    leechers: int
    size: int  # torrent size in bytes
    date_added: datetime
    url: str

    # optional
    uploader: str = field(default="")


@dataclass
class TorrentDetails:
    torrent: Torrent
    magnet: str
    files: List[str]


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

    def add_provider(self, provider: ClassVar):
        p = provider(self.req)

        if p.caps is not None and len(p.caps.content_types) > 0:
            # self.log.debug(f"Adding {provider.__name__}.")
            # self.log.debug(" ├── Content types: {}".format(
            #     ", ".join([content_type.name for content_type in ContentType if p.caps.serves_content(content_type)])
            # ))
            # self.log.debug(" └── Time range: {}".format(p.caps.time_range.name))
            self._providers.append(p)
            return True
        else:
            self.log.error("Provider does not serve any content types")
            return False

    def search(self, query: str, content_type: ContentType) -> Iterator[Tuple[Torrent, 'TorrentProvider']]:
        for p in self._providers:
            if p.caps.serves_content(content_type):
                self.log.debug(f"Searching '{query}' using provider {p.__class__.__name__}")

                for torr in p.search(query, content_type):
                    yield (torr, p)
            else:
                self.log.error(f"{p.__class__.__name__} does not serve content type '{content_type}'")


class VideoQuality(Enum):
    NONE = (0, [])
    SD = (1, ["480P", "360P", "CAM", "HDTS", "SCR", "DVDSCR", "HDTV", "HDRIP", "WEBRIP"])
    HD = (2, ["720P", "BRRIP", "BLURAY"])
    FULLHD = (3, ["1080P"])


class ContentTorrentScraper(TorrentScraper):

    def search_content(self, content: Content, quality=VideoQuality.HD) -> TorrentDetails:
        # Build the query based on content type
        query = None
        if content.type == ContentType.episode:
            query = f"{content.get_parent().title} S{content.season:02d}E{content.episode:02d}"
        elif content.type == ContentType.movie:
            query = f"{content.title} {content.year_released}"

        # Iterate over the results and filter unwanted torrents
        for torr, provider in self.search(query.lower(), content.type):
            self.log.debug(f"Processing {torr}")

            if torr.seeders < 5:
                continue

            # 3 = best quality, 0 = worst
            qual = VideoQuality.NONE
            name = torr.name.upper()
            if any(tag in name for tag in VideoQuality.FULLHD.value[1]):
                qual = VideoQuality.FULLHD
            elif any(tag in name for tag in VideoQuality.HD.value[1]):
                qual = VideoQuality.HD
            elif any(tag in name for tag in VideoQuality.SD.value[1]):
                qual = VideoQuality.SD

            if qual.value[0] >= quality.value[0]:
                details = provider.get_details(torr)

                if any(file.endswith(".mp4") for file in details.files):
                    return details

        self.log.error(f"No torrent found for content {content.uid}: {content.title} with quality {quality.name}")
        return None
