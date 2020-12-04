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
from tests.test_event import create_event
from app import app
import mysql.connector


class TestJoin(unittest.TestCase):
    """
    This is a Test for methods in Join file
    """

    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

        self.user = "test@test.com"
        User.create_user(User(self.user, "test"))
        self.event = Event.create_event(create_event())

    def tearDown(self) -> None:
        Join.delete_join(Join(self.user, self.event))
        Event.delete_event_by_id(self.event)
        User.delete_user_by_email(self.user)

    def test_create_join_1(self) -> None:
        """
        test create_join: user and event exist
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))

    def test_create_join_2(self) -> None:
        """
        test create_join: user exists, event doesn’t exist
        """
        self.assertRaises(mysql.connector.Error, Join.create_join, Join(self.user, '1'))

    def test_create_join_3(self) -> None:
        """
        test create_join: user doesn’t exist, event exists
        """
        self.assertRaises(mysql.connector.Error, Join.create_join, Join('1', self.event))

    def test_create_join_4(self) -> None:
        """
        test create_join: user and event don’t exist
        """
        self.assertRaises(mysql.connector.Error, Join.create_join, Join('1', '1'))

    def test_get_join_by_user_1(self) -> None:
        """
        test get_join_by_user: user exists
        """
        Join.create_join(Join(self.user, self.event))
        joins = Join.get_join_by_user(self.user)
        events = [join.event for join in joins]
        self.assertListEqual(events, [self.event])

    def test_get_join_by_user_2(self) -> None:
        """
        test get_join_by_user: user doesn't exist
        """
        Join.create_join(Join(self.user, self.event))
        joins = Join.get_join_by_user('')
        events = [join.event for join in joins]
        self.assertListEqual(events, [])

    def test_get_join_by_event_1(self) -> None:
        """
        test get_join_by_event: event exists
        """
        Join.create_join(Join(self.user, self.event))
        joins = Join.get_join_by_event(self.event)
        users = [join.user for join in joins]
        self.assertListEqual(users, [self.user])

    def test_get_join_by_event_2(self) -> None:
        """
        test get_join_by_event: event doesn't exist
        """
        Join.create_join(Join(self.user, self.event))
        joins = Join.get_join_by_event('1')
        users = [join.user for join in joins]
        self.assertListEqual(users, [])

    def test_user_is_attend_1(self) -> None:
        """
        test user_is_attend: user and event exist
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))

    def test_user_is_attend_2(self) -> None:
        """
        test user_is_attend: user exists, event doesn’t exist
        """
        self.assertFalse(Join.user_is_attend(self.user, '1'))

    def test_user_is_attend_3(self) -> None:
        """
        test user_is_attend: user doesn’t exist, event exists
        """
        self.assertFalse(Join.user_is_attend('1', self.event))

    def test_user_is_attend_4(self) -> None:
        """
        test user_is_attend: user and event don’t exist
        """
        self.assertFalse(Join.user_is_attend('1', '1'))

    def test_delete_join_1(self) -> None:
        """
        test delete_join: user and event exist
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))
        Join.delete_join(Join(self.user, self.event))
        self.assertFalse(Join.user_is_attend(self.user, self.event))

    def test_delete_join_2(self) -> None:
        """
        test delete_join: user exists, event doesn’t exist
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))
        Join.delete_join(Join(self.user, '1'))
        self.assertTrue(Join.user_is_attend(self.user, self.event))

    def test_delete_join_3(self) -> None:
        """
        test delete_join: user doesn’t exist, event exists
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))
        Join.delete_join(Join('1', self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))

    def test_delete_join_4(self) -> None:
        """
        test delete_join: user and event don’t exist
        """
        Join.create_join(Join(self.user, self.event))
        self.assertTrue(Join.user_is_attend(self.user, self.event))
        Join.delete_join(Join('1', '1'))
        self.assertTrue(Join.user_is_attend(self.user, self.event))


if __name__ == '__main__':
    unittest.main()
