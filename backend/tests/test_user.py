import unittest
import sys
from datetime import datetime
from decimal import Decimal
sys.path.append("..")

from models.User import User
from models.Event import Event
from models.Join import Join
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

class TestUser(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)

    def tearDown(self) -> None:
        User.delete_user_by_email("test@test.com")
        
    def test_create_user(self):
        email = "test1@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)
        ret_user = User.get_user_by_email(email)
        self.assertIsNotNone(ret_user)
        self.assertEqual(ret_user.username, "testUser")
        self.assertEqual(ret_user.email, email)
        User.delete_user_by_email("test1@test.com")

    # if user not exists
    def test_get_user_by_email1(self):
        email = "fake@fake.com"
        user = User.get_user_by_email(email)
        self.assertIsNone(user)

    # if user exists
    def test_get_user_by_email2(self):
        email = "test@test.com"
        user = User.get_user_by_email(email)
        self.assertEqual(user.email, email)

    def test_get_attendees_by_event(self):
        user = "test@test.com"
        id = Event.create_event(create_event())
        Join.create_join(Join(user, id))
        users = User.get_attendees_by_event(id)
        self.assertEqual(users[0].email, user)
        Join.delete_join(Join(user, id))
        Event.delete_event_by_id(id)

    def test_delete_user(self):
        email = "test@test.com"
        user = User.get_user_by_email(email)
        self.assertEqual(user.email, email)
        User.delete_user_by_email(email)
        user = User.get_user_by_email(email)
        self.assertIsNone(user)

if __name__ == '__main__':
    unittest.main()
