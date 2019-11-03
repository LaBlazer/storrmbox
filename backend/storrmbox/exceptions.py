
class TokenExpiredException(Exception):
    """ Raised when the token is valid, but expired """
    pass


class TokenInvalidException(Exception):
    """ Raised when the token is invalid """
    pass
