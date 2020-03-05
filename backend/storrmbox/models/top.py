from storrmbox.extensions.database import (
    db,
    sa,
    ReferenceCol,
    Cache, Model)


class Top(Cache, Model):
    __tablename__ = "top"

    content_id = ReferenceCol("content", pk_name="uid")
    type = sa.Column(sa.SmallInteger, nullable=False)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Top {}>'.format(repr(self.query))