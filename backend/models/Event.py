import datetime
import simplejson as json
import random
import time

import utils.database_connector as db_connector
from models.Like import Like


class Event:
    def __init__(self, user: str, address: str, zipcode: str, time: datetime, longitude: float, latitude: float):
        self.id = None
        self.user_email = user
        self.address = address
        self.longitude = longitude
        self.latitude = latitude
        self.zipcode = zipcode
        self.time = time
        self.description = None
        self.image = None
        self.num_likes = 0
        # unsure
        self.liked = False
        self.isAttend = False

    @staticmethod
    def create_event(event: 'Event'):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        sql = "INSERT INTO `event` (`id`, `host`, `address`, `longitude`, `latitude`, `zipcode`, `time`, `description`, `image`, `num_likes`) " \
              "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        event_id = str(round(time.time() * 1000)) + str(random.randint(0, 1000))
        event_data = (event_id, event.user_email, event.address, event.longitude, event.latitude,
                      event.zipcode, event.time.strftime('%Y-%m-%d %H:%M:%S'), event.description, event.image, event.num_likes)
        cursor.execute(sql, event_data)
        cnx.commit()
        cursor.close()
        cnx.close()
        return event_id

    @staticmethod
    def get_all_event_created_by_user(email: str):
        likes = json.loads(Like.get_like_by_user(email))
        liked_events = set(like['event'] for like in likes)

        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE host='" + email + "'")
        cursor.execute(query)
        events = []
        for (event_id, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, address=address, longitude=longitude, latitude=latitude, zipcode=zipcode,
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
        return json.dumps([ob.__dict__ for ob in events], use_decimal=True, default=str)

    @staticmethod
    def get_event_by_id(event_id: str):
        cnx = db_connector.get_connection()
        cursor = cnx.cursor()
        query = ("SELECT * FROM `event` WHERE id='" + event_id + "'")
        cursor.execute(query)
        newEvent = None
        for (event_id, host, address, longitude, latitude, zipcode, time, description, image, num_likes) in cursor:
            newEvent = Event(user=host, address=address, longitude=longitude, latitude=latitude, zipcode=zipcode,
                             time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
            newEvent.id = event_id
            newEvent.description = description
            newEvent.image = image
            newEvent.num_likes = num_likes
            newEvent.liked = Like.exist(host, event_id)
            newEvent.isAttend = True
        cursor.close()
        cnx.close()
        return json.dumps(newEvent.__dict__, use_decimal=True, default=str)






