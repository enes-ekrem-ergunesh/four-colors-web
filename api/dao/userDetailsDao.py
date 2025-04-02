from dao.baseDao import BaseDAO
import constants

class UserDetailsDAO(BaseDAO):
    def __init__(self):
        super().__init__('user_details', constants.MAIN_DATABASE)