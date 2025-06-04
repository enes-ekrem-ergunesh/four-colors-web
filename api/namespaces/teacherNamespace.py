from flask import request
from flask_restx import Namespace, Resource, fields

from dao.teacherDao import TeacherDAO

from objects.User import User
from namespaces.userNamespace import user_model
from special_logger import special_log

dao = TeacherDAO()

ns = Namespace('teacher', description='Teacher related operations')

teacher_course_relation_model = ns.model('Teacher Course Relation', {
    'teacher_id': fields.Integer(readOnly=True, description='The unique identifier of a teacher'),
    'course_id': fields.Integer(readOnly=True, description='The unique identifier of a course'),
})

teacher_classroom_relation_model = ns.model('Teacher Classroom Relation', {
    'teacher_id': fields.Integer(readOnly=True, description='The unique identifier of a teacher'),
    'classroom_id': fields.Integer(readOnly=True, description='The unique identifier of a classroom'),
})

@ns.route('/course/<int:course_id>')
class CourseTeacher(Resource):
    @ns.doc('get_teachers_by_course_id')
    @ns.marshal_list_with(user_model)
    def get(self, course_id):
        """Get teachers by course id"""
        special_log("/teacher/course", f"course_id: {course_id}")
        teachers = dao.get_teachers_by_course_id(course_id)
        if not teachers:
            ns.abort(404, "No teachers found for the given course id")
        return teachers

@ns.route('/course/')
class TeacherCourse(Resource):
    @ns.doc('assign_teacher_to_course')
    @ns.expect(teacher_course_relation_model)
    def post(self):
        """Assign teacher to course"""
        data = request.json
        teacher_id = data.get('teacher_id')
        course_id = data.get('course_id')
        if not teacher_id or not course_id:
            ns.abort(400, "Missing teacher_id or course_id")
        dao.assign_teacher_to_course(teacher_id, course_id)
        return {'message': 'Teacher assigned to course successfully'}, 201

@ns.route('/classroom/')
class TeacherClassroom(Resource):
    @ns.doc('assign_teacher_to_classroom')
    @ns.expect(teacher_classroom_relation_model)
    def post(self):
        """Assign teacher to classroom"""
        data = request.json
        teacher_id = data.get('teacher_id')
        classroom_id = data.get('classroom_id')
        if not teacher_id or not classroom_id:
            ns.abort(400, "Missing teacher_id or classroom_id")
        dao.assign_teacher_to_classroom(teacher_id, classroom_id)
        return {'message': 'Teacher assigned to classroom successfully'}, 201