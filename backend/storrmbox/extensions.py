from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth, MultiAuth
from flask_migrate import Migrate
from flask_sqlalchemy.model import BindMetaMixin, Model
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base


# Disable Table Name Generation
class NoNameMeta(BindMetaMixin, DeclarativeMeta):
    pass


db = SQLAlchemy(model_class=declarative_base(cls=Model, metaclass=NoNameMeta, name='Model'))
basic_auth = HTTPBasicAuth(scheme='Auth')
auth = HTTPTokenAuth()
multi_auth = MultiAuth(basic_auth, auth)
migrate = Migrate()
