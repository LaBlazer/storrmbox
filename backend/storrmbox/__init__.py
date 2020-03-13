from pathlib import Path

from flask import Flask

ROOT_PATH = Path(__file__).parent.parent


def create_app():
    """Construct the core application."""
    app = Flask(__name__)
    app.app_context().push()

    from storrmbox.extensions import register_extensions, config

    # Application Configuration
    app.config.update(config.get_dict("flask", uppercase=True))

    # Initialize extensions and blueprints
    register_extensions(app)

    from storrmbox.api import register_api
    register_api(app)

    return app


def create_huey_app():
    """Construct striped down application for huey workers"""

    app = Flask(__name__)
    app.app_context().push()

    from storrmbox.extensions import register_extensions, config, db

    # Application Configuration
    app.config.update(config.get_dict("flask", uppercase=True))

    # Initialize extensions
    db.init_app(app)

    return app
