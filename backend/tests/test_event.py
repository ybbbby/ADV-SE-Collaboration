import unittest
import sys
from datetime import datetime
from decimal import Decimal

sys.path.append("..")

from models.Event import Event
from app import app


class TestEvent(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

    def test_create_event(self):
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
                      time=time,
                      longitude=longitude,
                      latitude=latitude)
        id = Event.create_event(event)
        retEvent = Event.get_event_by_id(id, "test@test.com")
        self.assertEqual(retEvent.id, id)
        self.assertEqual(retEvent.user_email, user)
        self.assertEqual(retEvent.name, name)
        self.assertEqual(retEvent.address, address)
        self.assertEqual(retEvent.time, time)
        self.assertAlmostEqual(retEvent.longitude, longitude)
        self.assertAlmostEqual(retEvent.latitude, latitude)

    def test_delete_event(self):
        id = "1605585013150940"
        user = "test@test.com"
        Event.delete_event_by_id(id)
        event = Event.get_event_by_id(id, user)
        self.assertIsNone(event)

    # update description
    def test_update_event1(self):
        id = "1605585527774605"
        user = "test@test.com"
        description = "new desc"
        Event.update_event({"description": description}, id)
        ret = Event.get_event_by_id(id, user)
        self.assertEqual(ret.description, description)

    # update time
    def test_update_event2(self):
        id = "1605585527774605"
        user = "test@test.com"
        time = datetime.strptime("2022-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
        Event.update_event({"time": time}, id)
        ret = Event.get_event_by_id(id, user)
        self.assertEqual(ret.time, time)

    # update address, longitude, latitude
    def test_update_event3(self):
        id = "1605585527774605"
        user = "test@test.com"
        address = "412 E, 110th St, New york"
        longitude = Decimal(22.1111)
        latitude = Decimal(33.2222)
        Event.update_event({"address": address,
                            "longitude": longitude,
                            "latitude": latitude}, id)
        ret = Event.get_event_by_id(id, user)
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
        id = "1605585527774605"
        e = Event.get_event_by_id(id)
        self.assertEqual(e.id, id)


if __name__ == '__main__':
    unittest.main()
