from dataclasses import dataclass
from typing import Optional, Dict

import requests
from interface import Interface, default, implements

from storrmbox.extensions.logging import logger
from storrmbox.torrent.scraper import *


@dataclass
class TorrentInfo:
    name: str
    hash: str
    speed: int  #bytes per second
    peers: int
    seeders: int
    ratio: float
    size: int
    progress: int # 0.0-1.0 float
    files: List[str]


@dataclass
class TorrentSettings:
    stop_seed_ratio: float


class TrackerList:

    class Type(Enum):
        Best = "best"
        Extended = "all"

    _list_cache: Dict[Type, List[str]] = {
        Type.Best: [],
        Type.Extended: []
    }

    @classmethod
    def update(cls):
        for list_type in cls._list_cache.keys():
            resp = requests.get(f"https://trackerslist.com/{list_type.value}.txt")

            if resp.status_code == 200:
                cls._list_cache[list_type] = [t for t in (l.strip() for l in resp.text.splitlines()) if t]
            else:
                logger.warning(f"Could not update tracker list ({list_type}), returned: {resp.text}")

    @classmethod
    def get_list(cls, list_type: Type = Type.Best) -> List[str]:
        if len(cls._list_cache[list_type]) == 0:
            cls.update()

        return cls._list_cache[list_type]


class TorrentClient(Interface):

    def setup(self) -> bool:
        """Tries to set up the service automatically"""
        pass

    def connect(self) -> bool:
        """Tries to connect to the service automatically"""
        pass

    def run(self) -> bool:
        """Tries to setup and connect automatically"""
        pass

    def add_torrent(self, magnet_uri: str, uid: str) -> List[str]:
        """Returns list of torrent file names"""
        pass

    def list_torrents(self) -> List[str]:
        """Returns list of all currently active torrent uids"""
        pass

    def get_torrent_info(self, uid: str) -> Optional[TorrentInfo]:
        """Gets torrent info from the torrent uid"""
        pass

    def set_seed_ratio(self, seed_ratio):
        """Sets the torrent seeding ratio"""
        pass
