import pymysql

from dao.classroomDao import ClassroomDAO

class Classroom:
    dao = None

    def __init__(self, classroom_id=None, record=None):
        if Classroom.dao is None:
            Classroom.dao = ClassroomDAO()

        if classroom_id:
            self._load_by_id(classroom_id)
        elif record:
            self._set_attributes(record)
        else:
            raise ValueError("Not enough parameters to create a Classroom object")

    def _load_by_id(self, record_id):
        data = self.dao.get_by_id(record_id)
        if not data:
            raise ValueError("Classroom not found for given id")
        self._set_attributes(data)

    def _set_attributes(self, data):
        self.id = data.get("id")
        self.course_id = data.get("course_id")
        self.name = data.get("name")
        self.number_of_sessions = data.get("number_of_sessions")
        self.expected_session_duration = data.get("expected_session_duration")
        self.created_at = data.get("created_at")
        self.updated_at = data.get("updated_at")
        self.deleted_at = data.get("deleted_at")

    @classmethod
    def new_classroom(cls, form_data):
        if Classroom.dao is None:
            Classroom.dao = ClassroomDAO()
        try:
            classroom_id = Classroom.dao.create(form_data)
        except pymysql.err.IntegrityError as e:
            if "Duplicate entry" in str(e):
                raise ValueError("Classroom with the same name already exists for this course")
            elif "foreign key constraint fails" in str(e).lower():
                raise ValueError("Invalid Course ID")
            else:
                raise ValueError("Unexpected error occurred while creating classroom")
        return classroom_id

class ClassroomManager:
    def __init__(self):
        if Classroom.dao is None:
            Classroom.dao = ClassroomDAO()
        self.dao = Classroom.dao
        self.classrooms: list[Classroom] = []

    def get_all_classrooms(self):
        data = self.dao.get_all()
        self.load_data(data)

    def get_classrooms_by_course_id(self, course_id):
        data = self.dao.get_by_course_id(course_id)
        self.load_data(data)

    def load_data(self, data):
        for record in data:
            classroom = Classroom(record=record)
            self.classrooms.append(classroom)
