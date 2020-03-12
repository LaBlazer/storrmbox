from sqlalchemy import Column

from storrmbox.extensions.database import (
    sa,
    db,
    Model,
    ReferenceCol,
    time_now)


class Login(Model):
    __tablename__ = "logins"

    time = Column(sa.DateTime, nullable=False, default=time_now)
    user_id = ReferenceCol("users", primary_key=True)
    ip = Column(sa.String(45), nullable=False, primary_key=True)
    token_nonce = sa.Column(sa.String(5), primary_key=True, nullable=False)
    browser_platform = sa.Column(sa.String(15), nullable=True)
    browser_name = sa.Column(sa.String(10), nullable=True)
    browser_version = sa.Column(sa.String(5), nullable=True)

    def __init__(self, *args, **kwargs):
        kwargs["browser_version"] = kwargs["browser_version"].split(".", 1)[0]
        db.Model.__init__(self, *args, **kwargs)

    def __repr__(self):
        return f"<Login {self.ip}:{self.time}>"
