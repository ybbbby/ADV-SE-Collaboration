import unittest
import sys

sys.path.append("..")

from models.Join import Join
from app import app


class TestJoin(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True


if __name__ == '__main__':
    unittest.main()
