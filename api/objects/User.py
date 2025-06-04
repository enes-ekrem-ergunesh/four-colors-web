from dao.userDao import UserDAO
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError

from dao.userDetailsDao import UserDetailsDAO
from dao.countryDao import CountryDAO

class User:
    dao = None
    ph = None
    user_details_dao = None
    countries_dao = None

    def __init__(self, user_id=None, email=None, record=None):
        if User.dao is None:
            User.dao = UserDAO()
        if User.user_details_dao is None:
            User.user_details_dao = UserDetailsDAO()
        if User.ph is None:
            User.ph = PasswordHasher()

        if user_id:
            self._load_by_id(user_id)
        elif email:
            self._load_by_email(email)
        elif record:
            self._set_attributes(record)
        else:
            raise ValueError("Not enough parameters to create a User object")

    def _load_by_id(self, record_id):
        data = self.dao.get_by_id_role(record_id)
        if not data:
            raise ValueError("User not found for given id")
        self._set_attributes(data)

    def _load_by_email(self, email):
        data = self.dao.get_by_email(email)
        if not data:
            raise ValueError("User not found for given email")
        self._set_attributes(data)

    def _set_attributes(self, data):
        self.id = data.get("id")
        self.email = data.get("email")
        self.first_name = data.get("first_name")
        self.last_name = data.get("last_name")
        self.is_admin = data.get("is_admin")
        self.password = data.get("password")
        self.created_at = data.get("created_at")
        self.updated_at = data.get("updated_at")
        self.deleted_at = data.get("deleted_at")
        if data.get("type"):
            self.type = data.get("type")
        details = User.user_details_dao.get_by_id(self.id)
        if not details:
            raise ValueError("User details not found for given user id")
        self._set_detail_attributes(details)

    def _set_detail_attributes(self, details):
        if User.countries_dao is None:
            User.countries_dao = CountryDAO()
        self.nationality = User.countries_dao.get_by_id(details.get("nationality")).get("name")
        self.birthdate = details.get("birthdate")
        self.gender = details.get("gender")

    @classmethod
    def register(cls, form_data):
        if User.dao is None:
            User.dao = UserDAO()
        if User.user_details_dao is None:
            User.user_details_dao = UserDetailsDAO()
        try:
            existing_user = User(email=form_data['email'])
            if existing_user.id:
                raise ValueError("User already exists")
        except ValueError:
            pass
        user = {
            'email': form_data['email'],
            'first_name': form_data['first_name'],
            'last_name': form_data['last_name'],
            'is_admin': 0,
            'password': cls.ph.hash(form_data['password'])
        }
        user_id = User.dao.create(user)
        user_details = {
            'id': user_id,
            'nationality': form_data['nationality'],
            'birthdate': form_data['birthdate'],
            'gender': form_data['gender'],
        }
        User.user_details_dao.create(user_details)
        return user_id

    def password_match(self, password):
        try:
            User.ph.verify(self.password, password)
            return True
        except (VerifyMismatchError, InvalidHashError):
            print(User.ph.hash(password))
            return False

    def __str__(self):
        print("".join(
            "\n "
            f"{'ID':5}| {'email':20}| {'first_name':15}| "
            f"{'last_name':15}| {'is_admin':10}| "
            "\n "
            f"{str(self.id):5}| {self.email:20}| {self.first_name:15}| "
            f"{self.last_name:15}| {('true' if self.is_admin == 1 else 'false'):10}|"
            "\n"
        ))
        return "".join(
            f"id={self.id};{self.email};{self.first_name};"
            f"{self.last_name};admin={'true' if self.is_admin == 1 else 'false'};"
        )

    def __repr__(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'is_admin': self.is_admin
        }

class UserManager:
    def __init__(self):
        if User.dao is None:
            User.dao = UserDAO()
        self.dao = User.dao
        self.users: list[User] = []

    def get_all_users(self):
        data = self.dao.get_all_with_roles()
        self.load_data(data)

    def get_all_admins(self):
        data = self.dao.get_admins()
        self.load_data(data)

    def get_all_students(self):
        data = self.dao.get_all_students()
        self.load_data(data)

    def get_all_teachers(self):
        data = self.dao.get_all_teachers()
        self.load_data(data)

    def load_data(self, data):
        for record in data:
            user = User(record=record)
            self.users.append(user)
