from flask import request
from flask_restx import Namespace, Resource, fields

from dao.teacherDao import TeacherDAO

from objects.User import User
from namespaces.userNamespace import user_model
from special_logger import special_log

dao = TeacherDAO()

ns = Namespace('teacher', description='Teacher related operations')

@ns.route('/course/<int:course_id>')
class CourseTeacherList(Resource):
    @ns.doc('get_teachers_by_course_id')
    @ns.marshal_list_with(user_model)
    def get(self, course_id):
        """Get teachers by course id"""
        special_log("/teacher/course", f"course_id: {course_id}")
        teachers = dao.get_teachers_by_course_id(course_id)
        if not teachers:
            ns.abort(404, "No teachers found for the given course id")
        return teachers

