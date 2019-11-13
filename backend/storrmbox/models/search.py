from datetime import timedelta, datetime
from sqlalchemy import Column
from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    relationship,
    ReferenceCol
)


class Search(SurrogatePK, Model):
    __tablename__ = "search"

    user_id = ReferenceCol("users")
    query = Column(db.String(150), nullable=False)
    results = Column(db.Text, nullable=False)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Search {}>'.format(repr(self.title))