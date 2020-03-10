# Exception declarations
from http.client import responses
from http import HTTPStatus
from typing import Dict

import flask_restplus


def abort(errors: Dict[str, str], status_code: HTTPStatus = HTTPStatus.BAD_REQUEST, message: str = None):
    flask_restplus.abort(status_code, message if message else responses[status_code], errors=errors)


class InternalException(Exception):
    """ Raised on unrecoverable internal exception """
    pass


class NotFoundException(Exception):
    """ Raised when the requested data was not found """
    pass



