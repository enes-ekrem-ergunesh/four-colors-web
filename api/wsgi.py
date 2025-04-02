from flask import Flask, request, abort
from flask_cors import CORS
from flask_restx import Api, apidoc
from werkzeug.middleware.proxy_fix import ProxyFix
import logging
from constants import *
from objects.Token import Token

#### START: AUTO IMPORT NAMESPACES ####
import importlib
import pkgutil

NAMESPACE_DIR = "namespaces"
imported_namespaces = {}

for _, module_name, _ in pkgutil.iter_modules([NAMESPACE_DIR]):
    if module_name.endswith("Namespace"):
        module_path = f"{NAMESPACE_DIR}.{module_name}"
        module = importlib.import_module(module_path)

        if hasattr(module, "ns"):
            imported_namespaces[module_name] = getattr(module, "ns")

#### END: AUTO IMPORT NAMESPACES ####

logging.basicConfig(
    filename='app.log',
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)

if PROD:
    app.config['ERROR_404_HELP'] = False # Disable error help messages from flask-restx
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

CORS(app)

api = Api(
    app,
    version='1.0',
    title='4 Colors Education Center API',
    description='A simple API',
    authorizations=AUTHORIZATIONS,
    security='JWT Token',
)

for namespace in imported_namespaces.values():
    api.add_namespace(namespace)

@api.documentation
def custom_ui():
    return apidoc.ui_for(api) + """
    <style>
        @media (prefers-color-scheme: dark) {
            html {
                filter: invert(1);
            }
            .backdrop-ux {
                background: rgba(220,220,220,.9) !important;
            }
            .modal-ux {
                box-shadow: 0 10px 30px 0 rgb(0 0 0 / 5%) !important;
            }
            .microlight {
                filter: invert(1);
        }
    </style>
    """

@app.before_request
def before_request():
    # Allow all options requests (pre-flight requests for CORS)
    if request.method == "OPTIONS":
        return

    if request.endpoint in ALLOWED_ENDPOINTS:
        return

    if not PROD:
        print("AUTHORIZED ENDPOINT:", request.endpoint)
        # print("AUTHORIZED request:", request)

    _token = request.headers.get('Authorization')
    if not _token:
        print("401: Token is missing")
        abort(401, 'Token is missing')

    try:
        token = Token(token=_token)
    except ValueError as e:
        print("401: Token is invalid")
        if PROD:
            abort(401, 'Token is invalid')
        else:
            abort(401, str(e))
    if token.status() == 'expired':
        print("401: Token is expired")
        abort(401, 'Token is expired')
    elif token.status() == 'invalid':
        print("401: Token is invalid")
        abort(401, 'Token is invalid')
    elif token.status() == 'revoked':
        print("401: Token is revoked")
        abort(401, 'Token is revoked')
    elif token.status() == 'valid':
        print("200: Token is valid")
    else:
        print("500: Unexpected token status -", token.status())
        abort(500, 'Something went wrong')

    request.user_id = token.user_id
    request.token_id = token.id

if __name__ == '__main__':
    app.run(debug=True)