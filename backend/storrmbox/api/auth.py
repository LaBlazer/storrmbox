from time import time

from flask import g, request
from flask_restplus import Resource, Namespace, fields, inputs
from werkzeug.useragents import UserAgent

from storrmbox.extensions.logging import config, logger
from storrmbox.extensions.auth import token_serializer, multi_auth, auth
from storrmbox.models.login import Login

api = Namespace('auth', description='Web app authentication')

token_fields = api.model("Auth", {
    "token": fields.String,
    "expires_in": fields.Integer
})

login_fields = api.model("Login", {
    "time": fields.DateTime,
    "ip": fields.String,
    "browser": fields.String(attribute="browser_name"),
    "browser_version": fields.String,
    "platform": fields.String(attribute="browser_platform")
})


@api.route("")
class AuthResource(Resource):
    auth_parser = api.parser()
    auth_parser.add_argument('extended', type=inputs.boolean, help='Should the token be valid for an extended time',
                             required=False, location='form')

    @multi_auth.login_required
    @api.marshal_with(token_fields)
    @api.doc(security=['basic', 'bearer'])
    @api.expect(auth_parser)
    def post(self):
        expire_time = config['auth_extended_token_expire_time'] if self.auth_parser.parse_args()['extended'] \
            else config['auth_token_expire_time']
        token_serializer.expires_in = expire_time

        # Invalidate the token if request is coming from a different IP
        token = token_serializer.dumps({"username": g.user.username, "n": g.user.token_nonce},
                                       salt=request.remote_addr).decode('utf-8')

        # Track the login if we changed ip and we are not on localhost
        if request.remote_addr != "127.0.0.1":
            login = Login.query.filter_by(user_id=g.user.id).order_by(Login.time.desc()).first()
            if not login or login.ip != request.remote_addr:
                # Parse the user agent
                ua = UserAgent(request.user_agent.string)
                Login(
                    user_id=g.user.id,
                    ip=request.remote_addr,
                    token_nonce=g.user.token_nonce,
                    browser_platform=ua.platform,
                    browser_name=ua.browser,
                    browser_version=ua.version
                ).save()
        elif config["flask_hostname"] not in ["127.0.0.1", "localhost"]:
            logger.warn("Remote IP is 127.0.0.1 but flask is not run locally. " +
                        "Maybe wrong reverse proxy configuration?")

        return {"token": token, "expires_in": time() + expire_time}


@api.route("/list")
class AuthListResource(Resource):

    @auth.login_required
    @api.marshal_list_with(login_fields)
    @api.doc(description="Lists 10 last login times and IPs")
    def get(self):
        return Login.query.filter_by(user_id=g.user.id, token_nonce=g.user.token_nonce) \
            .order_by(Login.time.desc()).limit(10).all()


@api.route("/purge")
class AuthPurgeResource(Resource):

    @auth.login_required
    @api.doc(description="Purges/invalidates all active user tokens")
    def post(self):
        g.user.regenerate_token_nonce()

        return {"success": True}
