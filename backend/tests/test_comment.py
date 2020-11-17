import unittest
import sys
from datetime import datetime, date

sys.path.append("..")

from models.Comment import Comment
from app import app


class TestComment(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

    def test_add_comment(self):
        user = "test@test.com"
        content = "this is a comment"
        id = "1605585527774605"

        time = datetime.strptime("2020-01-01 12:12:30", "%Y-%m-%d %H:%M:%S")
        comment = Comment(user=user, content=content, time=time, event=id)
        comment_id = Comment.create_comment(comment)
        comments = Comment.get_comment_by_event(id)
        comment_ids = [c.id for c in comments]
        self.assertIn(comment_id, comment_ids)


if __name__ == '__main__':
    unittest.main()
