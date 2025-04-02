from dao.baseDao import BaseDAO
import constants


class TokenDAO(BaseDAO):
    def __init__(self):
        super().__init__('tokens', constants.MAIN_DATABASE)

    def get_by_token(self, token):
        query = f"SELECT * FROM {self.table} WHERE token = %s"
        return self.execute_query_single(query, (token,))