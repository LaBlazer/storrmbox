from storrmbox.database import (
    db,
    sa,
    IntEnum,
    SurrogatePK,
    Model,
    ReferenceCol,
    time_now)
from storrmbox.models.content import ContentType


class Popular(SurrogatePK, Model):
    __tablename__ = "popular"

    content_id = ReferenceCol("content", pk_name="uid")
    time = sa.Column(sa.DateTime, nullable=False, default=time_now)
    type = sa.Column(sa.SmallInteger, nullable=False)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Popular {}>'.format(repr(self.query))