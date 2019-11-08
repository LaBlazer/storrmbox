import functools, os
from enum import IntFlag
from flask_restplus import Resource, Namespace, fields

from storrmbox.extensions import auth
from storrmbox.torrent.providers.eztv_provider import EztvProvider
from storrmbox.torrent.providers.leetx_provider import LeetxProvider
from storrmbox.torrent.scrapers import MovieTorrentScraper, VideoQuality

api = Namespace('content', description='Content serving')


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
    "name": fields.String,
    "year": fields.Integer,
    "year_end": fields.Integer(default=0),
    "description": fields.String,
    "rating": fields.Integer,
    "type": TypeIdToString(attribute='type'),
    "thumbnail": fields.String
})

############################### MAIL NA UDBS POSLI

@api.route("/popular")
class ContentResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields, as_list=True)
    def get(self):
        res = []

        for i in range(1, 20):
            res.append({
                'id': i,
                'name': 'test content ' + str(i),
                'year': 2019,
                'year_end': None,
                'description': 'This is a test content',
                'rating': i % 5,
                'type': ContentType.MOVIE,
                'thumbnail': 'https://picsum.photos/200/300'
            })

        return res


parser = api.parser()
parser.add_argument('query', type=str, help='Search query', required=True)
parser.add_argument('type', type=str, action='append', choices=tuple(t.name.lower() for t in ContentType),
                    help='Type of the content', required=True)
#parser.add_argument('in_files', type=FileStorage, location='files')


@api.route("/search")
class ContentSearchResource(Resource):
    scraper = MovieTorrentScraper()
    scraper.add_provider(LeetxProvider)
    scraper.add_provider(EztvProvider)

    @auth.login_required
    @api.marshal_with(content_fields, as_list=True)
    @api.expect(parser)
    def get(self):
        res = []
        args = parser.parse_args()
        type = 0
        for t in args['type']:
            type |= ContentType[t.upper()]

        torrents = []
        if type & ContentType.MOVIE:
            torrents = self.scraper.search_movie(args['query'])
        elif type & ContentType.SHOW:
            torrents = self.scraper.search_series(args['query'], 1, 1, VideoQuality.HD)

        for i, t in enumerate(torrents):
            res.append({
                'id': i,
                'name': 'test search content ' + str(i),
                'year': 2019,
                'year_end': None,
                'description': 'Name: {}, Seeders: {}, Leechers: {}'.format(t.name, t.seeders, t.leechers),
                'rating': i % 5,
                'type': type,
                'thumbnail': 'https://picsum.photos/200/300'
            })

        return res


@api.route("/download")
class ContentDownloadResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields)
    # @api.expect(parser)
    def post(self):
        pass

