import functools, os
from flask import g, abort
from flask_restplus import Resource, Namespace, fields
from time import time
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from storrmbox.extensions import basic_auth, multi_auth, auth
from storrmbox.models.user import User

TOKEN_EXPIRE_TIME = 3600

api = Namespace('auth', description='Web app authentication')
token_serializer = Serializer(os.getenv('SECRET_KEY'), expires_in=TOKEN_EXPIRE_TIME + 60)


@basic_auth.verify_password
def verify_password(username, password):
    """Validate user passwords and store user in the 'g' object"""
    g.user = User.query.filter_by(username=username).first()
    return g.user is not None and g.user.check_password(password)


@auth.verify_token
@api.response(401, 'Authentication required')
def verify_token(token):
    g.user = None
    try:
        data = token_serializer.loads(token)
    except:  # noqa: E722
        return False
    if "username" in data and "id" in data:
        g.user = User.query.filter_by(username=data['username'], id=data['id']).first()
        return True
    return False


def self_only(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if kwargs.get('username', None):
            if g.user.username != kwargs['username']:
                abort(403)
        if kwargs.get('user_id', None):
            if g.user.id != kwargs['user_id']:
                abort(403)
        return func(*args, **kwargs)

    return wrapper


token_fields = api.model("Auth", {
    "token": fields.String,
    "expires_in": fields.Integer
})


@api.route("")
class AuthResource(Resource):

    @multi_auth.login_required
    @api.marshal_with(token_fields)
    @api.doc(security=['basic', 'bearer'])
    def get(self):
        return {"token": token_serializer.dumps({"username": g.user.username, "id": g.user.id}).decode('utf-8'),
                "expires_in": time() + TOKEN_EXPIRE_TIME}
