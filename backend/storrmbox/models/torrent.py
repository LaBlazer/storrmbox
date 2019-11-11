from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    relationship
)


class Torrent(SurrogatePK, Model):

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)
