import utils.database_connector as db_connector


class Like:
    """
    This is a class for Like. It shows a like connection

    Attributes:

        user (string): email of the user
        event (string): id of the event

    """
    def __init__(self, user: str, event: str):
        self.user = user
        self.event = event

    @staticmethod
    def create_like(like: 'Like'):
        """
        Insert a like into the database
        :param like: like object
        """
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
        """
        Get a list of like objects from the user
        :param user: email of the user
        :return: a list of like objects related to the user
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `like` WHERE user='" + user + "'")
        cursor.execute(query)
        likes = []
        for (user, event) in cursor:
            likes.append(Like(user=user, event=event))
        cursor.close()
        cnx.close()
        return likes

    @staticmethod
    def get_like_by_event(event: str):
        """
        Get a list of events which are liked by user
        :param event: event id
        :return: a list of events which are liked by user
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `like` WHERE event='" + event + "'")
        cursor.execute(query)
        likes = []
        for (user, event) in cursor:
            likes.append(Like(user=user, event=event))
        cursor.close()
        cnx.close()
        return likes

    @staticmethod
    def exist(user: str, event: str):
        """
        Check whether the event is liked by the user
        :param user: email of the user
        :param event: event id
        :return: boolean variable
        """
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
    
    @staticmethod
    def delete_like(like: 'Like'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("DELETE FROM `like` WHERE user='" + like.user + "' and event='" + like.event + "'")
        cursor.execute(query)
        cnx.commit()
        cursor.close()
        cnx.close()

