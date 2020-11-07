import simplejson as json

import utils.database_connector as db_connector


class Like:
    def __init__(self, user: str, event: str):
        self.user = user
        self.event = event

    @staticmethod
    def create_like(like: 'Like'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `like` (`user`, `event`) " \
              "VALUES (%s, %s);"
        like_data = (like.user, like.event)
        cursor.execute(sql, like_data)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def get_like_by_user(user: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `like` WHERE user='" + user + "'")
        cursor.execute(query)
        likes = []
        for (user, event) in cursor:
            likes.append(Like(user=user, event=event))
        cursor.close()
        cnx.close()
        return json.dumps([ob.__dict__ for ob in likes], use_decimal=True, default=str)

    @staticmethod
    def get_like_by_event(event: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `like` WHERE event='" + event + "'")
        cursor.execute(query)
        likes = []
        for (user, event) in cursor:
            likes.append(Like(user=user, event=event))
        cursor.close()
        cnx.close()
        return json.dumps([ob.__dict__ for ob in likes], use_decimal=True, default=str)

    @staticmethod
    def exist(user: str, event: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `like` WHERE user='" + user + "' and event='" + event + "'")
        cursor.execute(query)
        ret = False
        for _ in cursor:
            ret = True
        cursor.close()
        cnx.close()
        return ret
