import functools, os
from enum import IntFlag
from flask_restplus import Resource, Namespace, fields
from searchyt import searchyt
from datetime import datetime

from storrmbox.extensions import auth, db
from storrmbox.models.content import Content
from storrmbox.torrent.providers.eztv_provider import EztvProvider
from storrmbox.torrent.providers.leetx_provider import LeetxProvider
from storrmbox.torrent.scrapers import MovieTorrentScraper, VideoQuality
from storrmbox.content.scraper import OmdbScraper

api = Namespace('content', description='Content serving')

torrent_scraper = MovieTorrentScraper()
torrent_scraper.add_provider(LeetxProvider)
torrent_scraper.add_provider(EztvProvider)

yt_search = searchyt()

content_scraper = OmdbScraper()

class ContentType(IntFlag):
    ALL = 0xFF,
    MOVIE = 1 << 1,
    SHOW = 1 << 2,
    ANIME = 1 << 3,
    NSFW = 1 << 4


class TypeIdToString(fields.Raw):
    def format(self, value):
        res = []

        for type in ContentType:
            if value & type.value:
                res.append(type.name)

        return res


content_fields = api.model("Content", {
    "id": fields.Integer,
    "title": fields.String,
    "date_released": fields.Date,
    "date_end": fields.Date,
    "imdb_id": fields.String,
    "rating": fields.Float,
    "plot": fields.String,
    "poster": fields.String,
    "trailer_youtube_id": fields.String,
    "episode": fields.Integer,
    "series": fields.Integer
})


@api.route("/popular")
class ContentResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields, as_list=True)
    def get(self):
        res = []

        # for i in range(1, 20):
        #     res.append({
        #         'id': i,
        #         'name': 'test content ' + str(i),
        #         'year': 2019,
        #         'year_end': None,
        #         'description': 'This is a test content',
        #         'rating': i % 5,
        #         'type': ContentType.MOVIE,
        #         'thumbnail': 'https://picsum.photos/200/300'
        #     })

        return res


parser = api.parser()
parser.add_argument('query', type=str, help='Search query', required=True)
parser.add_argument('type', type=str, action='append', choices=tuple(t.name.lower() for t in ContentType),
                    help='Type of the content', required=True)
#parser.add_argument('in_files', type=FileStorage, location='files')


@api.route("/search")
class ContentSearchResource(Resource):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @auth.login_required
    @api.marshal_with(content_fields, as_list=True)
    @api.expect(parser)
    def get(self):
        args = parser.parse_args()
        ctype = 0
        for t in args['type']:
            ctype |= ContentType[t.upper()]

        content = content_scraper.search(args['query'])

        content_list = []

        for c in content:
            print(c)
            year_start, sep, year_end = c['Year'].partition("–")

            yt_trailer_query = "{} first season official trailer" if c['Type'] == "series" else "{} official trailer"

            # Only add content with poster
            if c['Poster'] != "N/A":
                cm = Content(
                    title=c['Title'],
                    type=c['Type'],
                    date_released=datetime(int(year_start or 0), 1, 1),
                    date_end=datetime(int(year_end), 1, 1) if year_end else None,
                    imdb_id=c['imdbID'],
                    poster=c['Poster'],
                    trailer_youtube_id=yt_search.search(yt_trailer_query.format(c['Title']))[0]["id"]
                )
                db.session.add(cm)
                content_list.append(cm)

            db.session.commit()


       # print(movies)



        # torrents = []
        # if ctype & ContentType.MOVIE:
        #     torrents = scraper.search_movie(args['query'])
        # elif ctype & ContentType.SHOW:
        #     torrents = scraper.search_series(args['query'], 1, 1, VideoQuality.HD)
        #
        # for i, t in enumerate(torrents):
        #     res.append({
        #         'id': i,
        #         'name': 'test search content ' + str(i),
        #         'year': 2019,
        #         'year_end': None,
        #         'description': 'Name: {}, Seeders: {}, Leechers: {}'.format(t.name, t.seeders, t.leechers),
        #         'rating': i % 5,
        #         'type': ctype,
        #         'thumbnail': 'https://picsum.photos/200/300'
        #     })




        return content_list


@api.route("/download")
class ContentDownloadResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields)
    # @api.expect(parser)
    def post(self):
        pass

