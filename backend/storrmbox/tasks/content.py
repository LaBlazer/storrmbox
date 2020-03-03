import time

from storrmbox.extensions import task_queue, logger
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
def download(content: Content):
    torrent_info = torrent_client.get_torrent_info(content.uid)
    if torrent_info:
        return f"content/{content.uid}/serve"

    # Get the magnet link
    logger.debug("Getting torrents")
    torrent = torrent_scraper.search_content(content)
    logger.info(f"Found torrent: {torrent}")

    # Send magnet to the torrent client
    torrent_info = torrent_client.add_torrent(torrent.magnet, content.uid)

    # Wait until the content is at least 8% downloaded
    while torrent_info.progress <= 0.08:
        time.sleep(3)

    # Return the content serve url
    logger.debug("Done")
    return f"content/{content.uid}/serve"
