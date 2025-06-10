from dao.baseDao import BaseDAO
import constants

class TeacherDAO(BaseDAO):
    def __init__(self):
        super().__init__('teachers', constants.MAIN_DATABASE)

    def get_teachers_by_course_id(self, course_id):
        query = """
select u.*
from teachers t
join users u on t.id = u.id
join teacher_courses tc on t.id = tc.teacher_id
where course_id = %s
;
"""
        params = (course_id,)
        return self.execute_query(query, params)

    def assign_teacher_to_course(self, teacher_id, course_id):
        query = "insert into teacher_courses values (%s, %s);"
        params = (teacher_id, course_id)
        self.execute_update(query, params)

    def assign_teacher_to_classroom(self, teacher_id, classroom_id):
        query = "insert into teacher_classrooms (teacher_id, classroom_id) values (%s, %s);"
        params = (teacher_id, classroom_id)
        self.execute_update(query, params)

    def unassign_teacher_from_course(self, teacher_id, course_id):
        query = "delete from teacher_courses where teacher_id = %s and course_id = %s;"
        params = (teacher_id, course_id)
        self.execute_update(query, params)

    def unassign_teacher_from_classroom(self, teacher_id, classroom_id):
        query = "delete from teacher_classrooms where teacher_id = %s and classroom_id = %s;"
        params = (teacher_id, classroom_id)
        self.execute_update(query, params)