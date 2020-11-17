import unittest
import sys
from datetime import datetime
from decimal import Decimal

from models.User import User

sys.path.append("..")

from models.Event import Event
from app import app


def create_event():
    user = "test@test.com"
    name = "event1"
    address = "512 W, 110th St, New York"
    time = datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
    longitude = Decimal(12.1111)
    latitude = Decimal(23.2222)
    event = Event(user=user,
                  name=name,
                  address=address,
                  zipcode=10025,
                  event_time=time,
                  longitude=longitude,
                  latitude=latitude)
    return event


class TestEvent(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)
        self.event = create_event()
        self.event_id = Event.create_event(self.event)

    def tearDown(self) -> None:
        Event.delete_event_by_id(self.event_id)
        User.delete_user_by_email("test@test.com")

    def test_create_event(self):
        event = self.event
        event_id = self.event_id
        retEvent = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(retEvent.id, event_id)
        self.assertEqual(retEvent.user_email, event.user_email)
        self.assertEqual(retEvent.name, event.name)
        self.assertEqual(retEvent.address,event.address)
        self.assertEqual(retEvent.time, event.time)
        self.assertAlmostEqual(retEvent.longitude, event.longitude)
        self.assertAlmostEqual(retEvent.latitude, event.latitude)

    def test_delete_event(self):
        event = self.event
        event_id = self.event_id

        Event.delete_event_by_id(event_id)
        event = Event.get_event_by_id(event_id, event.user_email)
        self.assertIsNone(event)

    # update description
    def test_update_event1(self):
        event = self.event
        event_id = self.event_id
        description = "new desc"
        Event.update_event({"description": description}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.description, description)

    # update time
    def test_update_event2(self):
        event = self.event
        event_id = self.event_id
        time = datetime.strptime("2022-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
        Event.update_event({"time": time}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.time, time)

    # update address, longitude, latitude
    def test_update_event3(self):
        event = self.event
        event_id = self.event_id
        address = "412 E, 110th St, New york"
        longitude = Decimal(22.1111)
        latitude = Decimal(33.2222)
        Event.update_event({"address": address,
                            "longitude": longitude,
                            "latitude": latitude}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.address, address)
        self.assertAlmostEqual(ret.longitude, longitude)
        self.assertAlmostEqual(ret.latitude, latitude)

    # get event not exists
    def test_get_event_id1(self):
        id = "0"
        e = Event.get_event_by_id(id)
        self.assertIsNone(e)

    # get event exists
    def test_get_event_id2(self):
        event = self.event
        event_id = self.event_id
        e = Event.get_event_by_id(event_id)
        self.assertEqual(e.id, event_id)


if __name__ == '__main__':
    unittest.main()
