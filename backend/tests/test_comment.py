"""
Test methods in comment file
"""
import unittest
# import sys
from datetime import datetime

# sys.path.append("..")
import mysql.connector
from models.event import Event
from models.user import User
from models.comment import Comment
from tests.test_event import create_event
from app import app


class TestComment(unittest.TestCase):
    """
    Test Comment file
    """
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)
        event = create_event()
        self.event_id = Event.create_event(event)

    def tearDown(self) -> None:
        Event.delete_event_by_id(self.event_id)
        User.delete_user_by_email("test@test.com")

    def test_add_comment_1(self):
        """
        Test create_comment: user and event exists, comment length good
        """
        user = "test@test.com"
        content = "this is a comment"
        event_id = self.event_id
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 1)
        self.assertIn(comment_id, comments[0].comment_id)
        Comment.delete_comment(comment_id)

    def test_add_comment_2(self):
        """
        Test create_comment: user and event exists, comment length too long
        """
        user = "test@test.com"
        content = "0123456789" * 31
        event_id = self.event_id
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        self.assertRaises(mysql.connector.Error, Comment.create_comment, comment)

    def test_add_comment_3(self):
        """
        Test create_comment: user doesn’t exist
        """
        user = "test1@test.com"
        content = "this is a comment"
        event_id = self.event_id
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        self.assertRaises(mysql.connector.Error, Comment.create_comment, comment)

    def test_add_comment_4(self):
        """
        Test create_comment: event doesn’t exist
        """
        user = "test1@test.com"
        content = "this is a comment"
        event_id = '1'
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        self.assertRaises(mysql.connector.Error, Comment.create_comment, comment)

    def test_get_comment_by_event_1(self):
        """
        Test get_comment_by_event: event exists
        """
        user = "test@test.com"
        event_id = self.event_id
        content = "this is a comment"
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 1)
        self.assertEqual(comments[0].user, "test@test.com")
        self.assertEqual(comments[0].event, event_id)
        self.assertEqual(comments[0].content, "this is a comment")
        Comment.delete_comment(comment_id)

    def test_get_comment_by_event_2(self):
        """
        Test get_comment_by_event: event doesn't exist
        """
        user = "test@test.com"
        event_id = '1'
        content = "this is a comment"
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        self.assertRaises(mysql.connector.Error, Comment.create_comment, comment)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 0)

    def test_delete_comment_1(self):
        """
        Test delete_comment: comment exists
        """
        user = "test@test.com"
        event_id = self.event_id
        content = "this is a comment"
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 1)
        Comment.delete_comment(comment_id)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 0)

    def test_delete_comment_2(self):
        """
        Test delete_comment: comment doesn't exist
        """
        user = "test@test.com"
        event_id = self.event_id
        content = "this is a comment"
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 1)

        Comment.delete_comment('1')
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 1)

        Comment.delete_comment(comment_id)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 0)


if __name__ == '__main__':
    unittest.main()
