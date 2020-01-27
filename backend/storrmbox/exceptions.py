from .api import api


class InternalException(Exception):
    """ Raised on unrecoverable internal exception """
    pass


class NotFoundException(Exception):
    """ Raised when the requested data was not found """
    pass


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


