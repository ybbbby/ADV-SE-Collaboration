"""
Test methods in event file
"""
import unittest
# import sys
from datetime import datetime
from decimal import Decimal

from models.user import User

# sys.path.append("..")

from models.event import Event
from app import app


def create_event():
    """
    Create event helper function
    :return: An event object
    """
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
    """
    Test Event file
    """
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
        """
        Test create_event
        """
        event = self.event
        event_id = self.event_id
        ret_event = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret_event.event_id, event_id)
        self.assertEqual(ret_event.user_email, event.user_email)
        self.assertEqual(ret_event.name, event.name)
        self.assertEqual(ret_event.address,event.address)
        self.assertEqual(ret_event.time, event.time)
        self.assertAlmostEqual(ret_event.longitude, event.longitude)
        self.assertAlmostEqual(ret_event.latitude, event.latitude)

    def test_delete_event(self):
        """
        Test delete_event
        """
        event = self.event
        event_id = self.event_id

        Event.delete_event_by_id(event_id)
        event = Event.get_event_by_id(event_id, event.user_email)
        self.assertIsNone(event)

    # update description
    def test_update_event1(self):
        """
        Test update_event
        """
        event = self.event
        event_id = self.event_id
        description = "new desc"
        Event.update_event({"description": description}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.description, description)

    # update time
    def test_update_event2(self):
        """
        Test update_event
        """
        event = self.event
        event_id = self.event_id
        time = datetime.strptime("2022-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
        Event.update_event({"time": time}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.time, time)

    # update address, longitude, latitude
    def test_update_event3(self):
        """
        Test update_event
        """
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
        """
        Test get_event_id
        """
        event_id = "0"
        event = Event.get_event_by_id(event_id)
        self.assertIsNone(event)

    # get event exists
    def test_get_event_id2(self):
        """
        Test get_event_id
        """
        event_id = self.event_id
        event = Event.get_event_by_id(event_id)
        self.assertEqual(event.event_id, event_id)


if __name__ == '__main__':
    unittest.main()
