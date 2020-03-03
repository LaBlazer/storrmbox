import logging
import os
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

from .config import config

os.makedirs(Path(config['logs_folder']), exist_ok=True)
logging.basicConfig(level=logging.DEBUG,
                    format=f"[%(asctime)s]: {os.getpid():<5} > %(levelname)-7s %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S",
                    handlers=[
                        logging.StreamHandler(),
                        TimedRotatingFileHandler(
                           Path(config['logs_folder']) / "log.txt",
                           when="d",
                           interval=1,
                           backupCount=30
                        )
                    ])

logger = logging.getLogger("storrmbox")
