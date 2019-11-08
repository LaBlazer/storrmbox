from flask import Blueprint
from flask_restplus import Api, fields

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

api.add_namespace(auth)
api.add_namespace(content)