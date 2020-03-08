import base64
import functools
from enum import Enum
from http import HTTPStatus

from flask import request, g
from flask_httpauth import HTTPTokenAuth, MultiAuth
from flask_restplus import abort
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from .config import config
from storrmbox.models.user import User

basic_auth = HTTPTokenAuth(scheme="Auth")
auth = HTTPTokenAuth()
multi_auth = MultiAuth(basic_auth, auth)
token_serializer = Serializer(config['flask_secret_key'], expires_in=config['auth_token_expire_time'] + 60)


class PermissionLevel(Enum):
    User = 0
    Moderator = 1
    Admin = 2


@basic_auth.verify_token
def verify_password(encoded_credentials):
    if encoded_credentials:
        credentials = base64.b64decode(encoded_credentials)
        username, password = credentials.decode("utf8").split(":", maxsplit=1)
        g.user = User.query.filter_by(username=username).first()
        return g.user and g.user.check_password(password)
    return False


# @api.response(401, 'Authentication required')
@auth.verify_token
def verify_token(token):
    g.user = None
    try:
        # Salted with IP
        data = token_serializer.loads(token, salt=request.remote_addr)
    except:  # noqa: E722
        return False
    if "username" in data and "n" in data:
        # Token nonce must match too
        g.user = User.query.filter_by(username=data['username'], token_nonce=data['n']).first()
        return g.user is not None
    return False


def with_permission(permission_level: PermissionLevel):
    def decorator(f):
        def gen(*args, **kwargs):
            if g.user.permission_level == permission_level.value:
                return f(*args, **kwargs)
            return abort(HTTPStatus.FORBIDDEN, "You do not have required permission level")
        return gen
    return decorator


def self_only(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if kwargs.get('username', None):
            if g.user.username != kwargs['username']:
                abort(HTTPStatus.FORBIDDEN)
        if kwargs.get('user_id', None):
            if g.user.id != kwargs['user_id']:
                abort(HTTPStatus.FORBIDDEN)
        return func(*args, **kwargs)
    return wrapper
