from datetime import datetime

from flask_restplus import Resource, Namespace, fields
from searchyt import searchyt

from storrmbox.content.scraper import OmdbScraper, ImdbScraper
from storrmbox.exceptions import NotFoundException, InternalException
from storrmbox.extensions import auth, db
from storrmbox.models.content import Content, ContentType
from storrmbox.torrent.providers.eztv_provider import EztvProvider
from storrmbox.torrent.providers.leetx_provider import LeetxProvider
from storrmbox.torrent.scrapers import MovieTorrentScraper

api = Namespace('content', description='Content serving')

torrent_scraper = MovieTorrentScraper()
torrent_scraper.add_provider(LeetxProvider)
torrent_scraper.add_provider(EztvProvider)

yt_search = searchyt()

content_scraper = OmdbScraper()
imdb_scraper = ImdbScraper()


content_fields = api.model("Content", {
    "uid": fields.String,
    "type": fields.String,
    "title": fields.String,
    "date_released": fields.Date,
    "date_end": fields.Date,
    "runtime": fields.Integer,
    "rating": fields.Float,
    "plot": fields.String,
    "genres": fields.String,
    "poster": fields.String,
    "trailer_youtube_id": fields.String,
    "episode": fields.Integer,
    "season": fields.Integer
})


@api.route("/<string:uid>")
class ContentResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields)
    def get(self, uid):
        content = Content.get_by_uid(uid)

        if content is None:
            raise NotFoundException(f"Invalid uid '{uid}'")

        if not content.fetched:
            data = content_scraper.get_by_imdb_id(content.imdb_id)
            print(data)
            if not data or data['Response'] == "False":
                raise InternalException("OMDB API didn't return any data")

            # Skip invalid content
            if data['Poster'] == "N/A":
                raise InternalException("Invalid movie")

            # Get the release and end years
            year_start = datetime.strptime(data['Released'], "%d %b %Y")
            y, sep, year_end = data['Year'].partition("–")

            # Fetch the yt trailer
            trailer_query = ("{} first season" if data['Type'] == "series" else "{} movie") + " official trailer"
            trailer_result = yt_search.search(trailer_query.format(data['Title']))
            if len(trailer_result) == 0:
                raise InternalException("Unable to fetch trailer from yt")

            # Calculate average rating
            # rating_avg = 0.
            # for r in data['Ratings']:
            #     r_val, sep, r_max = r['Value'].partition("/")
            #     rating_avg += float(r_val) / float(r_max or 10)
            # rating_avg /= len(data['Ratings'])
            rating_avg = (float(data['imdbRating']) / 10.) if data['imdbRating'] != "N/A" else -1

            # Update the content with new data and set the fetched field to true
            content.update(True,
                title=data['Title'],
                date_released=year_start,
                date_end=datetime(int(year_end), 1, 1) if year_end else None,
                runtime=int(data['Runtime'][:-4]),
                rating=rating_avg,
                plot=data['Plot'],
                genres=data['Genre'].replace(" ", ""),
                poster=data['Poster'],
                trailer_youtube_id=trailer_result[0]["id"],
                episode=0,
                season=data['totalSeasons'] if data['Type'] == "series" else 0,
                fetched=True
            )

        return content


content_list_fields = api.model("ContentUidList", {
    "uids": fields.List(fields.String)
    #"type": fields.String
})

popular_parser = api.parser()
popular_parser.add_argument('type', type=str, choices=tuple(t.name.lower() for t in ContentType),
                    help='Type of the content', required=True)

@api.route("/popular")
class ContentPopularResource(Resource):

    @auth.login_required
    @api.marshal_with(content_list_fields, as_list=True)
    @api.expect(popular_parser)
    def get(self):
        args = popular_parser.parse_args()
        ctype = args['type']

        results = []
        iids = imdb_scraper.popular(ContentType[ctype.upper()])
        for iid in iids:
            cm = Content.get_by_imdb_id(iid)

            if not cm:
                cm = Content(
                    imdb_id=iid,
                    type=ctype
                )
                db.session.add(cm)

            results.append(cm.uid)

        # Commit all new data
        db.session.commit()

        return {"uids": results}


search_parser = api.parser()
search_parser.add_argument('query', type=str, help='Search query', required=True)
search_parser.add_argument('type', type=str, action='append', choices=tuple(t.name.lower() for t in ContentType),
                    help='Type of the content', required=False)
search_parser.add_argument('amount', type=int, default=6,
                    help='Maximum amount of the content returned', required=False)


@api.route("/search")
class ContentSearchResource(Resource):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @auth.login_required
    @api.marshal_with(content_fields, as_list=True)
    @api.expect(search_parser)
    def get(self):
        args = search_parser.parse_args()

        # Search the query in db first
        result = Content.query.filter(Content.title.ilike(f"%{args['query']}%")).all()

        # We have enough data, return already
        if len(result) >= int(args['amount']):
            return result

        # Query the api
        for c in content_scraper.search(args['query']):

            # Skip games ( why are they even there?? )
            if c['Type'] == "game":
                continue

            # Check if the object is not already in the db/result and skip it
            if any(r.imdb_id == c['imdbID'] for r in result):
                continue

            # Only add content with poster
            if c['Poster'] != "N/A":
                year_start, sep, year_end = c['Year'].partition("–")

                # Fetch the yt trailer
                trailer_query = ("{} first season" if c['Type'] == "series" else "{} movie") + " official trailer"
                trailer_id = yt_search.search(trailer_query.format(c['Title']))[0]["id"]

                # Add the content
                cm = Content(
                    title=c['Title'],
                    type=c['Type'],
                    date_released=datetime(int(year_start or 0), 1, 1),
                    date_end=datetime(int(year_end), 1, 1) if year_end else None,
                    imdb_id=c['imdbID'],
                    poster=c['Poster'],
                    trailer_youtube_id=trailer_id
                )
                db.session.add(cm)
                result.append(cm)

        # Commit all new data
        db.session.commit()

        return result


@api.route("/download")
class ContentDownloadResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields)
    # @api.expect(parser)
    def post(self):
        # ctype = 0
        # for t in args['type']:
        #    ctype |= ContentType[t.upper()]
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
        return []



