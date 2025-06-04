from dao.baseDao import BaseDAO
import constants


class CourseDAO(BaseDAO):
    def __init__(self):
        super().__init__('courses', constants.MAIN_DATABASE)

    def get_by_name(self, name):
        query = f"SELECT * FROM {self.table} WHERE name = %s"
        params = (name,)
        return self.execute_query_single(query, params)

    def get_all_by_teacher_id(self, teacher_id):
        query = f"""
select c.*
from courses c
join teacher_courses tc on c.id = tc.course_id
join teachers t on tc.teacher_id = t.id
where t.id = %s
;
"""
        params = (teacher_id,)
        return self.execute_query(query, params)
