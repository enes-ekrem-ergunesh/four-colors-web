from flask import request
from flask_restx import Namespace, Resource, fields
from namespaces.userNamespace import user_model
from namespaces.authNamespace import token_model

from objects.User import User, UserManager
from objects.Token import Token

ns = Namespace('admin', description='Admin related operations')

admin_login_model = ns.model('Admin login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
})

def block_non_admin():
    user = User(user_id=request.user_id)
    if not user.is_admin:
        print("403: Access denied")
        ns.abort(403, "Access denied")

def block_admin():
    user = User(user_id=request.user_id)
    if user.is_admin:
        print("409: Admin accounts are not supported, please use a regular user account")
        ns.abort(409, "Admin accounts are not supported, please use a regular user account")

@ns.route('/login')
class AdminLogin(Resource):
    @ns.doc('login_admin')
    @ns.expect(admin_login_model)
    @ns.marshal_with(token_model)
    def post(self):
        """Login test"""
        try:
            user = User(email=ns.payload['email'])
        except ValueError:
            ns.abort(401, "Invalid email or password")
            return
        password_match = user.password_match(ns.payload['password'])
        if not password_match:
            ns.abort(401, "Invalid email or password")
        if not user.is_admin:
            ns.abort(401, "Invalid email or password")
        token = Token(user_id=user.id, delta_seconds=3600)
        return token

@ns.route('/validate')
class ValidateAdmin(Resource):
    @ns.doc('validate_admin')
    def get(self):
        """Validate admin"""
        block_non_admin()
        return 'OK', 200

@ns.route('/students')
class Students(Resource):
    @ns.doc('get_students')
    @ns.marshal_list_with(user_model)
    def get(self):
        """Get students"""
        block_non_admin()
        user_manager = UserManager()
        user_manager.get_all_students()
        print(user_manager.users[0].gender)
        return user_manager.users

@ns.route('/teachers')
class Teachers(Resource):
    @ns.doc('get_teachers')
    @ns.marshal_list_with(user_model)
    def get(self):
        """Get teachers"""
        block_non_admin()
        user_manager = UserManager()
        user_manager.get_all_teachers()
        return user_manager.users

