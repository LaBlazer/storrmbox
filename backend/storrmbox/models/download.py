from sqlalchemy import Column

from storrmbox.extensions.database import (
    sa,
    db,
    Model,
    ReferenceCol,
    time_now)


class Download(Model):
    __tablename__ = "downloads"

    content_id = ReferenceCol("content", pk_name="uid", primary_key=True)
    user_id = ReferenceCol("users", primary_key=True)
    time = Column(sa.DateTime, nullable=False, default=time_now, primary_key=True)
    infohash = Column(sa.String(45), nullable=False, primary_key=True)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return f"<Download {self.content_id}:{self.infohash}>"
