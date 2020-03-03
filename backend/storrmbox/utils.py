import functools
from datetime import datetime
from typing import List

from flask import request, url_for


def paginate(max_per_page=100):
    def decorator(func):
        @functools.wraps(func)
        def wrapped(*args, **kwargs):
            page = request.args.get('page', 1, type=int)
            per_page = min(request.args.get('per_page', max_per_page, type=int), max_per_page)

            query = func(*args, **kwargs)
            p = query.paginate(page, per_page)

            meta = {
                'page': page,
                'per_page': per_page,
                'total': p.total,
                'pages': p.pages,
            }

            links = {}
            if p.has_next:
                links['next'] = url_for(request.endpoint, page=p.next_num,
                                        per_page=per_page, **kwargs)
            if p.has_prev:
                links['prev'] = url_for(request.endpoint, page=p.prev_num,
                                        per_page=per_page, **kwargs)
            links['first'] = url_for(request.endpoint, page=1,
                                     per_page=per_page, **kwargs)
            links['last'] = url_for(request.endpoint, page=p.pages,
                                    per_page=per_page, **kwargs)

            meta['links'] = links
            result = {
                'items': p.items,
                'meta': meta
            }

            return result, 200
        return wrapped
    return decorator


def parse_file_size(size_string: str, group_delimiter=',', decimal_delimiter='.') -> int:
    """Converts a humanized size representation to an integer."""
    size_parsed = size_string.replace(group_delimiter, '').replace(decimal_delimiter, '.').upper()
    units = {"B": 1, "KB": 10 ** 3, "MB": 10 ** 6, "GB": 10 ** 9, "TB": 10 ** 12}
    number, unit = [string.strip() for string in size_parsed.split()]
    return int(float(number) * units[unit])


def humanize_file_size(size_bytes: int, precision: int = 1) -> str:
    """Returns a humanized string representation of a number of bytes."""
    abbrevs = (
        (1 << 50, 'PB'),
        (1 << 40, 'TB'),
        (1 << 30, 'GB'),
        (1 << 20, 'MB'),
        (1 << 10, 'KB'),
        (1, 'bytes')
    )
    if bytes == 1:
        return '1 byte'
    for factor, suffix in abbrevs:
        if size_bytes >= factor:
            return '%.*f %s' % (precision, size_bytes / factor, suffix)


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

