import utils.database_connector as db_connector


class User:
    def __init__(self, email: str, username: str):
        self.email = email
        self.username = username

    @staticmethod
    def create_user(user: 'User'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `user` (`email`, `name`) " \
              "VALUES (%s, %s)"
        user_data = (user.email, user.username)
        cursor.execute(sql, user_data)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def get_user_by_email(email):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT `name` FROM `user` WHERE `email`='" + email + "'")
        cursor.execute(query)

        res = None
        for name in cursor:
            res = User(email, name[0])
        cursor.close()
        cnx.close()
        return res

    @staticmethod
    def get_attendees_by_event(event: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = (
            "with `tmp` as (select `user` from `join` where `event` = '" + event + "')"
            "select `user`.* from `user` join `tmp` on `user`.`email` = `tmp`.`user`;")
        cursor.execute(query)
        users = []
        for (email, name) in cursor:
            users.append(User(email=email, username=name))
        cursor.close()
        cnx.close()
        return users
