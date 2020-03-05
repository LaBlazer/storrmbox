# Exception declarations


class InternalException(Exception):
    """ Raised on unrecoverable internal exception """
    pass


class NotFoundException(Exception):
    """ Raised when the requested data was not found """
    pass



