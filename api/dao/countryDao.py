from dao.baseDao import BaseDAO
import constants

class CountryDAO(BaseDAO):
    def __init__(self):
        super().__init__('countries', constants.MAIN_DATABASE)