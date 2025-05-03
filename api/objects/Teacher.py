from objects.User import User
from dao.teacherDao import TeacherDAO

class Teacher(User):
    dao = None

    def __init__(self, user_id=None, email=None, record=None):
        if Teacher.dao is None:
            Teacher.dao = TeacherDAO()

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
            raise ValueError("Not enough parameters to create a Teacher object")

        user = User(user_id=_user_id)
        teacher = Teacher.dao.get_by_id(user_id)
        if teacher:
            super().__init__(user_id=_user_id)
        elif user:
            raise ValueError("User is not a teacher")

    @classmethod
    def register(cls, form_data):
        if Teacher.dao is None:
            Teacher.dao = TeacherDAO()
        user_id = User.register(form_data)
        Teacher.dao.create({'id': user_id})
        return user_id
