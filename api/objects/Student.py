from objects.User import User
from dao.studentDao import StudentDAO

class Student(User):
    dao = None

    def __init__(self, user_id=None, email=None, record=None):
        if Student.dao is None:
            Student.dao = StudentDAO()

        if record and record['id']:
            _user_id = record['id']
        elif user_id:
            _user_id = user_id
        elif email:
            user = User(email=email)
            if user:
                _user_id = user.id
            else:
                raise Exception('Invalid email')
        else:
            raise ValueError("Not enough parameters to create a Student object")

        user = User(user_id=_user_id)
        student = Student.dao.get_by_id(user_id)
        if student:
            super().__init__(user_id=_user_id)
        elif user:
            raise ValueError("User is not a student")

    @classmethod
    def register(cls, form_data):
        if Student.dao is None:
            Student.dao = StudentDAO()
        user_id = User.register(form_data)
        Student.dao.create({'id': user_id})
        return user_id


