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


def _time_now():
    return datetime.utcnow().replace(microsecond=0)


def _time_delta(delta_hours=12, current_time=_time_now()):
    return current_time + timedelta(hours=delta_hours)


class Content(SurrogatePK, Model):
    __tablename__ = "content"

    title = Column(db.String(190), nullable=False)
    type = Column(db.String(10), nullable=False)
    date_released = Column(db.Date, nullable=False)
    date_end = Column(db.Date, nullable=True)
    imdb_id = Column(db.String(11), nullable=False, unique=True)
    parent_imdb_id = Column(db.String(11), nullable=True)
    rating = Column(db.Float, nullable=True)
    plot = Column(db.Text, nullable=True)
    poster = Column(db.String(160), nullable=True)  # url_for('static', filename='img/no-poster.jpg')
    trailer_youtube_id = Column(db.String(11), nullable=True)
    episode = Column(db.SmallInteger, nullable=True)
    series = Column(db.SmallInteger, nullable=True)
    last_updated = Column(db.DateTime, nullable=False, default=_time_now, onupdate=_time_now)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Content {}>'.format(repr(self.title))
