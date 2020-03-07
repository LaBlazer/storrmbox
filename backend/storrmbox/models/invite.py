import random
import string

from sqlalchemy import Column
from sqlalchemy.orm import backref

from storrmbox.extensions.database import (
    sa,
    db,
    Model,
    ReferenceCol,
    time_now,
    relationship)


class Invite(Model):
    __tablename__ = "invites"

    created_by_id = ReferenceCol("users")
    code = Column(sa.String(6), nullable=False, primary_key=True)
    created_on = Column(sa.DateTime, nullable=False, default=time_now)

    def __init__(self, *args, **kwargs):
        kwargs['code'] = self._generate_code()  # Generate new invite code
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return '<Invite {}>'.format(repr(self.code))

    @classmethod
    def _generate_code(cls):
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=cls.code.type.length))
