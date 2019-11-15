import random
import string

from flask import url_for
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


def _gen_uid(len = 16):
    #rand.seed(seed)
    return ''.join(random.choices(string.ascii_letters + string.digits, k=len))


class Content(SurrogatePK, Model):
    __tablename__ = "content"

    uid = Column(db.String(16), nullable=False, unique=True, default=_gen_uid, server_default="")
    title = Column(db.String(190), nullable=False)
    type = Column(db.String(10), nullable=False)
    date_released = Column(db.Date, nullable=False)
    date_end = Column(db.Date, nullable=True)
    imdb_id = Column(db.String(11), nullable=False, unique=True)
    parent_id = ReferenceCol("content", nullable=True)
    rating = Column(db.Float, nullable=True)
    plot = Column(db.Text, nullable=True)
    poster = Column(db.String(160), nullable=True)  # url_for('static', filename='img/no-poster.jpg')
    trailer_youtube_id = Column(db.String(11), nullable=True)
    episode = Column(db.SmallInteger, nullable=True)
    series = Column(db.SmallInteger, nullable=True)
    last_updated = Column(db.DateTime, nullable=False, default=_time_now, onupdate=_time_now)
    children = relationship("Content")

    def __init__(self, *args, **kwargs):
        #print(kwargs.get('imdb_id', rand.randint(0, 10000)))
        #self.uid = _gen_uid(kwargs.get('imdb_id', None))
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Content {}>'.format(repr(self.title))

    @classmethod
    def get_by_uid(cls, uid: str):
        return cls.query.filter_by(uid=uid).first()
