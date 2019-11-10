from dataclasses import dataclass, field
from datetime import datetime
from typing import List, ClassVar
from enum import Enum, IntFlag
from requests import Session
from logging import Logger, getLogger
from interface import Interface
from .. import db


class ContentScraper(Interface):

    def __init__(self):
        self.log = getLogger("content_scraper")
        self.req = Session()

    def search(self, query: str):
        pass
