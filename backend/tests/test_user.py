import unittest
import sys
sys.path.append("..")

from models.User import User
from app import app

class TestUser(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

    def test_add_user(self):
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)
        retUser = User.get_user_by_email(email)
        self.assertIsNotNone(retUser)


if __name__ == '__main__':
    unittest.main()
