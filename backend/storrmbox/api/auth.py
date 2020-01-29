import functools
from os import getenv
from time import time

from flask import g, abort, request
from flask_restplus import Resource, Namespace, fields, inputs
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

from storrmbox.extensions import basic_auth, multi_auth, auth
from storrmbox.models.user import User

TOKEN_EXPIRE_TIME = 3600
EXTENDED_TOKEN_EXPIRE_TIME = 604800  # 1 week

api = Namespace('auth', description='Web app authentication')
token_serializer = Serializer(getenv('SECRET_KEY'), expires_in=TOKEN_EXPIRE_TIME + 60)


@basic_auth.verify_password
def verify_password(username, password):
    """Validate user passwords and store user in the 'g' object"""
    g.user = User.query.filter_by(username=username).first()
    return g.user is not None and g.user.check_password(password)


@api.response(401, 'Authentication required')
@auth.verify_token
def verify_token(token):
    g.user = None
    try:
        # Salted with IP
        # print("Origin: " + request.remote_addr)
        data = token_serializer.loads(token, salt=request.remote_addr)
    except:  # noqa: E722
        return False
    if "username" in data and "n" in data:
        # Token nonce must match too
        g.user = User.query.filter_by(username=data['username'], token_nonce=data['n']).first()
        return g.user is not None
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

auth_parser = api.parser()
auth_parser.add_argument('extended', type=inputs.boolean, help='Should the token be valid for an extended time',
                         required=False, location='form')


@api.route("")
class AuthResource(Resource):

    @multi_auth.login_required
    @api.marshal_with(token_fields)
    @api.doc(security=['basic', 'bearer'])
    @api.expect(auth_parser)
    def post(self):
        expire_time = EXTENDED_TOKEN_EXPIRE_TIME if bool(auth_parser.parse_args()['extended']) else TOKEN_EXPIRE_TIME
        token_serializer.expires_in = expire_time

        # Invalidate the token if request is coming from a different IP
        token = token_serializer.dumps({"username": g.user.username, "n": g.user.token_nonce}, salt=request.remote_addr).decode('utf-8')

        return {"token": token, "expires_in": time() + expire_time}


@api.route("/purge")
class AuthPurgeResource(Resource):

    @auth.login_required
    @api.doc(description="Purges/invalidates all active user tokens")
    def post(self):
        g.user.regenerate_token_nonce()

        return {"success": True}
