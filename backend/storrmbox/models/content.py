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

class ContentType(int, Enum):
    movie = 1
    series = 2
    episode = 3

    def get(self):
        return self.value


class Content(Model):
    _rand = random.Random()
    __tablename__ = "content"

    # PK
    uid = sa.Column(sa.String(7), nullable=False, primary_key=True)

    # Required
    imdb_id = sa.Column(sa.String(11), nullable=False, unique=True)
    type = sa.Column(sa.SmallInteger, nullable=False)

    # Optional
    title = sa.Column(sa.String(190), nullable=True)
    original_title = sa.Column(sa.String(190), nullable=True)
    year_released = sa.Column(sa.SmallInteger, nullable=True)
    year_end = sa.Column(sa.SmallInteger, nullable=True)
    runtime = sa.Column(sa.SmallInteger, nullable=True)
    rating = sa.Column(sa.Float, nullable=True)
    votes = sa.Column(sa.Integer, nullable=True)
    plot = sa.Column(sa.Text, nullable=True)
    genres = sa.Column(sa.String(100), nullable=True)
    poster = sa.Column(sa.String(160), nullable=True)
    trailer_youtube_id = sa.Column(sa.String(11), nullable=True)
    episode = sa.Column(sa.SmallInteger, nullable=True)
    season = sa.Column(sa.SmallInteger, nullable=True)
    parent_uid = ReferenceCol("content", nullable=True, pk_name="uid")
    fetched = sa.Column(sa.Boolean, nullable=False, default=False)

    # Auto
    last_updated = sa.Column(sa.DateTime, nullable=False, default=time_now, onupdate=time_now)

    children = relationship("Content")
    popular = relationship("Popular", backref="content")

    def __init__(self, *args, **kwargs):
        kwargs['uid'] = self.generate_uid(str(kwargs['imdb_id']))  # Generate the uid with imdb_id as seed
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Content {}>'.format(repr(self.title))

    @staticmethod
    def generate_uid(seed: str):
        Content._rand.seed(seed)
        return ''.join(Content._rand.choices(string.ascii_letters + string.digits, k=Content.uid.type.length))

    @classmethod
    def get_by_uid(cls, uid: str):
        return cls.query.filter_by(uid=uid).first()

    @classmethod
    def get_by_imdb_id(cls, iid: str):
        return cls.query.filter_by(imdb_id=iid).first()
