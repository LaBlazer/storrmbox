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


common_passwords = ["password","12345678","123456789","1234567","baseball","football","letmein","qwertyuiop","mustang","1234567890","michael","superman","1qaz2wsx","7777777","fuckyou","trustno1","jennifer","zxcvbnm","sunshine","iloveyou","charlie","starwars","klaster","asshole","computer","michelle","jessica","11111111","freedom","princess","chelsea","matthew","yankees","987654321","thunder","william","corvette","heather","diamond","1234qwer","88888888","anthony","q1w2e3r4t5","patrick","internet","scooter","richard","samantha","jackson","whatever","chicken","maverick","phoenix","welcome","ferrari","samsung","steelers","mercedes","arsenal","melissa","monster","123123123","gateway","bulldog","qwer1234","hardcore","porsche","cowboys","ncc1701","q1w2e3r4","fuckoff","brandon","chester","forever","midnight","chicago","rangers","charles","bigdaddy","bigdick","victoria","natasha","1q2w3e4r","jasmine","panties","fishing","cocacola","raiders","marlboro","gandalf","asdfasdf","crystal","87654321","12344321","bigtits","8675309","panther","thx1138","madison","winston","shannon","blowjob","jordan23","Password","pokemon","johnson","jonathan","liverpoo","danielle","123456a","abcd1234","scorpion","qazwsxedc","password1","slipknot","qwerty123","startrek","12341234","cameron","newyork","rainbow","redskins","butthead","asdfghjkl","peaches","qwertyui","florida","dolphin","captain","liverpool","dolphins","packers","nicholas","tiffany","maxwell","nirvana","elephant","jackass","rosebud","success","mountain","xxxxxxxx","warrior","1q2w3e4r5t","123456q","metallic","shithead","bond007","1111111","scorpio","benjamin","creative","rush2112","asdfghjk","4815162342","passw0rd","trouble","fucking","bullshit","america","1qazxsw2","nothing","rebecca","garfield","01012011","69696969","december","11223344","godzilla","airborne","lifehack","brooklyn","platinum","phantom","darkness","blink182","789456123","voyager","12qwaszx","snowball","pakistan","playboy","cricket","hooters","therock","redwings","pumpkin","trinity","williams","nintendo","digital","destiny","guinness","bubbles","testing","november","minecraft","asdf1234","lasvegas","broncos","cartman","private","babygirl","beatles","dickhead","12121212","gabriel","eclipse","147258369","explorer","spencer","snickers","buffalo","pantera","metallica","qwertyu","alexande","paradise","montana","michigan","carolina","friends","maximus","vampire","lacrosse","christin","kimberly","kristina","sabrina","0987654321","qwerty1","stalker","poohbear","boobies","bollocks","qweasdzxc","drowssap","caroline","barbara","drummer","einstein","bitches","genesis","vanessa","spitfire","maryjane","1232323q","champion","stephen","october","gregory","svetlana","westside","stanley","courtney","12345qwert","popcorn","patricia","aaaaaaaa","anderson","melanie","abcdefg","security","stargate","simpsons","scarface","123456789a","thumper","1234554321","general","cherokee","a123456","vincent","Usuckballz1","cumshot","frankie","douglas","loveyou","veronica","semperfi","penguin","mercury","liberty","scotland","natalie","vikings","allison","marshall","qwerty12","sandman","antonio","98765432","softball","passion","mnbvcxz","bastard","passport","franklin","alexander","jupiter","claudia","55555555","zaq12wsx","patches","infinity","college","kawasaki","77777777","vladimir","freeuser","wildcats","francis","budlight","brittany","00000000","bulldogs","swordfis","ironman","fantasy","7654321","PASSWORD","jeffrey","timothy","marines","justice","patriots","everton","rasdzv3","pearljam","naughty","colorado","123123a","test123","ncc1701d","motorola","ireland","houston","bradley","9379992","logitech","chopper","simpson","madonna","juventus","zachary","wolverin","warcraft","hello123","extreme","peekaboo","fireman","123654789","russell","panthers","georgia","skyline","elizabet","spiderma","virginia","valentin","predator","arizona","mitchell","titanic","awesome","741852963","1111111111","dreamer","skipper","rolltide","changeme","lovelove","fktrcfylh","loverboy","nemesis","chevelle","cardinal","michael1","147852369","windows","sublime","newport","american","alexandr","victory","rooster","electric","bigcock","wolfpack","spiderman","darkside","classic","123456789q","hendrix","england","01011980","wildcat","freepass"]


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

