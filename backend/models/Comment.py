import time
import random
import datetime

import utils.database_connector as db_connector


class Comment:
    """
        This is a class for Comment.

        Attributes:
            id (string): Id of comment.
            user (string): User email of the user who creates the comment.
            event (string): The id of event to which the comment belongs.
            content (string): The content of the comment.
            time (datetime): The time when comment is created
        """
    def __init__(self, user: str, event: str, content: str, comment_time: datetime):
        self.id = None
        self.user = user
        self.event = event
        self.content = content
        self.time = comment_time

    @staticmethod
    def create_comment(comment: 'Comment'):
        """
        create a comment into the database using a comment object.
        :param comment: Comment object
        :return: comment id, string type
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `comment` (`id`, `user`, `event`, `content`, `time`) " \
              "VALUES (%s, %s, %s, %s, %s);"
        comment_id = str(round(time.time() * 1000)) + str(random.randint(0, 1000))
        comment_data = (comment_id, comment.user, comment.event, comment.content,
                        comment.time.strftime('%Y-%m-%d %H:%M:%S'))
        cursor.execute(sql, comment_data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return comment_id

    @staticmethod
    def get_comment_by_event(event: str):
        """
        Get all comments which is under the given event.
        :param event: event id
        :return: a list of comments
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `comment` WHERE event='" + event + "'")
        cursor.execute(query)
        comments = []
        for (comment_id, user, event_id, content, comment_time) in cursor:
            new_comment = Comment(user=user, event=event_id, content=content,
                comment_time=datetime.datetime.strptime(str(comment_time), "%Y-%m-%d %H:%M:%S"))
            new_comment.id = comment_id
            comments.append(new_comment)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in comments], use_decimal=True, default=str)
        return comments
