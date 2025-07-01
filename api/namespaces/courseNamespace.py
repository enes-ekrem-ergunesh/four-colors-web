from flask import request
from flask_restx import Namespace, Resource, fields

from namespaces.adminNamespace import block_non_admin

from objects.Course import Course, CourseManager
from special_logger import special_log

ns = Namespace('course', description='Course related operations')

course_model = ns.model('Course', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a course'),
    'name': fields.String(required=True, description='Course name'),
    'description': fields.String(required=True, description='Course description'),
    'created_at': fields.DateTime(required=True, description='Course created at'),
    'updated_at': fields.DateTime(required=True, description='Course updated at'),
    'deleted_at': fields.DateTime(required=True, description='Course deleted at'),
})

new_course_model = ns.model('New Course', {
    'name': fields.String(required=True, description='Course name'),
    'description': fields.String(required=True, description='Course description'),
})

def get_course_object(course_id=None, name=None):
    course = None
    def exception_handler(e):
        # special_log("/login", str(e), email=ns.payload['email'])
        # if str(e) == 'User not found for given email':
        #     ns.abort(401, "Invalid email or password")
        #     return
        # ns.abort(401, e)
        return
    if name:
        try:
            course = Course(name=name)
        except ValueError as ve:
            exception_handler(ve)
    elif course_id:
        try:
            course = Course(course_id=course_id)
        except ValueError as ve:
            exception_handler(ve)
    else:
        ns.abort(500, "Internal server error: course_id or name is required")
        return None
    return course

@ns.route('/')
class CourseList(Resource):
    @ns.doc('get_courses')
    @ns.marshal_list_with(course_model)
    def get(self):
        """Get courses"""
        course_manager = CourseManager()
        course_manager.get_all_courses()
        return course_manager.courses

    @ns.doc('create_course')
    @ns.expect(new_course_model)
    @ns.marshal_with(course_model)
    def post(self):
        """Create a new course"""
        block_non_admin()
        try:
            course_id = Course.new_course(ns.payload)
        except ValueError as ve:
            ns.abort(400, str(ve))
            return None
        course = Course(course_id=course_id)
        return course

@ns.route('/<int:course_id>')
class CourseSingle(Resource):
    @ns.doc('get_course')
    @ns.marshal_with(course_model)
    def get(self, course_id):
        """Get a course by ID"""
        course = get_course_object(course_id=course_id)
        if not course:
            ns.abort(404, "Course not found")
            return None
        return course

    @ns.doc('soft_delete_course')
    def delete(self, course_id):
        """Soft-delete a course by id"""
        block_non_admin()
        course = Course(course_id=course_id)
        if not course:
            ns.abort(404, "Course not found")
            return None
        try:
            course.soft_delete()
        except ValueError as ve:
            ns.abort(400, str(ve))
            return None
        return {'message': 'Course soft-deleted successfully'}, 204

@ns.route('/teacher/<int:teacher_id>')
class CoursesByTeacher(Resource):
    @ns.doc('get_courses_by_teacher')
    @ns.marshal_list_with(course_model)
    def get(self, teacher_id):
        """Get courses by teacher ID"""
        course_manager = CourseManager()
        course_manager.get_courses_by_teacher_id(teacher_id)
        return course_manager.courses
