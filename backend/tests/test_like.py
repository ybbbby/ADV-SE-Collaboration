"""
Test methods in like file
"""
import unittest
# import sys

# sys.path.append("..")

import mysql.connector
from models.like import Like
from models.user import User
from models.event import Event
from tests.test_event import create_event
from app import app
import mysql.connector


class TestLike(unittest.TestCase):
    """
    This is a Test for methods in Like file
    """

    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

        self.user = "test@test.com"
        User.create_user(User(self.user, "test"))
        self.event = Event.create_event(create_event())

    def tearDown(self) -> None:
        Like.delete_like(Like(self.user, self.event))
        Event.delete_event_by_id(self.event)
        User.delete_user_by_email(self.user)

    def test_create_like_1(self) -> None:
        """
        Test create_like: user and event exist
        """
        Like.create_like(Like(self.user, self.event))
        self.assertTrue(Like.exist(self.user, self.event))

    def test_create_like_2(self) -> None:
        """
        Test create_like: user exists, event doesn’t exist
        """
        self.assertRaises(mysql.connector.Error, Like.create_like, Like(self.user, '1'))

    def test_create_like_3(self) -> None:
        """
        Test create_like: user doesn’t exist, event exists
        """
        self.assertRaises(mysql.connector.Error, Like.create_like, Like('1', self.event))

    def test_create_like_4(self) -> None:
        """
        Test create_like: user and event don’t exist
        """
        self.assertRaises(mysql.connector.Error, Like.create_like, Like('1', '1'))

    def test_get_like_by_user_1(self) -> None:
        """
        Test get_like_by_user: user exists
        """
        Like.create_like(Like(self.user, self.event))
        likes = Like.get_like_by_user(self.user)
        events = [like.event for like in likes]
        self.assertListEqual(events, [self.event])

    def test_get_like_by_user_2(self) -> None:
        """
        Test get_like_by_user: user doesn’t exist
        """
        Like.create_like(Like(self.user, self.event))
        likes = Like.get_like_by_user('1')
        events = [like.event for like in likes]
        self.assertListEqual(events, [])

    def test_get_like_by_event_1(self) -> None:
        """
        Test get_like_by_event: event exists
        """
        Like.create_like(Like(self.user, self.event))
        likes = Like.get_like_by_event(self.event)
        users = [like.user for like in likes]
        self.assertListEqual(users, [self.user])

    def test_get_like_by_event_2(self) -> None:
        """
        Test get_like_by_event: event doesn’t exist
        """
        Like.create_like(Like(self.user, self.event))
        likes = Like.get_like_by_event('1')
        users = [like.user for like in likes]
        self.assertListEqual(users, [])

    def test_exist_1(self) -> None:
        """
        Test exist: user and event exist
        """
        Like.create_like(Like(self.user, self.event))
        self.assertTrue(Like.exist(self.user, self.event))

    def test_exist_2(self) -> None:
        """
        Test exist: user exists, event doesn’t exist
        """
        Like.create_like(Like(self.user, self.event))
        self.assertFalse(Like.exist(self.user, '1'))

    def test_exist_3(self) -> None:
        """
        Test exist: user doesn’t exist, event exists
        """
        Like.create_like(Like(self.user, self.event))
        self.assertFalse(Like.exist('1', self.event))

    def test_exist_4(self) -> None:
        """
        Test exist: user and event don’t exist
        """
        Like.create_like(Like(self.user, self.event))
        self.assertFalse(Like.exist('1', '1'))

    def test_delete_like_1(self) -> None:
        """
        test delete_like: user and event exist
        """
        Like.create_like(Like(self.user, self.event))
        Like.delete_like(Like(self.user, self.event))
        self.assertFalse(Like.exist(self.user, self.event))

    def test_delete_like_2(self) -> None:
        """
        test delete_like: user exists, event doesn’t exist
        """
        Like.create_like(Like(self.user, self.event))
        Like.delete_like(Like(self.user, '1'))
        self.assertTrue(Like.exist(self.user, self.event))

    def test_delete_like_3(self) -> None:
        """
        test delete_like: user doesn’t exist, event exists
        """
        Like.create_like(Like(self.user, self.event))
        Like.delete_like(Like('1', self.event))
        self.assertTrue(Like.exist(self.user, self.event))

    def test_delete_like_4(self) -> None:
        """
        test delete_like: user and event don’t exist
        """
        Like.create_like(Like(self.user, self.event))
        Like.delete_like(Like('1', '1'))
        self.assertTrue(Like.exist(self.user, self.event))


if __name__ == '__main__':
    unittest.main()
