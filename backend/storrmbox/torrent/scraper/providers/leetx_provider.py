import re

from . import *
from storrmbox.utils import parse_date, parse_file_size
from storrmbox.extensions.logging import logger


class LeetxProvider(implements(TorrentProvider)):
    _caps = ProviderCapabilities(
        content_types=[ContentType.movie, ContentType.episode],
        time_range=TimeRange.MONTH
    )
    search_url = "https://1337x.to/search/{}/1/"
    url = "https://1337x.to"

    def __init__(self, requests_session: Session):
        self.req = requests_session
        self.log = logger

    @property
    def caps(self) -> ProviderCapabilities:
        return LeetxProvider._caps

    def search(self, query: str, content_type: ContentType) -> Iterator[Torrent]:
        resp = self.req.get(LeetxProvider.search_url.format(query.replace(" ", "+")))

        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, features="html.parser")
            table = soup.find("table")

            # self.log.debug(resp.text)
            if table:
                for row in table.find_all("tr")[1:]:  # Skip the table header
                    try:
                        yield Torrent(
                            name=self.get_column_text(row, "name"),
                            seeders=int(self.get_column_text(row, "seeds")),
                            leechers=int(self.get_column_text(row, "leeches")),
                            date_added=parse_date(self.get_column_text(row, "coll-date"), ["%b. %d '%y", "%I%p %b. %d"]),
                            size=parse_file_size(self.get_column_text(row, "size", False)),
                            uploader=self.get_column_text(row, "coll-5"),
                            url=self.get_column_link(row, "name")
                        )
                    except Exception as ex:
                        self.log.error(f"Error while scraping: {ex}")
                        self.log.error(row)

        self.log.error(f"Page returned status code {resp.status_code}")

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> Iterator[Torrent]:
        pass

    def get_details(self, torrent: Torrent) -> TorrentDetails:
        resp = self.req.get(LeetxProvider.url + torrent.url)

        # TODO: also ping the tracking url
        # function count(t){return $.ajax({async:!1,type:"POST",url:"/dltrack/408273/"
        # ,data:{dst:t.href,src:document.location.href,torid:"408273"}}),!1}

        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, features="html.parser")

            # Retrieve magnet link
            magnet = None
            for link in soup.find_all('a', attrs={'href': re.compile(r"^magnet:")}):
                magnet = link.get('href')
                break

            if not magnet:
                self.log.error(f"Error while getting magnet for '{torrent.name}'")

            # Retrieve file list
            files = []
            for name in soup.find("div", class_="file-content").find_all("li"):
                # Remove file size from the filename and append to files 'name.mp4 (1,234.5 MB)'
                files.append(name.text.split(" (", 1)[0])

            self.log.debug(f"Files: {files}")

            return TorrentDetails(
                torrent=torrent,
                magnet=magnet,
                files=files
            )

    @staticmethod
    def get_column_text(row, class_: str, recursive=True) -> str:
        data = row.find("td", class_=class_)
        if data:
            return data.find(text=True, recursive=recursive)
        else:
            return ""

    @staticmethod
    def get_column_link(row, class_: str):
        data = row.find("td", class_=class_)
        for a in data.find_all('a', href=True):
            if not a.get('class'):
                return a['href']
