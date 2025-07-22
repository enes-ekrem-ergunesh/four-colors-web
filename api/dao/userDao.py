from dao.baseDao import BaseDAO
import constants


class UserDAO(BaseDAO):
    def __init__(self):
        super().__init__('users', constants.MAIN_DATABASE)

    def get_all_with_roles(self):
        query = """
            SELECT
                u.*,
                CASE
                    WHEN t.id IS NOT NULL THEN 'teacher'
                    WHEN s.id IS NOT NULL THEN 'student'
                END AS type
            FROM users u
            LEFT JOIN teachers t ON u.id = t.id
            LEFT JOIN students s ON u.id = s.id
            WHERE t.id IS NOT NULL OR s.id IS NOT NULL;
        """
        return self.execute_query(query)

    def get_by_id_role(self, user_id):
        query = """
            SELECT
                u.*,
                CASE
                    WHEN t.id IS NOT NULL THEN 'teacher'
                    WHEN s.id IS NOT NULL THEN 'student'
                    ELSE 'admin'
                END AS type
            FROM users u
            LEFT JOIN teachers t ON u.id = t.id
            LEFT JOIN students s ON u.id = s.id
            WHERE u.id = %s;
        """
        return self.execute_query_single(query, (user_id,))

    def get_by_email(self, email):
        query = """
            SELECT
                u.*,
                CASE
                    WHEN t.id IS NOT NULL THEN 'teacher'
                    WHEN s.id IS NOT NULL THEN 'student'
                END AS type
            FROM users u
            LEFT JOIN teachers t ON u.id = t.id
            LEFT JOIN students s ON u.id = s.id
            WHERE u.email = %s;
        """
        return self.execute_query_single(query, (email,))

    def get_admins(self):
        query = f"SELECT * FROM {self.table} WHERE is_admin = 1"
        return self.execute_query(query)

    def get_all_students(self):
        query = """
            select u.*, 'student' as type
            from users u
            join students s on u.id = s.id
            ;
        """
        return self.execute_query(query)

    def get_all_teachers(self):
        query = """
            select u.*, 'teacher' as type
            from users u
            join teachers t on u.id = t.id
            ;
        """
        return self.execute_query(query)
