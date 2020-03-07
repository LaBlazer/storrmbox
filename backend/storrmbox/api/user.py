import re

from flask import g
from flask_restplus import Resource, Namespace, fields, inputs

from storrmbox.extensions.config import config
from storrmbox.extensions.auth import token_serializer, multi_auth, auth
from storrmbox.models.invite import Invite
from storrmbox.models.user import User

api = Namespace('user', description='User profile/account')


user_fields = api.model("User", {
    "username": fields.String(example="JoeMama69"),
    "email": fields.String(example="xxxskiller69@testmail.com"),
    "created": fields.DateTime(attribute="created_on")
})

invite_fields = api.model("Invite", {
    "invite": fields.String(example="aBcDeF")
})

email_validator = inputs.email(check=True)


@api.route("")
class UserResource(Resource):
    user_parser = api.parser()
    user_parser.add_argument('username', type=str, help='Users name', required=True, location='form')
    user_parser.add_argument('email', type=email_validator, help='Users email', required=True, location='form')
    user_parser.add_argument('password', type=str, help='Users password', required=True, location='form')
    user_parser.add_argument('invite_code', type=str, help='Users invite code', required=True, location='form')

    @api.marshal_with(user_fields)
    @api.expect(user_parser)
    def post(self):
        args = self.user_parser.parse_args()

        if not re.match("^[a-zA-Z0-9_.-]+$", args.username):
            raise ValueError("Username contains invalid characters")

        invite = Invite.query.filter_by(code=args.invite_code).first()
        if not invite:
            raise ValueError("Invite code is invalid")

        if invite.user:
            raise Exception("This invite code is already used")

        u = User(
            username=args.username,
            email=args.email,
            invite_code=invite.code
        )
        u.set_password(args.password)
        u.save()

        return u

    @auth.login_required
    @api.marshal_with(user_fields)
    def get(self):
        return g.user


@api.route("/invite")
class InviteResource(Resource):

    @auth.login_required
    @api.marshal_with(invite_fields)
    def get(self):
        invite = Invite(
            created_by_id=g.user.id
        ).save()

        return {"invite": invite.code}
