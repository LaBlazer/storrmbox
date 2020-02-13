from logging import Logger
from interface import Interface, default, implements

from storrmbox.torrent.scrapers import *


@dataclass
class TorrentInfo:
    name: str
    speed: int  #bytes per second
    peers: int
    seeders: int
    ratio: float
    size: int
    files: List[str]


@dataclass
class TorrentSettings:
    stop_seed_ratio: float


class TorrentClient(Interface):

    def setup(self, seed_ratio) -> bool:
        pass

    #  returns list of downloaded files
    def add_torrent(self, magnet_uri: str, uid: str) -> List[str]:
        pass

    def list_torrents(self) -> List[str]:
        pass

    def get_torrent_info(self, uid: str) -> TorrentInfo:
        pass

    def set_seed_ratio(self, seed_ratio):
        pass
