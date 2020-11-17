import unittest
import sys
from datetime import datetime

sys.path.append("..")
from models.Event import Event
from models.User import User
from models.Comment import Comment
from tests.test_event import create_event
from app import app


class TestComment(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)

    def test_add_comment(self):
        user = "test@test.com"
        content = "this is a comment"
        event = create_event()
        event_id = Event.create_event(event)
        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, comment_time=time, event=event_id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(event_id)
        comment_ids = [c.id for c in comments]
        self.assertIn(comment_id, comment_ids)


if __name__ == '__main__':
    unittest.main()
