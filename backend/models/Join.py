import utils.database_connector as db_connector


class Join:
    """
    This is a class for Join. It shows a user attends an event.

    Attributes:
        user (string): Email of the user
        event (string): The id of event user attends
    """
    def __init__(self, user: str, event: str):
        self.user = user
        self.event = event

    @staticmethod
    def create_join(join: 'Join'):
        """

        :param join: join object
        """
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
        """

        :param user: Email of the user
        :return: list of Joins which is related to user
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `join` WHERE user='" + user + "'")
        cursor.execute(query)
        joins = []
        for (join_user, join_event) in cursor:
            joins.append(Join(user=join_user, event=join_event))
        cursor.close()
        cnx.close()
        return joins

    @staticmethod
    def get_join_by_event(event: str):
        """
        Get a list of joins belongs to the event.
        :param event: event object
        :return: list of joins belongs to the event.
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `join` WHERE event='" + event + "'")
        cursor.execute(query)
        joins = []
        for (join_user, join_event) in cursor:
            joins.append(Join(user=join_user, event=join_event))
        cursor.close()
        cnx.close()
        return joins

    @staticmethod
    def user_is_attend(user: str, event: str):
        """

        :param user: user email
        :param event: event id
        :return: boolean variable indicates whether the given user attends the event
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `join` WHERE event=%s AND user=%s")
        params = (event, user)
        cursor.execute(query, params)
        find_result = False
        for _, _ in cursor:
            find_result = True
        cursor.close()
        cnx.close()
        return find_result
