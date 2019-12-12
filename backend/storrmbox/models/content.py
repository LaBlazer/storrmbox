import random
import string
from enum import Enum

from storrmbox.database import (
    db,
    sa,
    IntEnum,
    SurrogatePK,
    Model,
    relationship,
    ReferenceCol,
    time_now)

rand = random.Random()


def _gen_uid(seed: str, len=7):
    rand.seed(seed)
    return ''.join(rand.choices(string.ascii_letters + string.digits, k=len))


class ContentType(Enum):
    movie = 1
    series = 2
    episode = 3

    def get(self):
        return self.value


class Content(SurrogatePK, Model):
    __tablename__ = "content"

    # Required
    imdb_id = sa.Column(sa.String(11), nullable=False, unique=True)
    type = sa.Column(db.String(10), nullable=False)

    # Optional
    uid = sa.Column(sa.String(7), nullable=False, unique=True)
    title = sa.Column(sa.String(190), nullable=True)
    date_released = sa.Column(sa.Date, nullable=True)
    date_end = sa.Column(sa.Date, nullable=True)
    runtime = sa.Column(sa.SmallInteger, nullable=True)
    rating = sa.Column(sa.Float, nullable=True)
    plot = sa.Column(sa.Text, nullable=True)
    genres = sa.Column(sa.String(100), nullable=True)
    poster = sa.Column(sa.String(160), nullable=True)
    trailer_youtube_id = sa.Column(sa.String(11), nullable=True)
    episode = sa.Column(sa.SmallInteger, nullable=True)
    season = sa.Column(sa.SmallInteger, nullable=True)
    last_updated = sa.Column(sa.DateTime, nullable=False, default=time_now, onupdate=time_now)
    fetched = sa.Column(sa.Boolean, nullable=False, default=False)
    parent_id = ReferenceCol("content", nullable=True)

    children = relationship("Content")
    popular = relationship("Popular", backref="content")

    def __init__(self, *args, **kwargs):
        kwargs['uid'] = _gen_uid(str(kwargs['imdb_id']))  # Generate the uid with imdb_id as seed
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Content {}>'.format(repr(self.title))

    @classmethod
    def get_by_uid(cls, uid: str):
        return cls.query.filter_by(uid=uid).first()

    @classmethod
    def get_by_imdb_id(cls, iid: str):
        return cls.query.filter_by(imdb_id=iid).first()
