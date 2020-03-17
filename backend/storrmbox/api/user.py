import re
from http import HTTPStatus

from flask import g
from flask_restplus import Resource, Namespace, fields, inputs

from storrmbox import utils
from storrmbox.exceptions import abort
from storrmbox.extensions.config import config
from storrmbox.extensions.auth import auth
from storrmbox.models.invite import Invite
from storrmbox.models.user import User

api = Namespace('user', description='User profile/account')


user_fields = api.model("User", {
    "username": fields.String(example="JoeMama69"),
    "email": fields.String(example="xxxskiller69@testmail.com"),
    "created": fields.DateTime(attribute="created_on"),
    "permission": fields.Integer(attribute="permission_level", description="0 = User; 1 = Moderator; 2 = Admin")
})

invite_fields = api.model("Invite", {
    "invite": fields.String(example="a4b2c0")
})


@api.route("")
class UserResource(Resource):
    user_parser = api.parser()
    user_parser.add_argument('username', type=str, help='Name', required=True, location='form')
    user_parser.add_argument('email', type=inputs.email(check=True), help='Email', required=True, location='form')
    user_parser.add_argument('password', type=str, help='Password', required=True, location='form')
    user_parser.add_argument('invite_code', type=str, help='Invite code', required=True, location='form')

    @staticmethod
    def validate_password(password: str, password_field: str):
        if len(password.strip()) < 7:
            return abort({password_field: "Your password is too short, it needs to have more than 6 characters"})

        if password.strip() in utils.common_passwords:
            return abort({password_field: "Your password is too common"})

    @api.marshal_with(user_fields)
    @api.expect(user_parser)
    def post(self):
        args = self.user_parser.parse_args()

        if not re.match("^[a-zA-Z0-9_.-]+$", args.username):
            return abort({"username": "Username contains invalid characters"})

        self.validate_password(args.password, "password")

        invite = Invite.query.filter_by(code=args.invite_code).first()
        if not invite:
            return abort({"invite_code": "Invite code is invalid"})

        if invite.user:
            return abort({"invite_code": "This invite code is already used"})

        user = User.query.filter_by(username=args.username).first()
        if user:
            return abort({"username": "This username is already used"})

        user = User.query.filter(User.email.ilike(args.email)).first()
        if user:
            return abort({"email": "This email is already registered"})

        user = User(
            username=args.username,
            email=args.email,
            invite_code=invite.code
        )
        user.set_password(args.password)
        user.save()

        return user

    @auth.login_required
    @api.marshal_with(user_fields)
    def get(self):
        return g.user


@api.route("/password")
class UserPasswordResource(Resource):
    reset_parser = api.parser()
    reset_parser.add_argument('current_password', type=str, help='Current password',
                              required=True, location='form')
    reset_parser.add_argument('new_password', type=str, help='New password',
                              required=True, location='form')

    @auth.login_required
    @api.doc(description="Changes user password to a new one")
    def post(self):
        args = self.reset_parser.parse_args()

        if not g.user.check_password(args.current_password):
            return abort({"current_password": "Invalid password"})

        UserResource.validate_password(args.new_password, "new_password")

        g.user.set_password(args.new_password, save=True)

        g.user.regenerate_token_nonce()

        return {"success": True}


@api.route("/invite")
class InviteResource(Resource):

    @auth.login_required
    @api.marshal_with(invite_fields)
    def get(self):
        invite = Invite.query.filter_by(
            created_by_id=g.user.id).order_by(Invite.created_on.desc()).first()

        if not invite or invite.user:
            invite = Invite(
                created_by_id=g.user.id
            ).save()

        return {"invite": invite.code}
