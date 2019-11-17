from sqlalchemy import Column

from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    ReferenceCol,
    time_now)


class Popular(SurrogatePK, Model):
    __tablename__ = "popular"

    content_id = ReferenceCol("content")
    index = Column(db.SmallInteger, nullable=False)
    time = Column(db.DateTime, nullable=False, default=time_now)
    type = Column(db.String(10), nullable=False)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Popular {}>'.format(repr(self.query))