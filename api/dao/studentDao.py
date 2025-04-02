from dao.baseDao import BaseDAO
import constants

class StudentDAO(BaseDAO):
    def __init__(self):
        super().__init__('students', constants.MAIN_DATABASE)