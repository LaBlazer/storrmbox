from sqlalchemy import Column

from storrmbox.database import (
    db,
    Model,
    ReferenceCol,
    SurrogatePK,
    time_now)


class Search(SurrogatePK, Model):
    __tablename__ = "search"

    user_id = ReferenceCol("users")
    query = Column(db.String(150), nullable=False)
    time = Column(db.DateTime, nullable=False, default=time_now)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Search {}>'.format(repr(self.query))