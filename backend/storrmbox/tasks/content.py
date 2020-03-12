import time
from typing import Optional

from storrmbox.extensions import task_queue, logger, db
from storrmbox.models.download import Download
from .base import Tasks

from storrmbox.models.content import Content
from storrmbox.torrent.client.deluge import Deluge
from storrmbox.torrent.scraper import ContentTorrentScraper
# from storrmbox.torrent.scraper.providers.eztv_provider import EztvProvider
from storrmbox.torrent.scraper.providers.leetx_provider import LeetxProvider

torrent_scraper = ContentTorrentScraper()
torrent_scraper.add_provider(LeetxProvider)
# torrent_scraper.add_provider(EztvProvider)

torrent_client = Deluge()
torrent_client.run()


@task_queue.task()
def download(uid: str, user_id: str) -> Optional[str]:
    with Tasks.app.app_context():
        content = Content.get_by_uid(uid)

        torrent_info = torrent_client.get_torrent_info(content.uid)
        if torrent_info:
            return f"content/{content.uid}/serve"

        # Get the magnet link
        logger.debug("Getting torrents")
        torrent = torrent_scraper.search_content(content)

        if not torrent:
            logger.error(f"No magnet found for content '{content.uid}'")
            return None

        logger.info(f"Found torrent: {torrent}")

        # Send magnet to the torrent client
        # TODO: Set higher priority to required episode if we are downloading entire season
        torrent_name = f"{content.parent.uid}_s{content.season}" if torrent.entire_season else content.uid
        torrent_info = torrent_client.add_torrent(torrent.magnet, torrent_name)

        if not torrent_info:
            logger.error(f"Could not add torrent magnet '{torrent.magnet.split('&')[0]}'")
            return None

        # Track the torrent download
        Download(
            user_id=user_id,
            content_id=content.uid,
            infohash=torrent_info.hash
        ).save()

        # Wait until the content is at least 10% downloaded
        while torrent_info and torrent_info.progress <= 0.1:
            time.sleep(4)
            torrent_info = torrent_client.get_torrent_info(torrent_name)

        # Return the content serve url
        logger.debug("Done")
        return f"content/{content.uid}/serve"


@task_queue.task()
def serve(content: Content) -> str:
    return f"content/{content.uid}/serve"
