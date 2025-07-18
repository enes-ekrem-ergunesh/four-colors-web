from flask_restx import Namespace, Resource, fields

from namespaces.adminNamespace import block_non_admin

from objects.Classroom import Classroom, ClassroomManager

ns = Namespace('classroom', description='Classroom related operations')

classroom_model = ns.model('Classroom', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a classroom'),
    'course_id': fields.Integer(required=True, description='Id of the course to which the classroom belongs'),
    'name': fields.String(required=True, description='Classroom name'),
    'number_of_sessions': fields.Integer(required=True, description='Number of sessions to be held in the classroom'),
    'expected_session_duration': fields.Integer(required=True, description='Expected session duration in minutes'),
    'created_at': fields.DateTime(required=True, description='Classroom created at'),
    'updated_at': fields.DateTime(required=True, description='Classroom updated at'),
    'deleted_at': fields.DateTime(required=True, description='Classroom deleted at'),
})

new_classroom_model = ns.model('New Classroom', {
    'course_id': fields.Integer(required=True, description='Id of the course to which the classroom belongs'),
    'name': fields.String(required=True, description='Classroom name'),
    'number_of_sessions': fields.Integer(required=True, description='Number of sessions to be held in the classroom'),
    'expected_session_duration': fields.Integer(required=True, description='Expected session duration in minutes'),
})


def get_classroom_object(classroom_id=None):
    classroom = None

    def exception_handler(e):
        # special_log("/login", str(e), email=ns.payload['email'])
        # if str(e) == 'User not found for given email':
        #     ns.abort(401, "Invalid email or password")
        #     return
        # ns.abort(401, e)
        return

    if classroom_id:
        try:
            classroom = Classroom(classroom_id=classroom_id)
        except ValueError as ve:
            exception_handler(ve)
    else:
        ns.abort(500, "Internal server error: classroom_id is required")
        return None
    return classroom

@ns.route('/')
class ClassroomList(Resource):
    @ns.doc('get_classrooms')
    @ns.marshal_list_with(classroom_model)
    def get(self):
        """Get classrooms"""
        classroom_manager = ClassroomManager()
        classroom_manager.get_all_classrooms()
        return classroom_manager.classrooms

    @ns.doc('create_classroom')
    @ns.expect(new_classroom_model)
    @ns.marshal_with(classroom_model)
    def post(self):
        """Create a new classroom"""
        block_non_admin()
        try:
            classroom_id = Classroom.new_classroom(ns.payload)
        except ValueError as ve:
            ns.abort(400, str(ve))
            return None
        classroom = Classroom(classroom_id=classroom_id)
        return classroom

@ns.route('/<int:classroom_id>')
class ClassroomDetail(Resource):
    @ns.doc('get_classroom')
    @ns.marshal_with(classroom_model)
    def get(self, classroom_id):
        """Get a classroom by ID"""
        classroom = get_classroom_object(classroom_id=classroom_id)
        if not classroom:
            ns.abort(404, "Classroom not found")
            return None
        return classroom

    @ns.doc('soft_delete_classroom')
    def delete(self, classroom_id):
        """Soft-delete a classroom by id"""
        block_non_admin()
        classroom = Classroom(classroom_id=classroom_id)
        if not classroom:
            ns.abort(404, "Classroom not found")
            return None
        try:
            classroom.soft_delete()
        except ValueError as ve:
            ns.abort(400, str(ve))
            return None
        return {'message': 'Classroom soft-deleted successfully'}, 204

    @ns.doc('restore_classroom')
    def patch(self, classroom_id):
        """Restore a soft-deleted classroom by id"""
        block_non_admin()
        classroom = Classroom(classroom_id=classroom_id)
        if not classroom:
            ns.abort(404, "Classroom not found")
            return None
        try:
            classroom.restore()
        except ValueError as ve:
            ns.abort(400, str(ve))
            return None
        return {'message': 'Classroom restored successfully'}, 200

@ns.route('/course/<int:course_id>')
class CourseClassroomList(Resource):
    @ns.doc('get_classrooms_by_course_id')
    @ns.marshal_list_with(classroom_model)
    def get(self, course_id):
        """Get classrooms by course id"""
        classroom_manager = ClassroomManager()
        classroom_manager.get_classrooms_by_course_id(course_id)
        return classroom_manager.classrooms

@ns.route('/teacher/<int:teacher_id>')
class TeacherClassroomList(Resource):
    @ns.doc('get_classrooms_by_teacher_id')
    @ns.marshal_list_with(classroom_model)
    def get(self, teacher_id):
        """Get classrooms by teacher id"""
        classroom_manager = ClassroomManager()
        classroom_manager.get_classrooms_by_teacher_id(teacher_id)
        return classroom_manager.classrooms

@ns.route('/student/<int:student_id>')
class StudentClassroomList(Resource):
    @ns.doc('get_classrooms_by_student_id')
    @ns.marshal_list_with(classroom_model)
    def get(self, student_id):
        """Get classrooms by student id"""
        classroom_manager = ClassroomManager()
        classroom_manager.get_classrooms_by_student_id(student_id)
        return classroom_manager.classrooms

@ns.route('/student/available/<int:student_id>')
class StudentAvailableClassroomList(Resource):
    @ns.doc('get_available_classrooms_by_student_id')
    @ns.marshal_list_with(classroom_model)
    def get(self, student_id):
        """Get available classrooms by student id"""
        classroom_manager = ClassroomManager()
        classroom_manager.get_available_classrooms_by_student_id(student_id)
        return classroom_manager.classrooms

