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

def _time_now():
    return datetime.utcnow().replace(microsecond=0)

def _time_delta(delta_hours=12, current_time=_time_now()):
    return current_time + timedelta(hours=delta_hours)


class Token(Model):
    __tablename__ = "tokens"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(32), unique=True, nullable=False)
    regeneration_token = db.Column(db.String(32), unique=True, nullable=False)
    created_on = db.Column(db.DateTime, index=False, unique=False, nullable=False, default=func.now())
    expires_on = db.Column(db.DateTime, index=False, unique=False, nullable=False, default=_time_now())
    user_id = ReferenceCol("users")

    #def __init__(self, token, regeneration_token, user, expires_on, **kwargs):
    #    db.Model.__init__(self, token=token, regeneration_token=regeneration_token, user=user, expires_on=expires_on, **kwargs)

    def generate_token(user, expire_hours=12):
        """Generate random token"""

        try:
            t = Token.create(
                token=_random_string(32),
                regeneration_token=_random_string(32),
                user=user,
                expires_on=_time_delta(12)
            )
        except AttributeError as ex:
            print(ex)
            raise AttributeError
        user.tokens.append(t)
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
