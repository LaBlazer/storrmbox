from os import getenv
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, ClassVar
from enum import Enum, IntFlag
from requests import Session
from logging import Logger, getLogger
from interface import Interface, implements


class ContentScraper(object):

    def __init__(self):
        self.log = getLogger("content_scraper")
        self.req = Session()

    def search(self, query: str, page=1):
        return []


class OmdbScraper(ContentScraper):
    base_url = "https://www.omdbapi.com/"

    def __init__(self):
        super().__init__()
        self.api_key = getenv('OMDB_API_KEY')

        if not self.api_key:
            raise Exception("Invalid OMDB api key!")

    def search(self, query: str, page=1):
        resp = self.req.get(url=OmdbScraper.base_url, params={"apiKey": self.api_key, "s": query, "page": page})

        if resp.status_code != 200:
            self.log.error(f"Error while searching content ({resp.status_code})")
            return []

        data = resp.json()

        if data["Response"] == "True":
            return data["Search"]

        self.log.error(f"Error while searching content '{data.get('Error', resp.text)}'")
        return []


