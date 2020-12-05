"""
Test methods in user file
"""
# import sys
import unittest
from datetime import datetime
from decimal import Decimal

# sys.path.append("..")
from app import app
from models.event import Event
from models.user import User
from models.join import Join


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


class TestUser(unittest.TestCase):
    """
    This is a Test for methods in User file
    """

    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)

    def tearDown(self) -> None:
        User.delete_user_by_email("test@test.com")

    def test_create_user_1(self):
        """
        Test function create_user
        """
        email = "test1@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)
        ret_user = User.get_user_by_email(email)
        self.assertIsNotNone(ret_user)
        self.assertEqual(ret_user.username, "testUser")
        self.assertEqual(ret_user.email, email)
        User.delete_user_by_email("test1@test.com")

    def test_create_user_2(self):
        """
        Test function create_user
        username too long
        """
        email = "test1@test.com"
        username = "usernameistoolong" * 10
        user = User(email=email, username=username)
        User.create_user(user)
        ret_user = User.get_user_by_email(email)
        self.assertIsNotNone(ret_user)
        self.assertEqual(ret_user.email, email)
        User.delete_user_by_email("test1@test.com")

    def test_get_user_by_email_1(self):
        """
        Test function get_user_by_email
        if user not exists
        """
        email = "fake@fake.com"
        user = User.get_user_by_email(email)
        self.assertIsNone(user)

    def test_get_user_by_email_2(self):
        """
        Test function get_user_by_email
        if user exists
        """
        email = "test@test.com"
        user = User.get_user_by_email(email)
        self.assertEqual(user.email, email)

    def test_get_attendees_by_event_1(self):
        """
        Test function get_attendees_by_event
        Event exist
        """
        user = "test@test.com"
        event = create_event()
        event.category = "test"
        event_id = Event.create_event(event)
        Join.create_join(Join(user, event_id))
        users = User.get_attendees_by_event(event_id)
        self.assertEqual(users[0].email, user)
        Join.delete_join(Join(user, event_id))
        Event.delete_event_by_id(event_id)

    def test_get_attendees_by_event_2(self):
        """
        Test function get_attendees_by_event
        Event not exist
        """
        users = User.get_attendees_by_event("0")
        self.assertEqual(0, len(users))

    def test_delete_user_1(self):
        """
        Test function delete_user
        user exist
        """
        email = "test@test.com"
        user = User.get_user_by_email(email)
        self.assertEqual(user.email, email)
        User.delete_user_by_email(email)
        user = User.get_user_by_email(email)
        self.assertIsNone(user)

    def test_delete_user_2(self):
        """
        Test function delete_user
        user not exist
        """
        email = "fakeuser@test.com"
        User.delete_user_by_email(email)
        user = User.get_user_by_email(email)
        self.assertIsNone(user)


if __name__ == '__main__':
    unittest.main()
