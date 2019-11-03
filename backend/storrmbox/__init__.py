import os
from flask import Flask

from . import config
from .api import api_blueprint
from .extensions import db, migrate


def create_app(config_object=config.Config):
    """Construct the core application."""
    app = Flask(__name__)

    # Application Configuration
    app.config.from_object(config_object)

    # Initialize extensions and blueprints
    register_extensions(app)
    register_blueprints(app)

    # Check if there is no database.
    if not os.path.exists(app.config["SQLALCHEMY_DATABASE_URI"]):

        # New db app if no database.
        db.app = app

        # Create all database tables.
        db.create_all()

    return app


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app)


def register_blueprints(app):
    app.register_blueprint(api_blueprint)
