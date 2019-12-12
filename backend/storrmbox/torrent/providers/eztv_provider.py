from .provider import *


class EztvProvider(implements(TorrentProvider)):
    _caps = ProviderCapabilities(
        content_types=[ContentType.movie, ContentType.series],
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
            name=query + " 1080p",
            date_added=datetime.now(),
            seeders=20,
            leechers=30,
            size=500000,
            uploader="Jozko",
            magnet=""
        )
        return [t]

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> List[Torrent]:
        return []