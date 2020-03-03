import string
import random

from flask_script import Manager, Shell
from flask_migrate import MigrateCommand
from storrmbox import create_app, db
from storrmbox.models.user import User
from storrmbox.extensions.logging import logger

app = create_app()
manager = Manager(app)


def _random_string(size=6, chars=string.printable):
    return ''.join(random.choice(chars) for _ in range(size))


def _make_context():
    """Return context dict for a shell session so you can access
    app, db, and the User model by default.
    """
    return {'app': app, 'db': db, 'User': User}


@manager.command
def createuser(username, password):
    """Creates an user"""
    logger.info(f"Creating user with username: '{username}' and password: '{password}'")
    u = User()
    u.username = username
    u.email = _random_string() + "@test.com"
    u.set_password(password)
    db.session.add(u)
    db.session.commit()


manager.add_command('shell', Shell(make_context=_make_context))
manager.add_command('db', MigrateCommand)

if __name__ == "__main__":
    manager.run()
