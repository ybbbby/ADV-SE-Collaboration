"""
Event: Helper functions for Event Database
"""

import datetime
import random
import time

import utils.database_connector as db_connector
from models.comment import Comment
from models.like import Like
from models.join import Join
from models.user import User


class Event:
    """
    This is a class for Event. It shows details of a event

    Attributes:
        event_id (string): Id of the event
        name (string): email name of the author of the event
        author (string): name of the author of the event
        address (string): address of the event
        longitude (Decimal): longitude of the event location
        latitude (Decimal): latitude of the event location
        zipcode (string): zipcode of the event location
        time (datetime): event start time
        description (string): description of the event
        image (string): path of the image of the event
        num_likes (string): number of likes the event has
        comments (list): a list of comments the event has
    """

    def __init__(self, user: str, name: str, address: str,
                 zipcode: str, event_time: datetime, longitude: float, latitude: float):
        self.event_id = None
        self.name = name
        self.user_email = user
        self.author = User.get_user_by_email(user).username
        self.address = address
        self.longitude = longitude
        self.latitude = latitude
        self.zipcode = zipcode
        self.time = event_time
        self.description = None
        self.image = None
        self.num_likes = 0
        self.comments = None
        self.category = None
        # unsure
        self.liked = False
        self.attended = False

    @staticmethod
    def create_event(event: 'Event'):
        """
        Create an event.
        :param event: event object.
        :return: The id of event.
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `event` (`id`, `name`, `host`, `address`, `longitude`, `latitude`," \
              " `zipcode`, `time`, `description`, `image`, `num_likes`, `category`) " \
              "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        event_id = str(round(time.time() * 1000)) + \
            str(random.randint(0, 1000))
        event_data = (event_id, event.name, event.user_email, event.address,
                      event.longitude, event.latitude,
                      event.zipcode, event.time.strftime('%Y-%m-%d %H:%M:%S'),
                      event.description, event.image, event.num_likes, event.category)
        cursor.execute(sql, event_data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return event_id

    @staticmethod
    def get_all_event_created_by_user(email: str):
        """

        :param email: Email of user
        :return: A list of event which is created by the given user.
        """
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE host='" + email + "'")
        cursor.execute(query)
        events = []
        for (event_id, name, host, address, longitude, latitude,
             zipcode, event_time, description, image, num_likes, category) in cursor:
            new_event = Event(user=host, name=name, address=address, longitude=longitude,
                              latitude=latitude, zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = event_id
            new_event.description = description
            new_event.image = image
            new_event.category = category
            new_event.num_likes = num_likes
            if event_id in liked_events:
                new_event.liked = True
            new_event.attended = True
            events.append(new_event)
        cursor.close()
        cnx.close()
        return events

    @staticmethod
    def get_all_event_joined_by_user(email: str):
        """

        :param email: Email of user
        :return: A list of events which is attended by user
        """
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE `id` IN "
                 "(SELECT `event` FROM `join` WHERE `user` = '" + email + "');")
        cursor.execute(query)
        events = []
        for (event_id, name, host, address, longitude, latitude,
             zipcode, event_time, description, image, num_likes, category) in cursor:
            new_event = Event(user=host, name=name, address=address,
                              longitude=longitude, latitude=latitude,
                              zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = event_id
            new_event.description = description
            new_event.image = image
            new_event.num_likes = num_likes
            new_event.category = category
            if event_id in liked_events:
                new_event.liked = True
            new_event.attended = True
            events.append(new_event)
        cursor.close()
        cnx.close()
        return events

    @staticmethod
    def get_all_event_liked_by_user(email: str):
        """

        :param email: Email of user
        :return: A list of events which is liked by user.
        """
        joins = Join.get_join_by_user(email)
        joined_events = set(join.event for join in joins)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE `id` "
                 "IN (SELECT `event` FROM `like` WHERE `user` = '" + email + "');")
        cursor.execute(query)
        events = []
        for (event_id, name, host, address, longitude, latitude,
             zipcode, event_time, description, image, num_likes, category) in cursor:
            new_event = Event(user=host, name=name, address=address,
                              longitude=longitude, latitude=latitude,
                              zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = event_id
            new_event.description = description
            new_event.image = image
            new_event.num_likes = num_likes
            new_event.liked = True
            new_event.category = category
            if event_id in joined_events:
                new_event.attended = True
            events.append(new_event)
        cursor.close()
        cnx.close()
        return events

    @staticmethod
    def get_all_history_event_by_user(email: str):
        """

        :param email: Email of user
        :return: A list of events which is attended by user, but expired
        """
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
                event_id, name, host, address, longitude, latitude,
                zipcode, event_time, description, image, num_likes, category) in cursor:
            new_event = Event(user=host, name=name, address=address,
                              longitude=longitude, latitude=latitude,
                              zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = event_id
            new_event.description = description
            new_event.image = image
            new_event.num_likes = num_likes
            new_event.category = category
            if event_id in liked_events:
                new_event.liked = True
            new_event.attended = True
            events.append(new_event)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_all_ongoing_event_by_user(email: str):
        """

        :param email: Email of user
        :return: A list of event which is ongoing, and is attended by user.
        """
        likes = Like.get_like_by_user(email)
        liked_events = set(like.event for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = (
            "SELECT * FROM `event` "
            "WHERE `id` IN "
            "(SELECT `event` FROM `join` WHERE `user` = '" + email + "') and `time` >= now();")
        cursor.execute(query)
        events = []
        for (
                event_id, name, host, address,
                longitude, latitude, zipcode, event_time, description, image,
                num_likes, category) in cursor:
            new_event = Event(user=host, name=name, address=address,
                              longitude=longitude, latitude=latitude,
                              zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = event_id
            new_event.description = description
            new_event.image = image
            new_event.num_likes = num_likes
            new_event.category = category
            if event_id in liked_events:
                new_event.liked = True
            new_event.attended = True
            events.append(new_event)
        cursor.close()
        cnx.close()
        # return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)
        return events

    @staticmethod
    def get_event_by_id(event_id: str, user=None):
        """

        :param event_id: Id of the event
        :param user: user email
        :return: An event object whose id is the given event_id,
        and also indicates whether the user is attending the event
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE id='" + event_id + "'")
        cursor.execute(query)
        new_event = None
        for (eid, name, host, address,
             longitude, latitude, zipcode, event_time, description,
             image, num_likes, category) in cursor:
            new_event = Event(user=host, name=name, address=address,
                              longitude=longitude, latitude=latitude, zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = eid
            new_event.description = description
            new_event.image = image
            new_event.num_likes = num_likes
            new_event.category = category
            if user:
                new_event.liked = Like.exist(user, event_id)
                new_event.attended = Join.user_is_attend(
                    user=user, event=event_id)
            else:
                new_event.liked = False
                new_event.attended = False
            new_event.comments = Comment.get_comment_by_event(event_id)
        cursor.close()
        cnx.close()
        return new_event

    @staticmethod
    def delete_event_by_id(event_id: str):
        """
        Delte the event from the database
        :param event_id: event id
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = ("DELETE FROM `event` WHERE id='" + event_id + "'")
        cursor.execute(sql)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def update_event(fields: dict, event_id: str):
        """
        Update certain columns in the database
        :param fields: A dictionary of columns
        :param id: Id of the event.
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        columns = ["`" + c + "`=%s" for c in list(fields.keys())]
        column_str = ", ".join(columns)
        values = list(fields.values())
        values.append(event_id)
        sql = ("UPDATE `event` SET " + column_str + "  WHERE (`id`=%s)")
        event_data = tuple(values)
        cursor.execute(sql, event_data)
        cnx.commit()
        cursor.close()
        cnx.close()

    @staticmethod
    def get_nearby_events(user: str, latitude: float, longitude: float):
        """

        :return: A nearby event list
        """
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT *, cal_dist(%s, %s, latitude, longitude) dist FROM event "
                 "where `time` >= now() order by dist")
        event_data = (latitude, longitude)
        cursor.execute(query, event_data)
        events = []
        for (eid, name, host, address,
             longi, lati, zipcode, event_time, description,
             image, num_likes, category, _) in cursor:
            new_event = Event(user=host, name=name, address=address,
                              longitude=longi, latitude=lati, zipcode=zipcode,
                              event_time=datetime.datetime.strptime(str(event_time),
                                                                    "%Y-%m-%d %H:%M:%S"))
            new_event.event_id = eid
            new_event.description = description
            new_event.image = image
            new_event.num_likes = num_likes
            new_event.category = category
            if user:
                new_event.liked = Like.exist(user, eid)
                new_event.attended = Join.user_is_attend(
                    user=user, event=eid)
            else:
                new_event.liked = False
                new_event.attended = False
            new_event.comments = Comment.get_comment_by_event(eid)
            events.append(new_event)
        cursor.close()
        cnx.close()
        return events

    @staticmethod
    def serialize_comment_in_event(obj):
        """

        :param obj: comment object
        :return: A string of the comment
        """
        if isinstance(obj, Comment):
            return {"id": obj.comment_id,
                    "content": obj.content,
                    "time": obj.time,
                    "user": obj.user
                    }
        return str(obj)
