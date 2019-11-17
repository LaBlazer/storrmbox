from sqlalchemy import Column

from storrmbox.database import (
    db,
    Model,
    ReferenceCol,
    time_now)


class Search(Model):
    __tablename__ = "search"

    user_id = ReferenceCol("users")
    query = Column(db.String(150), nullable=False)
    time = Column(db.DateTime, primary_key=True, nullable=False, default=time_now) # TODO maybe change the primary key

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Search {}>'.format(repr(self.query))