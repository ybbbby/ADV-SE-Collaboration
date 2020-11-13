import time
import random
import datetime
import simplejson as json

import utils.database_connector as db_connector


class Comment:
    def __init__(self, user: str, event: str, content: str, time: datetime):
        self.id = None
        self.user = user
        self.event = event
        self.content = content
        self.time = time

    @staticmethod
    def create_comment(comment: 'Comment'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `comment` (`id`, `user`, `event`, `content`, `time`) " \
              "VALUES (%s, %s, %s, %s, %s);"
        comment_id = str(round(time.time() * 1000)) + str(random.randint(0, 1000))
        comment_data = (comment_id, comment.user, comment.event, comment.content, comment.time.strftime('%Y-%m-%d %H:%M:%S'))
        cursor.execute(sql, comment_data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return comment_id

    @staticmethod
    def get_comment_by_event(event: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `comment` WHERE event='" + event + "'")
        cursor.execute(query)
        comments = []
        for (comment_id, user, event, content, time) in cursor:
            newComment = Comment(user=user, event=event, content=content, 
                time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newComment.id = comment_id
            comments.append(newComment)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in comments], use_decimal=True, default=str)
        return comments

