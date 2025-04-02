ALLOWED_ENDPOINTS = [
    'specs',
    'restx_doc.static',
    'doc',
    'admin_admin_login',
    'auth_login',
]

AUTHORIZATIONS = {
    'JWT Token': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

MAIN_DATABASE = 'main'

PROD = False