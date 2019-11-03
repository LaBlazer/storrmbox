import string
import random
from datetime import timedelta, datetime
from sqlalchemy.sql import func
from storrmbox.database import (
    db,
    SurrogatePK,
    Model,
    relationship,
    ReferenceCol
)


def _random_string(size=6, chars=string.ascii_lowercase + string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def _time_delta(delta_hours=12, current_time=datetime.utcnow()):
    return current_time + timedelta(hours=delta_hours)


class Token(SurrogatePK, Model):
    __tablename__ = "tokens"

    token = db.Column(db.String(32), unique=True, nullable=False)
    regeneration_token = db.Column(db.String(32), unique=True, nullable=False)
    created_on = db.Column(db.DateTime, index=False, unique=False, nullable=False, server_default=func.now())
    expires_on = db.Column(db.DateTime, index=False, unique=False, nullable=False, default=datetime.utcnow())
    user_id = ReferenceCol("users")
    user = relationship("User")

    @classmethod
    def generate_token(user, expire_hours=12):
        """Generate random token"""
        t = Token.create(
            token=_random_string(32),
            regeneration_token=_random_string(32),
            user=user,
            expires_on=_time_delta(12)
        )
        #db.session.add(t)
        #db.commit()
        user.user_tokens.append(t)
        return t

    @classmethod
    def regenerate_token(user, old_token, expire_hours=12):
        """Generate random token"""
        old_token_object = db.session.query(Token).filter_by(token=old_token, user=user).one()

        if old_token_object:
            db.session.delete(old_token_object)
            db.session.commit()

            return Token.generate_token(user, expire_hours)
        return None

    def __repr__(self):
        return '<Token {}>'.format(self.username)
