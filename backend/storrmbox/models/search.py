from sqlalchemy import Column

from storrmbox.database import (
    sa,
    db,
    Model,
    ReferenceCol,
    time_now)


class Search(Model):
    __tablename__ = "search"

    user_id = ReferenceCol("users", primary_key=True)
    query = Column(sa.String(150), nullable=False, primary_key=True)
    time = Column(sa.DateTime, nullable=False, default=time_now, primary_key=True)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Search {}>'.format(repr(self.query))