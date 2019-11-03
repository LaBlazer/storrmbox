import functools
from flask import g, abort, jsonify
from flask_restful import Resource, reqparse, marshal_with, fields

from . import api
from storrmbox.extensions import basic_auth, token_auth, multi_auth
from storrmbox.models.user import User
from storrmbox.models.token import Token


@basic_auth.verify_password
def verify_password(username, password):
    """Validate user passwords and store user in the 'g' object"""
    g.user = User.query.filter_by(username=username).first()
    return g.user is not None and g.user.check_password(password)


@token_auth.verify_token
def verify_token(username, token):
    """Validate user passwords and store user in the 'g' object"""
    g.user = Token.query.filter_by(token=token).first().user
    return g.user is not None


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


token_fields = {
    "token": fields.String,
    "regeneration_token": fields.String,
    "created_on": fields.DateTime,
    "expires_on": fields.DateTime
}


class AuthResource(Resource):
    @multi_auth.login_required
    @marshal_with(token_fields)
    def get(self):
        # If we already have valid token return it
        t = Token.query.filter_by(user_id=g.user.id).first()
        if t:
            return t

        # Otherwise generate new token, store it and return it
        return Token.generate_token(g.user)


api.add_resource(AuthResource, "/auth", "")