from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth, MultiAuth
from flask_migrate import Migrate

db = SQLAlchemy()
basic_auth = HTTPBasicAuth()
auth = HTTPTokenAuth('Bearer')
multi_auth = MultiAuth(basic_auth, auth)
migrate = Migrate()
