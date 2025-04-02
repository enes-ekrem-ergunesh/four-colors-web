from dao.baseDao import BaseDAO
import constants

class TeacherDAO(BaseDAO):
    def __init__(self):
        super().__init__('teachers', constants.MAIN_DATABASE)