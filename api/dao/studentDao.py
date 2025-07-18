from dao.baseDao import BaseDAO
import constants

class StudentDAO(BaseDAO):
    def __init__(self):
        super().__init__('students', constants.MAIN_DATABASE)

    def get_students_by_classroom_id(self, classroom_id):
        query = """
select u.id as 'id', u.*, ud.*
from students t
join users u on t.id = u.id
join student_classrooms tc on t.id = tc.student_id
join user_details ud on u.id = ud.id
where classroom_id = %s
;
"""
        params = (classroom_id,)
        return self.execute_query(query, params)

    def assign_student_to_classroom(self, student_id, classroom_id):
        query = "insert into student_classrooms (student_id, classroom_id) values (%s, %s);"
        params = (student_id, classroom_id)
        self.execute_update(query, params)

    def unassign_student_from_classroom(self, student_id, classroom_id):
        query = "delete from student_classrooms where student_id = %s and classroom_id = %s;"
        params = (student_id, classroom_id)
        self.execute_update(query, params)
