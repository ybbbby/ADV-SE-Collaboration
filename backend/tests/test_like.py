import unittest
import sys

sys.path.append("..")

from models.Like import Like
from app import app


class TestLike(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True


if __name__ == '__main__':
    unittest.main()
