from dao.baseDao import BaseDAO
import constants

class ClassroomDAO(BaseDAO):
    def __init__(self):
        super().__init__('classrooms', constants.MAIN_DATABASE)

    def get_by_name(self, name):
        query = f"SELECT * FROM {self.table} WHERE name = %s"
        params = (name,)
        return self.execute_query_single(query, params)

    def get_all_by_course_id(self, course_id):
        query = f"SELECT * FROM {self.table} WHERE course_id = %s"
        params = (course_id,)
        return self.execute_query(query, params)

    def get_all_by_teacher_id(self, teacher_id):
        query = f"""
select c.*
from classrooms c
join teacher_classrooms tc on c.id = tc.classroom_id
join teachers t on tc.teacher_id = t.id
where t.id = %s
;
"""
        params = (teacher_id,)
        return self.execute_query(query, params)

    def get_teacher_available_classrooms(self, teacher_id):
        query = """
select cr.*
from classrooms cr
join teacher_courses tc on tc.course_id = cr.course_id
where tc.teacher_id = %s;
"""
        params = (teacher_id,)
        return self.execute_query(query, params)