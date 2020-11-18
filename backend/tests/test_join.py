"""
Test methods in join file
"""
import unittest
# import sys
from datetime import datetime
from decimal import Decimal

# sys.path.append("..")

from models.join import Join
from models.user import User
from models.event import Event
from app import app


class TestJoin(unittest.TestCase):
    """
    This is a Test for methods in Join file
    """

    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

        self.user = "test@test.com"
        User.create_user(User(self.user, "test"))

        name = "event1"
        address = "512 W, 110th St, New York"
        time = datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
        longitude = Decimal(12.1111)
        latitude = Decimal(23.2222)
        event = Event(user=self.user, name=name, address=address, zipcode=10025,
                      event_time=time, longitude=longitude, latitude=latitude)
        self.event = Event.create_event(event)

    def tearDown(self) -> None:
        Join.delete_join(Join(self.user, self.event))
        Event.delete_event_by_id(self.event)
        User.delete_user_by_email(self.user)

    def test_create_join(self) -> None:
        """
        test create_join
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))

    def test_get_join_by_user(self) -> None:
        """
        test get_join_by_user
        """
        Join.create_join(Join(self.user, self.event))
        joins = Join.get_join_by_user(self.user)
        events = [join.event for join in joins]
        self.assertListEqual(events, [self.event])

    def test_get_join_by_event(self) -> None:
        """
        test get_join_by_event
        """
        Join.create_join(Join(self.user, self.event))
        joins = Join.get_join_by_event(self.event)
        users = [join.user for join in joins]
        self.assertListEqual(users, [self.user])

    def test_user_is_attend(self) -> None:
        """
        test user_is_attend
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))

    def test_delete_join(self) -> None:
        """
        test delete_join
        """
        Join.create_join(Join(self.user, self.event))
        Join.delete_join(Join(self.user, self.event))
        self.assertFalse(Join.user_is_attend(self.user, self.event))


if __name__ == '__main__':
    unittest.main()
