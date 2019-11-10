from .provider import *


class LeetxProvider(implements(TorrentProvider)):
    _caps = ProviderCapabilities(
        content_types=ContentType.MOVIE | ContentType.SERIES | ContentType.NSFW,
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