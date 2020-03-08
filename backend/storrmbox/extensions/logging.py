import logging
import os
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

from .config import config

os.makedirs(Path(config['logs_folder']), exist_ok=True)

formatter = logging.Formatter(f"[%(asctime)s][{os.getpid():<5}:%(name)s] > %(levelname)-7s %(message)s",
                              "%Y-%m-%d %H:%M:%S")

file_handler = TimedRotatingFileHandler(
    os.path.join(config['logs_folder'],  "log"),
    when="d",
    interval=1,
    backupCount=30,
)
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)

stream_handler = logging.StreamHandler()
stream_handler.setLevel(logging.DEBUG)
stream_handler.setFormatter(formatter)

logger = logging.getLogger()
logger.handlers = [stream_handler, file_handler]


logger = logging.getLogger("storrmbox")
logger.setLevel(logging.DEBUG)
