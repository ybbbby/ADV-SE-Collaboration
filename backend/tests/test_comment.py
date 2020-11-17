import unittest
# import sys
from datetime import datetime

# sys.path.append("..")
from models.Event import Event
from models.User import User
from models.Comment import Comment
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

    def test_add_comment(self):
        """
        Test create_comment
        """
        user = "test@test.com"
        content = "this is a comment"
        event_id = self.event_id
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(event_id)
        self.assertEqual(len(comments), 1)
        self.assertIn(comment_id, comments[0].id)
        Comment.delete_comment(comment_id)

    def test_get_comment_by_event(self):
        """
        Test get_comment_by_event
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

    def test_delete_comment(self):
        """
        Test delete_comment
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


if __name__ == '__main__':
    unittest.main()
