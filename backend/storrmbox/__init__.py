import logging
import os
from flask import Flask, request

from storrmbox.config import DevConfig, ProdConfig
from .api import api_blueprint
from .extensions import db, migrate



def create_app(config=None):
    """Construct the core application."""

    # Choose the correct config
    if not config:
        if os.environ.get('PROD', False):
            print("Using prod configuration...")
            config = ProdConfig
        else:
            print("Using dev configuration... (DO NOT USE IN PRODUCTION)")
            config = DevConfig

    app = Flask(__name__)
    app.app_context().push()

    # Application Configuration
    app.config.from_object(config)

    # Initialize extensions and blueprints
    register_extensions(app)
    register_blueprints(app)

    # Set up CORS handling
    app.after_request(after_request)
    app.before_request(before_request)

    # New db app if no database.
    db.app = app

    # Create all database tables.
    db.create_all()

    return app


def before_request():
    # Hack to fix reverse proxy and Cloudflare IP issue
    # 'X-Forwarded-For' header can sometimes have multiple IPs (203.0.113.1,198.51.100.101,198.51.100.102,...)
    request.environ["REMOTE_ADDR"] = request.headers.get('CF-Connecting-IP', request.headers.get('X-Forwarded-For',
                                                                             request.environ["REMOTE_ADDR"]).rsplit(',')[0])


def after_request(response):
    # CORS fix
    # TODO: Automatically change this depending on prod/dev configuration
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


def register_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)


def register_blueprints(app):
    app.register_blueprint(api_blueprint)
