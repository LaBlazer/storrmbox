from .config import config
from .logging import logger
from .auth import auth, multi_auth
from .task_queue import task_queue
from .database import db, migrate
from .request_handler import after_request, before_request


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    #db.app = app

    # Create all database tables
    db.create_all()

    # Set up request events
    app.after_request(after_request)
    app.before_request(before_request)