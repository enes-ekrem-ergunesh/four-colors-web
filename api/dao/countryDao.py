from dao.baseDao import BaseDAO
import constants

class CountryDAO(BaseDAO):
    def __init__(self):
        super().__init__('countries', constants.MAIN_DATABASE)

    def max_id(self):
        query = "SELECT MAX(id) AS 'max' FROM countries"
        return self.execute_query_single(query).get("max")
