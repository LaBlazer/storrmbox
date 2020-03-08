from pathlib import Path

from flask import Flask

from storrmbox.extensions import logger, db, config

ROOT_PATH = Path(__file__).parent.parent


def create_app():
    """Construct the core application."""

    app = Flask(__name__)
    app.app_context().push()

    # Application Configuration
    app.config.update(config.get_dict("flask", uppercase=True))

    # Initialize extensions and blueprints
    from storrmbox.extensions import register_extensions
    register_extensions(app)

    from storrmbox.api import register_api
    register_api(app)

    return app


def create_huey_app():
    """Construct striped down application for huey workers"""

    app = Flask(__name__)
    app.app_context().push()

    # Application Configuration
    app.config.update(config.get_dict("flask", uppercase=True))

    # Initialize extensions and blueprints
    db.init_app(app)

    return app
