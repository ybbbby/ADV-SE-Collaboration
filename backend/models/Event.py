import datetime
import simplejson as json
import random
import time

import utils.database_connector as db_connector
from models.Comment import Comment
from models.Like import Like
from models.Join import Join


class Event:
    def __init__(self, user: str, name: str, address: str, zipcode: str, time: datetime, longitude: float, latitude: float):
        self.id = None
        self.name = name
        self.user_email = user
        self.address = address
        self.longitude = longitude
        self.latitude = latitude
        self.zipcode = zipcode
        self.time = time
        self.description = None
        self.image = None
        self.num_likes = 0
        self.comments = None
        # unsure
        self.liked = False
        self.isAttend = False

    @staticmethod
    def create_event(event: 'Event'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `event` (`id`, `name`, `host`, `address`, `longitude`, `latitude`, `zipcode`, `time`, `description`, `image`, `num_likes`) " \
              "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        event_id = str(round(time.time() * 1000)) + str(random.randint(0, 1000))
        event_data = (event_id, event.name, event.user_email, event.address, event.longitude, event.latitude,
                      event.zipcode, event.time.strftime('%Y-%m-%d %H:%M:%S'), event.description, event.image, event.num_likes)
        cursor.execute(sql, event_data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return event_id

    @staticmethod
    def get_all_event_created_by_user(email: str):
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE host='" + email + "'")
        cursor.execute(query)
        events = []
        for (event_id, name, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, name=name, address=address, longitude=longitude, latitude=latitude, zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            if event_id in liked_events:
                newEvent.liked = True
            newEvent.isAttend = True
            events.append(newEvent)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_all_event_joined_by_user(email: str):
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE `id` IN (SELECT `event` FROM `join` WHERE `user` = '" + email + "');")
        cursor.execute(query)
        events = []
        for (event_id, name, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, name=name, address=address, longitude=longitude, latitude=latitude,
                             zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            if event_id in liked_events:
                newEvent.liked = True
            newEvent.isAttend = True
            events.append(newEvent)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_all_event_liked_by_user(email: str):
        joins = Join.get_join_by_user()
        joined_events = set(join.event for join in joins)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE `id` IN (SELECT `event` FROM `join` WHERE `user` = '" + email + "');")
        cursor.execute(query)
        events = []
        for (
        event_id, name, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, name=name, address=address, longitude=longitude, latitude=latitude,
                             zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            newEvent.liked = True
            if event_id in joined_events:
                newEvent.isAttend = True
            events.append(newEvent)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_all_history_event_by_user(email: str):
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = (
            "SELECT * FROM `event` "
            "WHERE `id` IN (SELECT `event` FROM `join` WHERE `user` = '" + email + "')"
            "and `time` < now();")
        cursor.execute(query)
        events = []
        for (
        event_id, name, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, name=name, address=address, longitude=longitude, latitude=latitude,
                             zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            if event_id in liked_events:
                newEvent.liked = True
            newEvent.isAttend = True
            events.append(newEvent)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_all_ongoing_event_by_user(email: str):
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = (
                "SELECT * FROM `event` "
                "WHERE `id` IN (SELECT `event` FROM `join` WHERE `user` = '" + email + "')"
                                                                                       "and `time` >= now();")
        cursor.execute(query)
        events = []
        for (
                event_id, name, host, address, longitude, latitude, zipcode, time, description, image,
                num_likes) in cursor:
            newEvent = Event(user=host, name=name, address=address, longitude=longitude, latitude=latitude,
                             zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            if event_id in liked_events:
                newEvent.liked = True
            newEvent.isAttend = True
            events.append(newEvent)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_event_by_id(event_id: str, user=None):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE id='" + event_id + "'")
        cursor.execute(query)
        newEvent = None
        for (event_id, name, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, name=name, address=address, longitude=longitude, latitude=latitude, zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            newEvent.liked = Like.exist(host, event_id)
            if user:
                newEvent.isAttend = Join.user_is_attend(user=user, event=event_id)
            else:
                newEvent.isAttend = False
            newEvent.comments = Comment.get_comment_by_event(event_id)
        cursor.close()
        cnx.close()
        # return json.dumps(newEvent.__dict__, use_decimal=True, default=str)
        return newEvent

    @staticmethod
    def delete_event_by_id(event_id: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = ("DELETE FROM `event` WHERE id='" + event_id + "'")
        cursor.execute(sql)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def update_event(fields: dict, id: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        columns = ["`" + c + "`=%s" for c in list(fields.keys())]
        column_str = ", ".join(columns)
        values = list(fields.values())
        values.append(id)
        sql = ("UPDATE `event` SET " + column_str + "  WHERE (`id`=%s)")
        event_data = tuple(values)
        cursor.execute(sql, event_data)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def serialize_comment_in_event(obj):
        if isinstance(obj, Comment):
            return {"comment_id": obj.id,
                    "comment_content": obj.content,
                    "comment_time": obj.time,
                    "comment_user": obj.user
                    }
        else:
            return str(obj)
