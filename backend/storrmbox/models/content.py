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

    title = Column(db.String(80), unique=True, nullable=False)
    type = Column(db.String(10), nullable=False)
    year = Column(db.SmallInt, nullable=False)
    year_end = Column(db.SmallInt, nullable=True, default=0)
    imdb_id = Column(db.String(11), nullable=False)
    rating = Column(db.SmallInt, nullable=True, default=-1)
    plot = Column(db.Text, nullable=True, default="")
    poster = Column(db.String(160), nullable=False, default=url_for('static', filename='img/no-poster.jpg'))
    last_updated = Column(db.DateTime, nullable=False, default=_time_now, onupdate=_time_now)

    # def __init__(self, token, regeneration_token, user, expires_on, **kwargs):
    # db.Model.__init__(self, token=token, regeneration_token=regeneration_token, user=user, expires_on=expires_on, **kwargs)

    def __repr__(self):
        return '<Content {}>'.format(repr(self.title))
