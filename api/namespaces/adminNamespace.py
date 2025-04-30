import re
from flask import request
from datetime import datetime
from flask_restx import Namespace, Resource, fields

from namespaces.authNamespace import token_model
from namespaces.nationalityNamespace import MAX_COUNTRY_ID
from namespaces.userNamespace import (user_model, new_user_model, get_user_object,
                                      EMAIL_REGEX, PASSWORD_REGEX, ALLOWED_GENDERS)

from objects.User import User, UserManager
from objects.Student import Student
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

def new_student_validate_payload(payload):
    # Required fields
    if 'email' not in payload:
        ns.abort(400, "Email is required")
    if 'password' not in payload:
        ns.abort(400, "Password is required")
    if 'first_name' not in payload:
        ns.abort(400, "First name is required")
    if 'last_name' not in payload:
        ns.abort(400, "Last name is required")

    # Validate email
    if not re.match(EMAIL_REGEX, payload.get('email', '')):
        ns.abort(400, "Invalid email format.")

    # Validate password
    if not re.match(PASSWORD_REGEX, payload.get('password')):
        ns.abort(400, "Password must be 8+ chars with upper, lower, number, special char.")

    # Validate nationality
    if 'nationality' in payload:
        nationality = int(payload.get('nationality'))
        if nationality < 1 or nationality > MAX_COUNTRY_ID:
            ns.abort(400, "Invalid country ID.")
    else:
        payload['nationality'] = None

    # Validate birthdate
    if 'birthdate' in payload and payload.get('birthdate') != '':
        birthdate = payload.get('birthdate')
        if birthdate:
            try:
                birth = datetime.strptime(birthdate, '%Y-%m-%d')
                if birth > datetime.now():
                    ns.abort(400, "Birthdate cannot be in the future.")
                elif birth < datetime(1900, 1, 1):
                    ns.abort(400, "Birthdate cannot be before 1900.")
            except ValueError:
                ns.abort(400, "Invalid birthdate format. Use YYYY-MM-DD.")
    else:
        payload['birthdate'] = None

    # Validate gender
    if 'gender' in payload and payload.get('gender') != 'select':
        gender = payload.get('gender')
        if gender and gender.lower() not in ALLOWED_GENDERS:
            ns.abort(400, "Gender must be one of: male, female, prefer not to say.")
    else:
        payload['gender'] = None

@ns.route('/login')
class AdminLogin(Resource):
    @ns.doc('login_admin')
    @ns.expect(admin_login_model)
    @ns.marshal_with(token_model)
    def post(self):
        """Login test"""
        user = get_user_object(email=ns.payload['email'])
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
        return user_manager.users

    @ns.doc('new_student')
    @ns.expect(new_user_model)
    @ns.marshal_with(user_model)
    def post(self):
        """Create new student"""
        block_non_admin()
        payload = ns.payload
        new_student_validate_payload(payload)
        new_student_id = Student.register(payload)
        user = User(user_id=new_student_id)
        return user


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


@ns.route('/user/<int:user_id>')
class UserDetail(Resource):
    @ns.doc('get_user')
    @ns.marshal_with(user_model)
    def get(self, user_id):
        """Get user by ID"""
        block_non_admin()
        user = User(user_id=user_id)
        if not user:
            ns.abort(404, "User not found")
        return user
