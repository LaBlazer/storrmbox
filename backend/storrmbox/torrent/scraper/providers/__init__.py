from typing import Iterator

from bs4 import BeautifulSoup
from interface import Interface, default, implements

from storrmbox.torrent.scraper import Session, ProviderCapabilities, Torrent, ContentType, TimeRange, TorrentDetails


class TorrentProvider(Interface):

    def __init__(self, requests_session: Session):
        raise NotImplementedError("__init__ is not implemented")

    @property
    def caps(self) -> ProviderCapabilities:
        raise NotImplementedError("caps is not implemented")

    def search(self, query: str, content_type: ContentType) -> Iterator[Torrent]:
        raise NotImplementedError("search is not implemented")

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> Iterator[Torrent]:
        raise NotImplementedError("get_popular is not implemented")

    def get_details(self, torrent: Torrent) -> TorrentDetails:
        raise NotImplementedError("get_magnet is not implemented")
