from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    relationship
)


class Torrent(SurrogatePK, Model):
    pass
