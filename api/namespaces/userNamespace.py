from flask import request
from flask_restx import Namespace, Resource, fields

import dao.userDao as userDao

from objects.User import User

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
    'birthdate': fields.DateTime(required=True, description='User birthdate'),
    'gender': fields.String(required=True, description='User gender'),
    'type': fields.String(required=True, description='User type')
})

def block_admin():
    user = User(user_id=request.user_id)
    if user.is_admin:
        print("409: Admin accounts are not supported, please use a regular user account")
        ns.abort(409, "Admin accounts are not supported, please use a regular user account")

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
