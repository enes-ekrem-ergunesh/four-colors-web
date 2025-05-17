from flask import request
from flask_restx import Namespace, Resource, fields

import dao.userDao as userDao

from objects.User import User
from special_logger import special_log

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
ALLOWED_GENDERS = {"male", "female"}

dao = userDao.UserDAO()

ns = Namespace('user', description='User related operations')

user_model = ns.model('User', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a user'),
    'email': fields.String(required=True, description='User email'),
    'first_name': fields.String(required=True, description='User first name'),
    'last_name': fields.String(required=True, description='User last name'),
    'is_admin': fields.Boolean(required=True, description='User is admin'),
    'created_at': fields.DateTime(required=True, description='User created at'),
    'updated_at': fields.DateTime(required=True, description='User updated at'),
    'deleted_at': fields.DateTime(required=True, description='User deleted at'),
    'nationality': fields.String(required=True, description='User nationality'),
    'birthdate': fields.Date(required=True, description='User birthdate'),
    'gender': fields.String(required=True, description='User gender'),
    'type': fields.String(required=True, description='User type')
})

new_user_model = ns.model('New user', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
    'first_name': fields.String(required=True, description='User first name'),
    'last_name': fields.String(required=True, description='User last name'),
    'nationality': fields.Integer(required=False, description='User nationality'),
    'birthdate': fields.Date(required=False, description='User birthdate'),
    'gender': fields.String(required=False, description='User gender')
})

def block_admin(user=None):
    if not user:
        user = User(user_id=request.user_id)
    else:
        if user.is_admin: # Admin logges in with a user account
            ns.abort(401, "Invalid email or password") # do not expose the admin account
    if user.is_admin:
        ns.abort(409, "Admin accounts are not supported, please use a regular user account")

def get_user_object(email=None, user_id=None):
    user = None
    def exception_handler(e):
        special_log("/login", str(e), email=ns.payload['email'])
        if str(e) == 'User not found for given email':
            ns.abort(401, "Invalid email or password")
            return
        ns.abort(401, e)
        return
    if email:
        try:
            user = User(email=ns.payload['email'])
        except ValueError as ve:
            exception_handler(ve)
    elif user_id:
        try:
            user = User(user_id=ns.payload['id'])
        except ValueError as ve:
            exception_handler(ve)
    else:
        ns.abort(500, "Internal server error: email or user_id is required")
        return None
    return user

@ns.route('/self')
class UserSelf(Resource):
    @ns.doc('get_user_self')
    @ns.marshal_with(user_model)
    def get(self):
        """Get user self"""
        user = User(user_id=request.user_id)
        return user

@ns.route('/validate')
class ValidateUser(Resource):
    @ns.doc('validate_user')
    def get(self):
        """Validate user"""
        block_admin()
        return 'OK', 200
