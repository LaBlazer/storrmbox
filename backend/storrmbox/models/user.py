from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash

from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    relationship
)


class User(SurrogatePK, Model):
    __tablename__ = "users"

    username = db.Column(db.String(40), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False, default=func.now())
    last_update = db.Column(db.DateTime, nullable=True, onupdate=func.now())
    last_login = db.Column(db.DateTime, nullable=True)
    permission_level = db.Column(db.SmallInteger, nullable=False, default=0)

    # torrents = relationship(Torrent, backref=db.backref("torrents"))
    searches = relationship("Search", backref="user")

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def __repr__(self):
        return '<User {!r}>'.format(self.username)
