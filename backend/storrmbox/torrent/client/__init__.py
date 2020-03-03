from dataclasses import dataclass
from typing import Optional

from interface import Interface, default, implements

from storrmbox.torrent.scraper import *


@dataclass
class TorrentInfo:
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
