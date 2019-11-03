from flask import Blueprint
from flask_restful import Api, fields

api_blueprint = Blueprint("api", __name__, url_prefix='/api')
api = Api(api_blueprint)

from . import auth
