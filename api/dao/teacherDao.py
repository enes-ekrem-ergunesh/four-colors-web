from dao.baseDao import BaseDAO
import constants

class TeacherDAO(BaseDAO):
    def __init__(self):
        super().__init__('teachers', constants.MAIN_DATABASE)

    def get_teachers_by_course_id(self, course_id):
        query = f"""
select u.*
from teachers t
join users u on t.id = u.id
join teacher_courses tc on t.id = tc.teacher_id
where course_id = %s
;
"""
        params = (course_id,)
        return self.execute_query(query, params)