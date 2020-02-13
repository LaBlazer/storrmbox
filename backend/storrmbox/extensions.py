import logging
import os

from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth, MultiAuth
from flask_migrate import Migrate
from flask_sqlalchemy.model import BindMetaMixin, Model
from huey import SqliteHuey
from sqlalchemy.ext.declarative import DeclarativeMeta, declarative_base


# Disable Table Name Generation
class NoNameMeta(BindMetaMixin, DeclarativeMeta):
    pass


logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s]: {} %(levelname)s %(message)s'.format(os.getpid()),
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler()])


logger = logging.getLogger("storrmbox")
db = SQLAlchemy(model_class=declarative_base(cls=Model, metaclass=NoNameMeta, name="Model"))
basic_auth = HTTPTokenAuth(scheme="Auth")
auth = HTTPTokenAuth()
multi_auth = MultiAuth(basic_auth, auth)
migrate = Migrate()
task_queue = SqliteHuey("huey.db")