import unittest
import sys
from datetime import datetime
from decimal import Decimal

sys.path.append("..")

from models.Like import Like
from models.User import User
from models.Event import Event
from app import app


class TestLike(unittest.TestCase):
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
        Like.delete_like(Like(self.user, self.event))
        Event.delete_event_by_id(self.event)
        User.delete_user_by_email(self.user)

    def test_create_like(self) -> None:
        Like.create_like(Like(self.user, self.event))
        self.assertTrue(Like.exist(self.user, self.event))
    
    def test_get_like_by_user(self) -> None:
        Like.create_like(Like(self.user, self.event))
        likes = Like.get_like_by_user(self.user)
        events = [like.event for like in likes]
        self.assertListEqual(events, [self.event])
    
    def test_get_like_by_event(self) -> None:
        Like.create_like(Like(self.user, self.event))
        likes = Like.get_like_by_event(self.event)
        users = [like.user for like in likes]
        self.assertListEqual(users, [self.user])
    
    def test_exist(self) -> None:
        Like.create_like(Like(self.user, self.event))
        self.assertTrue(Like.exist(self.user, self.event))
    
    def test_delete_like(self) -> None:
        Like.create_like(Like(self.user, self.event))
        Like.delete_like(Like(self.user, self.event))
        self.assertFalse(Like.exist(self.user, self.event))

if __name__ == '__main__':
    unittest.main()
