from flask import request
from flask_restx import Namespace, Resource, fields

from dao.studentDao import StudentDAO

from namespaces.userNamespace import user_model, overwrite_nationality_fields
from special_logger import special_log

dao = StudentDAO()

ns = Namespace('student', description='Student related operations')

student_course_relation_model = ns.model('Student Course Relation', {
    'student_id': fields.Integer(readOnly=True, description='The unique identifier of a student'),
    'course_id': fields.Integer(readOnly=True, description='The unique identifier of a course'),
})

student_classroom_relation_model = ns.model('Student Classroom Relation', {
    'student_id': fields.Integer(readOnly=True, description='The unique identifier of a student'),
    'classroom_id': fields.Integer(readOnly=True, description='The unique identifier of a classroom'),
})

@ns.route('/classroom/<int:classroom_id>')
class ClassroomStudent(Resource):
    @ns.doc('get_students_by_classroom_id')
    @ns.marshal_list_with(user_model)
    def get(self, classroom_id):
        """Get students by classroom id"""
        special_log("/student/classroom", f"classroom_id: {classroom_id}")
        students = dao.get_students_by_classroom_id(classroom_id)
        if not students:
            ns.abort(404, "No students found for the given classroom id")
        overwrite_nationality_fields(students)
        return students

@ns.route('/classroom/')
class StudentClassroom(Resource):
    @ns.doc('assign_student_to_classroom')
    @ns.expect(student_classroom_relation_model)
    def post(self):
        """Assign student to classroom"""
        data = request.json
        student_id = data.get('student_id')
        classroom_id = data.get('classroom_id')
        if not student_id or not classroom_id:
            ns.abort(400, "Missing student_id or classroom_id")
        try:
            dao.assign_student_to_classroom(student_id, classroom_id)
        except Exception as e:
            special_log("/student/classroom", f"Error assigning student to classroom: {e}")
            ns.abort(500, "Failed to assign student to classroom")
        return {'message': 'Student assigned to classroom successfully'}, 201

    @ns.doc('delete_student_from_classroom')
    @ns.expect(student_classroom_relation_model)
    def delete(self):
        """Remove student from the classroom"""
        data = request.json
        student_id = data.get('student_id')
        classroom_id = data.get('classroom_id')
        if not student_id or not classroom_id:
            ns.abort(400, "Missing student_id or classroom_id")
        try:
            dao.unassign_student_from_classroom(student_id, classroom_id)
        except Exception as e:
            special_log("/student/classroom", f"Error removing student from classroom: {e}")
            ns.abort(500, "Failed to remove student from classroom")
        return {'message': 'Student removed from classroom successfully'}, 200