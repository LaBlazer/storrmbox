from flask import request
from werkzeug.serving import WSGIRequestHandler, _log


class StorrmboxRequestHandler(WSGIRequestHandler):

    def log(self, type, message, *args):
        _log(
            type,
            f"{self.address_string()} => {message % args}\n"
        )

    def log_request(self, code='', size=''):
        self.log('info', f"{self.requestline} => {code} {size}")


def before_request():
    # Hack to fix reverse proxy and Cloudflare IP issue
    # 'X-Forwarded-For' header can sometimes have multiple IPs (203.0.113.1,198.51.100.101,198.51.100.102,...)
    request.environ["REMOTE_ADDR"] = request.headers.get('CF-Connecting-IP', request.headers.get('X-Forwarded-For',
                                                                             request.environ["REMOTE_ADDR"]).rsplit(',')[0])


def after_request(response):
    # CORS handling
    # TODO: Automatically change this depending on prod/dev configuration
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
