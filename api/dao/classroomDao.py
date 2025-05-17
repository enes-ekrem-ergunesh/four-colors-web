from dao.baseDao import BaseDAO
import constants

class ClassroomDAO(BaseDAO):
    def __init__(self):
        super().__init__('classrooms', constants.MAIN_DATABASE)

    def get_by_name(self, name):
        query = f"SELECT * FROM {self.table} WHERE name = %s"
        params = (name,)
        return self.execute_query_single(query, params)

    def get_by_course_id(self, course_id):
        query = f"SELECT * FROM {self.table} WHERE course_id = %s"
        params = (course_id,)
        return self.execute_query(query, params)