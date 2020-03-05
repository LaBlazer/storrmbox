from flask import Blueprint
from flask_restplus import Api, fields

from storrmbox.exceptions import InternalException, NotFoundException

"""'bearer': {
        'type': 'http',
        'scheme': 'bearer',
        'bearerFormat': 'JWT'
    },"""

authorizations = {
    'bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    },
    'basic': {
        'type': 'basic'
    }
}

api_blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(api_blueprint,
          title="storrmbox",
          version="1.0",
          description="API for the storrmbox content manager web application",
          security=["bearer"],
          authorizations=authorizations,
          serve_challenge_on_401=True,
          validate=True)

from .auth import api as auth
from .content import api as content
from .task import api as task

api.add_namespace(auth)
api.add_namespace(content)
api.add_namespace(task)


def register_api(app):
    app.register_blueprint(api_blueprint)

    # Register error handlers
    @api.errorhandler(InternalException)
    def handle_internal_exception(error):
        return {'message': 'Server has encountered an internal error: ' + str(error)}, 500

    @api.errorhandler
    def default_error_handler(error):
        '''Default error handler'''
        return handle_internal_exception(error)

    @api.errorhandler(NotFoundException)
    def handle_not_found_exception(error):
        return {'message': 'The requested data was not found: ' + error.specific}, 404

