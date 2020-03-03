from storrmbox.extensions.database import (
    db,
    sa,
    ReferenceCol,
    Cache, Model)


class Popular(Cache, Model):
    __tablename__ = "popular"

    content_id = ReferenceCol("content", pk_name="uid")
    type = sa.Column(sa.SmallInteger, nullable=False)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Popular {}>'.format(repr(self.query))