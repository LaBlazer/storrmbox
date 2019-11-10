from ..scrapers import *
from bs4 import BeautifulSoup
from interface import implements, Interface, default


class TorrentProvider(Interface):

    def __init__(self, session: Session, logger: Logger):
        pass

    @property
    def caps(self) -> ProviderCapabilities:
        pass

    def search(self, query: str, content_type: ContentType) -> List[Torrent]:
        pass

    def get_popular(self, content_type: ContentType, time_range: TimeRange) -> List[Torrent]:
        pass

    # Util functions
    @default
    @staticmethod
    def parse_date(date: str, formats: List[str]) -> datetime:
        # Remove "th", "rd", "st", "nd"
        import re
        stripped = re.sub(r'(\d)(st|nd|rd|th)', r'\1', date)

        # date formatted as "Sep. 27th '19" or "10pm Nov. 4th"
        date_added = datetime.now()

        for fmt in formats:
            try:
                date_added = datetime.strptime(stripped, fmt)
                break
            except:
                pass

        if date_added.year == 1900:
            now = datetime.now()
            date_added.replace(year=now.year)

            if date_added.day == 1 and date_added.month == 1:
                date_added.replace(day=now.day, month=now.month)

        return date_added

    # In format "{:f} {B/KB/MB/GB/TB}"
    @default
    @staticmethod
    def parse_size(size: str) -> int:
        size_parsed = size.replace(',', '').upper()
        units = {"B": 1, "KB": 10 ** 3, "MB": 10 ** 6, "GB": 10 ** 9, "TB": 10 ** 12}
        number, unit = [string.strip() for string in size_parsed.split()]
        return int(float(number) * units[unit])

    @default
    @staticmethod
    def get_column_text(row, class_: str, recursive=True) -> str:
        data = row.find("td", class_=class_)
        if data:
            return data.find(text=True, recursive=recursive)
        else:
            return ""