import simplejson as json

import utils.database_connector as db_connector


class Join:
    def __init__(self, user: str, event: str):
        self.user = user
        self.event = event

    @staticmethod
    def create_join(join: 'Join'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `join` (`user`, `event`) " \
              "VALUES (%s, %s);"
        join_data = (join.user, join.event)
        cursor.execute(sql, join_data)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def get_join_by_user(user: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `join` WHERE user='" + user + "'")
        cursor.execute(query)
        joins = []
        for (user, event) in cursor:
            joins.append(Join(user=user, event=event))
        cursor.close()
        cnx.close()
        return joins

    @staticmethod
    def get_join_by_event(event: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `join` WHERE event='" + event + "'")
        cursor.execute(query)
        joins = []
        for (user, event) in cursor:
            joins.append(Join(user=user, event=event))
        cursor.close()
        cnx.close()
        return joins

    @staticmethod
    def user_is_attend(user: str, event: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `join` WHERE event=%s AND user=%s")
        params = (event, user)
        cursor.execute(query, params)
        find_result = False
        for u,e in cursor:
            find_result = True
        cursor.close()
        cnx.close()
        return find_result
