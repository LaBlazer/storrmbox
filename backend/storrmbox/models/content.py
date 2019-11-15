import random
import string

from enum import Enum
from datetime import timedelta, datetime
from sqlalchemy import Column
from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    relationship,
    ReferenceCol
)

rand = random.Random()


def _time_now():
    return datetime.utcnow().replace(microsecond=0)


def _time_delta(delta_hours=12, current_time=_time_now()):
    return current_time + timedelta(hours=delta_hours)


def _gen_uid(len=7):
    #rand.seed(seed)
    return ''.join(random.choices(string.ascii_letters + string.digits, k=len))


class ContentType(Enum):
    MOVIE = "movie",
    SERIES = "series",
    EPISODE = "episode",


class Content(SurrogatePK, Model):
    __tablename__ = "content"

    # Required
    imdb_id = Column(db.String(11), nullable=False, unique=True)
    type = Column(db.String(10), nullable=False)

    # Optional
    uid = Column(db.String(7), nullable=False, unique=True, default=_gen_uid, server_default="")
    title = Column(db.String(190), nullable=True)
    date_released = Column(db.Date, nullable=True)
    date_end = Column(db.Date, nullable=True)
    runtime = Column(db.SmallInteger, nullable=True)
    rating = Column(db.Float, nullable=True)
    plot = Column(db.Text, nullable=True)
    genres = Column(db.String(100), nullable=True)
    poster = Column(db.String(160), nullable=True)  # url_for('static', filename='img/no-poster.jpg')
    trailer_youtube_id = Column(db.String(11), nullable=True)
    episode = Column(db.SmallInteger, nullable=True)
    season = Column(db.SmallInteger, nullable=True)
    last_updated = Column(db.DateTime, nullable=False, default=_time_now, onupdate=_time_now)
    fetched = Column(db.Boolean, nullable=False, default=False)
    parent_id = ReferenceCol("content", nullable=True)
    children = relationship("Content")

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Content {}>'.format(repr(self.title))

    @classmethod
    def get_by_uid(cls, uid: str):
        return cls.query.filter_by(uid=uid).first()

    @classmethod
    def get_by_imdb_id(cls, iid: str):
        return cls.query.filter_by(imdb_id=iid).first()
