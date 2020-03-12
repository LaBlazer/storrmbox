import re
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, ClassVar, Iterator, Tuple, Union, Optional

from requests import Session

from storrmbox.models.content import ContentType, Content
from storrmbox.extensions.logging import logger


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
    entire_season: bool = False


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

    def add_provider(self, provider: ClassVar):
        p = provider(self.req)

        if p.caps is not None and len(p.caps.content_types) > 0:
            self._providers.append(p)
            return True
        else:
            logger.error("Provider does not serve any content types")
            return False

    from storrmbox.torrent.scraper.providers import TorrentProvider

    def search(self, query: str, content_type: ContentType) -> Iterator[Tuple[Torrent, TorrentProvider]]:
        for p in self._providers:
            if p.caps.serves_content(content_type):
                logger.debug(f"Searching '{query}' using provider {p.__class__.__name__}")

                for torr in p.search(query, content_type):
                    yield (torr, p)
            else:
                logger.error(f"{p.__class__.__name__} does not serve content type '{content_type}'")


class VideoQuality(Enum):
    NONE = (0, [])
    SD = (1, ["480P", "360P", "CAM", "HDTS", "SCR", "DVDSCR", "HDTV", "HDRIP", "WEBRIP"])
    HD = (2, ["720P", "BRRIP", "BLURAY"])
    FULLHD = (3, ["1080P"])


class ContentTorrentScraper(TorrentScraper):
    STREAMABLE_FILES = [".mp4", ".mkv"]
    EPISODE_PATTERN = re.compile(r'.*s\d{1,2}[.\w]?e\d{2}.*\.(mp4|mkv)$', re.IGNORECASE)

    @staticmethod
    def _strip_title(title):
        return re.sub('[^A-Za-z0-9]+', '', title)

    @staticmethod
    def _is_streamable(filename: str) -> bool:
        return any([filename.endswith(ext) for ext in ContentTorrentScraper.STREAMABLE_FILES])

    @staticmethod
    def _has_streamable_file(torrent: TorrentDetails) -> bool:
        return any([ContentTorrentScraper._is_streamable(file) for file in torrent.files])

    @staticmethod
    def _get_episodes(torrent: TorrentDetails) -> List[str]:
        # Return list of episode files
        return [f for f in torrent.files if ContentTorrentScraper.EPISODE_PATTERN.match(f)]

    def search_content(self, content: Content, quality=VideoQuality.HD) -> Optional[TorrentDetails]:
        # Build the query based on content type
        queries = []
        if content.type == ContentType.episode:
            # If the requested episode is from the latest season download single episode
            title = self._strip_title(content.parent.title)
            if content.parent.season and content.parent.season <= content.season:
                queries = [
                    f"{title} S{content.season:02d}E{content.episode:02d}",
                    f"{title} S{content.season:02d}"
                ]
            else:
                # Else download the whole season
                queries = [
                    f"{title} S{content.season:02d}",
                    f"{title} S{content.season:02d}E{content.episode:02d}"
                ]
        elif content.type == ContentType.movie:
            title = self._strip_title(content.title)
            queries = [
                title + (' ' + content.year_released if content.year_released else ''),
                title,
                content.original_title if content.original_title else content.title
            ]

        # Iterate over the results and filter unwanted torrents
        for query in queries:
            for torr, provider in self.search(query.lower(), content.type):
                logger.debug(f"Processing {torr}")
    
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

                # Torrent quality is better or same as we requested
                if qual.value[0] >= quality.value[0]:
                    details = provider.get_details(torr)

                    # Has required episode
                    if content.type == ContentType.episode:
                        episodes = self._get_episodes(details)
                        logger.debug(episodes)
                        if len(episodes) > 0:
                            if len(episodes) > 1:
                                details.entire_season = True
                            return details
                    else:
                        if self._has_streamable_file(details):
                            return details

                    logger.debug(f"No serveable files found for {content.uid}")

        logger.error(f"No torrent found for content {content.uid}: '{content.title}' with quality {quality.name}")
        return None
