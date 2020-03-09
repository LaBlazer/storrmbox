import random
import string
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash

from storrmbox.extensions.database import (
    sa,
    db,
    SurrogatePK,
    Model,
    relationship,
    CRUDMixin, ReferenceCol)
from storrmbox.models.invite import Invite
from storrmbox.models.login import Login
from .search import Search


class User(SurrogatePK, Model):
    _rand = random.Random()

    @staticmethod
    def generate_token_nonce():
        return ''.join(User._rand.choices(string.printable, k=User.token_nonce.type.length))

    __tablename__ = "users"

    username = sa.Column(sa.String(40), unique=True, nullable=False)
    email = sa.Column(sa.String(50), unique=True, nullable=False)
    password = sa.Column(sa.String(120), unique=True, nullable=False)
    created_on = sa.Column(sa.DateTime, nullable=False, default=func.now())
    last_update = sa.Column(sa.DateTime, nullable=True, onupdate=func.now())
    permission_level = sa.Column(sa.SmallInteger, nullable=False, default=0)
    invite_code = ReferenceCol("invites", pk_name="code", nullable=True)
    token_nonce = sa.Column(sa.String(5), unique=False, nullable=False, default=generate_token_nonce.__func__)

    # torrents = relationship(Torrent, backref=db.backref("torrents"))
    searches = relationship(Search, backref="user")
    invites = relationship(Invite, backref="user", foreign_keys=[invite_code])
    logins = relationship(Login, backref="user")

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __update__(self, attr, value):
        if attr == "password":
            self.set_password(value)
            return
        CRUDMixin.__update__(self, attr, value)

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    def regenerate_token_nonce(self):
        nonce = User.generate_token_nonce()
        self.token_nonce = nonce if self.token_nonce != nonce else User.generate_token_nonce()
        self.save()

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def __repr__(self):
        return '<User {!r}>'.format(self.username)
