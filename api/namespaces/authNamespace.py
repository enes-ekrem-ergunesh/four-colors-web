from flask import request
from flask_restx import Namespace, Resource, fields

from objects.Token import Token

from namespaces.userNamespace import get_user_object, block_admin

ns = Namespace('auth', description='Auth related operations')

"""
id
user_id
token
type
revoked_at
created_at
deleted_at
"""

token_model = ns.model('Token', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a token'),
    'user_id': fields.Integer(required=True, description='User id'),
    'token': fields.String(required=True, description='Token'),
    'type': fields.String(required=True, description='Token type'),
    'revoked_at': fields.DateTime(required=True, description='Revoked at'),
    'created_at': fields.DateTime(required=True, description='Created at'),
    'deleted_at': fields.DateTime(required=True, description='Deleted at'),
})

login_model = ns.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
    'remember_me': fields.Boolean(required=True, description='Remember me'),
})

@ns.route('/login')
class Login(Resource):
    @ns.doc('login')
    @ns.expect(login_model)
    @ns.marshal_with(token_model)
    def post(self):
        """Login"""
        user = get_user_object(email=ns.payload['email'])
        password_match = user.password_match(ns.payload['password'])
        if not password_match:
            ns.abort(401, "Invalid email or password")
        block_admin(user)
        token = Token(user_id=user.id, delta_seconds=(3600 * 24 * 7) if ns.payload['remember_me'] else 3600)
        return token

@ns.route('/logout')
class Logout(Resource):
    @ns.doc('logout')
    def post(self):
        """Logout"""
        try:
            token = Token(token_id=request.token_id)
            token.revoke()
        except ValueError as e:
            ns.abort(401, str(e))
        return 'Logged out successfully!', 200

