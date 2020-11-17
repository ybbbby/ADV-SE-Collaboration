import unittest
import sys

sys.path.append("..")

from models.Comment import Comment
from app import app


class TestComment(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True


if __name__ == '__main__':
    unittest.main()
