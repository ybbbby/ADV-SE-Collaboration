import unittest
import sys
sys.path.append("..")

from models.User import User
from app import app

class TestUser(unittest.TestCase):
    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True
        email = "test@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)

    def test_create_user(self):
        email = "test1@test.com"
        user = User(email=email, username="testUser")
        User.create_user(user)
        ret_user = User.get_user_by_email(email)
        self.assertIsNotNone(ret_user)
        self.assertEqual(ret_user.username, "testUser")
        self.assertEqual(ret_user.email, email)

    # if user not exists
    def test_get_user_by_email1(self):
        email = "fake@fake.com"
        user = User.get_user_by_email(email)
        self.assertIsNone(user)

    # if user exists
    def test_get_user_by_email2(self):
        email = "test@test.com"
        user = User.get_user_by_email(email)
        self.assertEqual(user.email, email)

    def test_get_attendees_by_event(self):
        user = "test@test.com"
        id = "1605585527774605"
        Join.create_join(Join(user, id))
        users = User.get_attendees_by_event(id)
        self.assertEqual(users[0].email, user)


if __name__ == '__main__':
    unittest.main()
