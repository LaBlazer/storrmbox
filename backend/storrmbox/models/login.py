from sqlalchemy import Column

from storrmbox.extensions.database import (
    sa,
    db,
    Model,
    ReferenceCol,
    time_now)


class Login(Model):
    __tablename__ = "logins"

    time = Column(sa.DateTime, nullable=False, default=time_now, primary_key=True)
    user_id = ReferenceCol("users", primary_key=True)
    ip = Column(sa.String(45), nullable=False, primary_key=True)

    def __init__(self, *args, **kwargs):
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return f"<Login {self.ip}:{self.time}>"
