import unittest
import sys
from datetime import datetime

sys.path.append("..")

from models.Event import Event
from app import app


class TestEvent(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

    def test_create_event(self):
        event = Event(user="test@test.com",
                      name="event1",
                      address="512 W, 110th St, New York",
                      zipcode=10025,
                      time=datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S"),
                      longitude=12.1111,
                      latitude=23.2222)
        Event.create_event(event)


if __name__ == '__main__':
    unittest.main()
