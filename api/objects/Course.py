import pymysql

from dao.courseDao import CourseDAO

class Course:
    dao = None

    def __init__(self, course_id=None, name=None, record=None):
        if Course.dao is None:
            Course.dao = CourseDAO()

        if course_id:
            self._load_by_id(course_id)
        elif name:
            self._load_by_name(name)
        elif record:
            self._set_attributes(record)
        else:
            raise ValueError("Not enough parameters to create a Course object")

    def _load_by_id(self, record_id):
        data = self.dao.get_by_id(record_id)
        if not data:
            raise ValueError("Course not found for given id")
        self._set_attributes(data)

    def _load_by_name(self, name):
        data = self.dao.get_by_name(name)
        if not data:
            raise ValueError("Course not found for given name")
        self._set_attributes(data)

    def _set_attributes(self, data):
        self.id = data.get("id")
        self.name = data.get("name")
        self.description = data.get("description")
        self.created_at = data.get("created_at")
        self.updated_at = data.get("updated_at")
        self.deleted_at = data.get("deleted_at")

    @classmethod
    def new_course(cls, form_data):
        if Course.dao is None:
            Course.dao = CourseDAO()
        print(form_data['name'])
        print(form_data['description'])
        try:
            course_id = Course.dao.create(form_data)
        except pymysql.err.IntegrityError:
            raise ValueError("Course with same name already exists")
        return course_id

class CourseManager:
    def __init__(self):
        if Course.dao is None:
            Course.dao = CourseDAO()
        self.dao = Course.dao
        self.courses: list[Course] = []

    def get_all_courses(self):
        data = self.dao.get_all()
        self.load_data(data)

    def load_data(self, data):
        for record in data:
            course = Course(record=record)
            self.courses.append(course)
