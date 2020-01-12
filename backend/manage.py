from dotenv import load_dotenv
load_dotenv()  # Load .env file

import os
import codecs
import string
import random

from flask_script import Manager, Shell, Server
from flask_migrate import MigrateCommand
from storrmbox import create_app, db
from storrmbox.models.user import User
from storrmbox.config import DevConfig, ProdConfig

if os.environ.get('PROD', False):
    DefaultConfig = ProdConfig
else:
    DefaultConfig = DevConfig

app = create_app(DefaultConfig)
manager = Manager(app)


def _random_string(size=6, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def _make_context():
    """Return context dict for a shell session so you can access
    app, db, and the User model by default.
    """
    return {'app': app, 'db': db, 'User': User}


def _make_env():
    """Creates default .env file"""
    env = 'SECRET_KEY={}\nOMDB_API_KEY=\nDATABASE_URI='.format(codecs.encode(os.urandom(32), "hex").decode())

    with open(".env", "w") as f:
        f.write(env)


@manager.command
def createuser(username, password):
    """Creates an user"""
    print(f"Creating user with username: '{username}' and password: '{password}'")
    u = User()
    u.username = username
    u.email = _random_string() + "@test.com"
    u.set_password(password)
    db.session.add(u)
    db.session.commit()


# @manager.command
# def test():
#     """Run the tests."""
#     import pytest
#     exit_code = pytest.main(['tests', '-q'])
#     return exit_code


manager.add_command('server', Server())
manager.add_command('shell', Shell(make_context=_make_context))
manager.add_command('db', MigrateCommand)

if __name__ == "__main__":
    if not os.path.exists(".env"):
        print("Generating default .env file")
        _make_env()

    manager.run()
