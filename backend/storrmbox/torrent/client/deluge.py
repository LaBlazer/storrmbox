import os
import subprocess
import time
from typing import Optional, List

from . import TorrentInfo, TorrentClient, implements
from deluge_client import DelugeRPCClient

from storrmbox.extensions.config import config
from storrmbox.extensions.logging import logger
from storrmbox import ROOT_PATH


# add_paused (bool): Add the torrrent in a paused state.
# auto_managed (bool): Set torrent to auto managed mode, i.e. will be started or queued automatically.
# download_location (str): The path for the torrent data to be stored while downloading.
# file_priorities (list of int): The priority for files in torrent, range is [0..7] however
#     only [0, 1, 4, 7] are normally used and correspond to [Skip, Low, Normal, High]
# mapped_files (dict): A mapping of the renamed filenames in 'index:filename' pairs.
# max_connections (int): Sets maximum number of connections this torrent will open.
#     This must be at least 2. The default is unlimited (-1).
# max_download_speed (float): Will limit the download bandwidth used by this torrent to the
#     limit you set.The default is unlimited (-1) but will not exceed global limit.
# max_upload_slots (int): Sets the maximum number of peers that are
#     unchoked at the same time on this torrent. This defaults to infinite (-1).
# max_upload_speed (float): Will limit the upload bandwidth used by this torrent to the limit
#     you set. The default is unlimited (-1) but will not exceed global limit.
# move_completed (bool): Move the torrent when downloading has finished.
# move_completed_path (str): The path to move torrent to when downloading has finished.
# name (str): The display name of the torrent.
# owner (str): The user this torrent belongs to.
# pre_allocate_storage (bool): When adding the torrent should all files be pre-allocated.
# prioritize_first_last_pieces (bool): Prioritize the first and last pieces in the torrent.
# remove_at_ratio (bool): Remove the torrent when it has reached the stop_ratio.
# seed_mode (bool): Assume that all files are present for this torrent (Only used when adding a torent).
# sequential_download (bool): Download the pieces of the torrent in order.
# shared (bool): Enable the torrent to be seen by other Deluge users.
# stop_at_ratio (bool): Stop the torrent when it has reached stop_ratio.
# stop_ratio (float): The seeding ratio to stop (or remove) the torrent at.
# super_seeding (bool): Enable super seeding/initial seeding.


class Deluge(implements(TorrentClient)):

    def __init__(self):
        self.client = DelugeRPCClient(config["deluge_hostname"],
                                      config["deluge_port"],
                                      config["deluge_username"],
                                      config["deluge_password"],
                                      decode_utf8=True,
                                      automatic_reconnect=True)

    def setup(self) -> bool:
        daemon_path = config["deluge_daemon_path"]
        if not os.path.isfile(daemon_path):
            logger.error("Deluge daemon path is invalid, cannot setup")
            return False

        config_path = os.path.join(ROOT_PATH, "deluged_config")
        logger.debug(f"Running deluge daemon with config path '{config_path}'")
        logger.debug(f'"{daemon_path}" -c "{config_path}"')
        subprocess.Popen(f'"{daemon_path}" -c "{config_path}"', stdout=subprocess.PIPE, shell=True)
        time.sleep(1)

        # TODO: Check if deluge has correct settings, if not change them and restart it
        # TODO: enable labels plugin
        return True

    def connect(self) -> bool:
        """Tries to connect to the service automatically"""
        try:
            self.client.connect()
            return self.client.connected
        except Exception as ex:
            logger.error(f"Could not connect to deluge daemon: {ex}")
            return False

    def run(self):
        """Tries to setup and connect automatically"""
        # Try to connect, maybe the daemon is already running
        if self.connect():
            logger.info("Deluge daemon is already running, skipping setup")
            return

        if self.setup() and self.connect():
            logger.info("Deluge daemon is up")
            return

        raise Exception("Failed to run Deluge")

    def add_torrent(self, magnet_uri: str, uid: str) -> TorrentInfo:
        # uid = uid.lower() # Labels plugin is not case sensitive
        # logger.debug(self.client.call('label.get_labels'))
        torrent_info = self.get_torrent_info(uid)
        if torrent_info:
            return torrent_info

        # https://github.com/deluge-torrent/deluge/blob/develop/deluge/core/torrent.py
        infohash = self.client.core.add_torrent_magnet(magnet_uri, {
            'download_location': os.path.abspath(config['download_folder']),
            'stop_at_ratio': True,
            'stop_ratio': config["deluge_share_ratio"],
            'prioritize_first_last_pieces': True,
            'sequential_download': True,
            'name': uid})

        logger.debug(f"Torrent infohash: {infohash}")

        logger.debug(self.client.core.get_torrent_status(infohash, ["name", "paused"]))

        if not infohash:
            raise Exception("Unable to add torrent")

        # if uid:
        #     self.client.call('label.add', uid)
        #     self.client.call('label.set_torrent', result, uid)

        return self.get_torrent_info(uid)

    def list_torrents(self) -> List[str]:
        logger.info('Getting a list of torrent hashes')
        self._login()
        result = self.rpcclient.call('core.get_torrents_status', {}, ['name'])
        logger.debug(set(x.lower() for x in result.keys()))
        return []

    def get_torrent_info(self, uid: str) -> Optional[TorrentInfo]:
        # https://github.com/deluge-torrent/deluge/blob/develop/deluge/core/torrent.py#L1037
        result = self.client.core.get_torrents_status({'name': uid}, [
            "download_location",
            "download_payload_rate",
            "num_peers",
            "num_seeds",
            "ratio",
            "total_size",
            "progress",
            "files"
        ])

        if len(result.keys()) > 1:
            logger.error(f"More than one torrent with uid '{uid}'... This should not happen")

        logger.debug(result)

        hash = list(result.keys())[0]

        if result:
            return TorrentInfo(
                hash=hash,
                speed=result[hash]['download_payload_rate'],
                peers=result[hash]['num_peers'],
                seeders=result[hash]['num_seeds'],
                ratio=result[hash]['ratio'],
                size=result[hash]['total_size'],
                progress=result[hash]['progress'] / 100.,
                files=[os.path.join(result[hash]['download_location'], file['path'])
                       for file in result[hash]['files']]
            )

        return None

    def set_seed_ratio(self, seed_ratio):
        pass
