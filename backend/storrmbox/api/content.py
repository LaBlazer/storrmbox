import os
import re
from http import HTTPStatus
from threading import Thread
from typing import Dict, List, Optional

from flask import g, send_file, Response
from flask_restplus import Resource, Namespace, fields
from searchyt import searchyt
from sqlalchemy.orm import load_only

from storrmbox.api.task import task_id
from storrmbox.content.scraper import OmdbScraper, ImdbScraper
from storrmbox.extensions import auth, db, task_queue, logger
from storrmbox.extensions.auth import with_permission, PermissionLevel
from storrmbox.models.content import Content, ContentType
from storrmbox.models.popular import Popular
from storrmbox.models.search import Search
from storrmbox.models.top import Top
from storrmbox.tasks.content import download, serve
from storrmbox.torrent.client import TorrentInfo
from storrmbox.torrent.client.deluge import Deluge
from storrmbox.torrent.scraper import TorrentDetails

api = Namespace('content', description='Content serving')

yt_search = searchyt()

content_scraper = OmdbScraper()
imdb_scraper = ImdbScraper()

# API Model definitions
content_fields = api.model("Content", {
    "uid": fields.String,
    "type": fields.Integer,
    "title": fields.String,
    "year_released": fields.Integer,
    "year_end": fields.Integer,
    "runtime": fields.Integer,
    "rating": fields.Float,
    "plot": fields.String,
    "genres": fields.String,
    "poster": fields.String,
    "trailer_youtube_id": fields.String,
    "episode": fields.Integer,
    "season": fields.Integer,
    "parent": fields.String(attribute='parent_uid')
})

content_list_fields = api.model("ContentUidList", {
    "uids": fields.List(fields.String)
    # "type": fields.String
})

content_episode = api.model("ContentEpisode", {
    "uid": fields.String,
    "title": fields.String,
    "rating": fields.Float,
    "episode": fields.Integer
})

content_season = api.model("ContentSeason", {
    "season": fields.Integer,
    "episodes": fields.List(fields.Nested(content_episode))
})

content_season_list = api.model("ContentSeasonList", {
    "seasons": fields.List(fields.Nested(content_season))
})


@api.route("/<string:uid>")
class ContentResource(Resource):

    @auth.login_required
    @api.marshal_with(content_fields)
    def get(self, uid):
        if len(uid) > Content.uid.type.length:
            return api.abort(HTTPStatus.BAD_REQUEST, f"Invalid UID '{uid}'")

        content = Content.get_by_uid(uid)

        if not content:
            return api.abort(HTTPStatus.BAD_REQUEST, f"UID '{uid}' was not found")

        # Fetch poster and plot from omdb
        if not content.fetched:
            logger.info(f"Fetching content {uid} ({content.imdb_id}) from omdb")
            data = content_scraper.get_by_imdb_id(content.imdb_id)
            fetched = True  # Fix for omdb being too slow

            # Fix no data/poster/plot
            if not data.get('Poster'):
                fetched = False
                data['Poster'] = "https://lblzr.com/img/nopreview.png"

            if not data.get('Plot'):
                fetched = False
                data['Plot'] = ""

            # Fetch the yt trailer
            trailer_result = None
            if content.type != ContentType.episode:
                trailer_query = ("{} first season" if data['Type'] == "series" else "{} movie") + " official trailer"
                trailer_result = yt_search.search(trailer_query.format(data['Title']))[0]["id"]
                # if len(trailer_result) == 0:
                #    return api.abort(HTTPStatus.BAD_REQUEST, "Unable to fetch trailer from yt")

            # Update the content with new data and set the fetched field to true if fetched correctly
            content.update(True,
                           plot=data['Plot'],
                           poster=data['Poster'],
                           trailer_youtube_id=trailer_result,
                           fetched=fetched
                           )

        return content


@api.route("/<string:uid>/episodes")
class EpisodesContentResource(Resource):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @auth.login_required
    @api.marshal_with(content_season_list)
    def get(self, uid):
        content = Content.get_by_uid(uid)

        if not content:
            return api.abort(HTTPStatus.BAD_REQUEST, f"Invalid uid '{uid}'")

        if content.type != ContentType.series:
            return api.abort(HTTPStatus.BAD_REQUEST, "Invalid content type")

        episodes = Content.query.options(
            load_only(Content.uid, Content.title, Content.rating, Content.episode, Content.season)) \
            .filter(Content.parent_uid == content.uid).all()

        if episodes:
            season_amount = max(episodes, key=lambda e: e.season).season
            result = [{"season": s, "episodes": [e for e in episodes if e.season == s]} for s in
                      range(1, season_amount + 1)]
        else:
            result = []

        return {"seasons": result}

# Temporary
@api.route("/<string:uid>/serve")
class ServeContentResource(Resource):
    episode_pattern = re.compile(r'.*s(?P<season>\d{1,2})[.\w]?e(?P<episode>\d{2}).*\.(mp4|mkv)$', re.IGNORECASE)
    torrent_client = Deluge()
    torrent_client.run()
    file_cache: Dict[str, str] = {}

    @staticmethod
    def _get_episode(files: List[str], season: int, episode: int) -> str:
        for file in files:
            match = ServeContentResource.episode_pattern.match(file)
            if match and int(match.group('episode')) == episode and int(match.group('season')) == season:
                return file
        return ""

    def _update_cache(self, uid: str) -> Optional[str]:
        content = Content.get_by_uid(uid)
        if not content:
            return None

        info = self.torrent_client.get_torrent_info(content.uid)
        if info:
            logger.debug(f"Info: {info}")
            file = self._get_episode(info.files, content.season, content.episode)

            # Check if file really exists
            if os.path.isfile(file):
                # Cache it if it does
                self.file_cache[content.uid] = file
                return file
        # Try getting whole season if content is episode
        if content.type == ContentType.episode:
            info = self.torrent_client.get_torrent_info(f"{content.parent.uid}_s{content.season}")
            if info:
                logger.debug(f"Info: {info}")
                for episode in content.parent.episodes:
                    if episode.season == content.season:
                        logger.debug(f"Ep: {episode.title}")
                        file = self._get_episode(info.files, content.season, episode.episode)

                        # Check if file really exists
                        if os.path.isfile(file):
                            # Cache it if it does
                            self.file_cache[episode.uid] = file

                return self.file_cache[content.uid]
        return None

    # TODO: Add auth, maybe a token in query string?
    @api.doc(description='Serves the content')
    @api.response(200, description="returns content stream")
    @api.produces(["video/mp4"])
    def get(self, uid):
        # First try to get the file(s) from cache (hot path)
        file = self.file_cache.get(uid)
        if not file:
            # Otherwise get it from torrent client
            file = self._update_cache(uid)
            logger.debug(self.file_cache)

            if not file:
                return api.abort(404)

            logger.info(f"Serving file '{file}'")
        try:
            return send_file(file, mimetype="video/mp4", conditional=True, add_etags=False)
        except (OSError, IOError) as e:
            logger.error(f"Error while serving '{uid}': {e}")
            del self.file_cache[uid]

        return api.abort(404)


@api.route("/<string:uid>/download")
class DownloadContentResource(Resource):

    @auth.login_required
    @api.marshal_with(task_id)
    def get(self, uid):
        content = Content.get_by_uid(uid)

        if content:
            if content.type == ContentType.series:
                return api.abort(HTTPStatus.BAD_REQUEST, "Invalid content type")

            if ServeContentResource.file_cache.get(content.uid):
                return {"id": serve(content).id}

            return {"id": download(uid, g.user.id).id}

        return api.abort(HTTPStatus.BAD_REQUEST, f"Invalid uid '{uid}'")


@api.route("/popular")
class PopularContentResource(Resource):
    popular_parser = api.parser()
    popular_parser.add_argument('type', type=str, choices=("movie", "series"),
                                help='Type of the content', required=True)

    def _get_popular(self, ctype):
        # Fetch popular content
        cache = []
        for iid in imdb_scraper.get_popular(ctype):
            content = Content.get_by_imdb_id(iid)

            # If the content is not in db skip it
            if content:
                cache.append(Popular(
                    content_id=content.uid,
                    type=ctype.value
                ))

        return cache

    @auth.login_required
    @api.marshal_with(content_list_fields)
    @api.expect(popular_parser)
    def get(self):
        args = self.popular_parser.parse_args()
        ctype = ContentType[args.type]

        return {"uids": [c.content_id for c in Popular.fetch(Popular.type, ctype, self._get_popular, ctype)]}


@api.route("/top")
class TopContentResource(Resource):
    top_parser = api.parser()
    top_parser.add_argument('type', type=str, choices=("movie", "series"),
                            help='Type of the content', required=True)

    def _get_top(self, ctype):
        # Fetch top content
        cache = []
        for iid in imdb_scraper.get_top(ctype):
            content = Content.get_by_imdb_id(iid)

            # If the content is not in db skip it
            if content:
                cache.append(Top(
                    content_id=content.uid,
                    type=ctype.value
                ))

        return cache

    @auth.login_required
    @api.marshal_with(content_list_fields)
    @api.expect(top_parser)
    def get(self):
        args = self.top_parser.parse_args()
        ctype = ContentType[args.type]

        return {"uids": [c.content_id for c in Top.fetch(Top.type, ctype, self._get_top, ctype)]}


@api.route("/search")
class SearchContentResource(Resource):
    search_parser = api.parser()
    search_parser.add_argument('query', type=str, help='Search query', required=True)
    search_parser.add_argument('type', type=str, choices=tuple(t.name for t in ContentType),
                               help='Type of the content', required=False)
    search_parser.add_argument('amount', type=int, default=6,
                               help='Minimum amount of the content returned', required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @auth.login_required
    @api.marshal_with(content_list_fields, as_list=True)
    @api.expect(search_parser)
    def get(self):
        args = self.search_parser.parse_args()

        # Store the search in db
        db.session.add(Search(
            user=g.user,
            query=args.query
        ))

        # Search the query in db first
        results = Content.query.options(load_only("uid"))\
            .filter(Content.title.ilike(f"%{args.query}%"), Content.votes.isnot(None))\
            .order_by(Content.votes.desc()).all()

        # Filter content if type is specified
        uids = []
        for r in results:
            if not args.type or r.type.name == args.type:
                uids.append(r.uid)

        # We have enough data, return already
        if len(uids) >= int(args.amount):
            return {"uids": uids}

        # Query the api until we have enough results, maximum up to page 5
        continue_search = True
        current_page = 1
        while continue_search and current_page <= 5:
            content = content_scraper.search(args.query, current_page)
            # Break if no content was found
            if not content:
                break

            content, total_results = content
            for c in content:
                # Skip games ( why are they even there?? )
                if c['Type'] == "game":
                    continue

                # Skip content with different type
                if args.type and args.type != c['Type']:
                    continue

                # Check if the object is not already in the db/result and skip it
                cm = Content.get_by_imdb_id(c['imdbID'])
                if cm:
                    if cm.uid not in uids:
                        uids.append(cm.uid)
                    continue

                # Only add content with poster
                if c['Poster'] != "N/A":
                    # Add the content
                    cm = Content(
                        imdb_id=c['imdbID'],
                        type=ContentType[c['Type']].value,
                        title=c['Title']
                    )
                    db.session.add(cm)
                    uids.append(cm.uid)

            # If we are on the last page or we have enough results exit the loop
            current_page += 1
            if (current_page * 10) > total_results or len(uids) >= int(args.amount):
                continue_search = False

        # Commit all new data
        db.session.commit()

        return {"uids": uids}


@api.route("/reload")
class ReloadContentResource(Resource):

    # TODO: make this admin-only
    @auth.login_required
    @with_permission(PermissionLevel.Admin)
    def get(self):
        thread = Thread(target=self.update_data)
        thread.start()

    @staticmethod
    def update_data():
        chunk = 0
        objects = []
        try:
            # TODO: Only update existing content
            # Temporarily drop the whole DB each time
            # Content.__table__.drop(db.engine)

            for c in imdb_scraper.get_content():

                c["uid"] = Content.generate_uid(c["imdb_id"])
                objects.append(c)
                chunk += 1

                if chunk >= 100000:
                    db.session.bulk_insert_mappings(Content, objects)
                    db.session.commit()
                    objects = []
                    chunk = 0

            db.session.bulk_insert_mappings(Content, objects)
            db.session.commit()

        finally:
            pass
