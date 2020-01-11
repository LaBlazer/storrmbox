import os


class Config(object):
    """Set default Flask configuration"""
    APP_DIR = os.path.abspath(os.path.dirname(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))

    # General Config
    SECRET_KEY = os.getenv('SECRET_KEY')
    TESTING = False
    DEBUG = False

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///:memory:')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Restplus
    RESTPLUS_MASK_HEADER = "x-fields"


class DevConfig(Config):
    """Development configuration."""
    ENV = 'venv'
    DEBUG = True


class ProdConfig(Config):
    """Development configuration."""


class TestConfig(Config):
    """Test configuration."""
    TESTING = True
    DEBUG = True
