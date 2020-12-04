"""
Test methods in event file
"""
import unittest
# import sys
from datetime import datetime
from decimal import Decimal

from models.user import User
from models.like import Like
from models.join import Join

# sys.path.append("..")

from models.event import Event
from app import app


def create_event():
    """
    Create event helper function
    :return: An event object
    """
    user = "test@test.com"
    name = "event1"
    address = "512 W, 110th St, New York"
    time = datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
    longitude = Decimal(12.1111)
    latitude = Decimal(23.2222)
    event = Event(user=user,
                  name=name,
                  address=address,
                  zipcode=10025,
                  event_time=time,
                  longitude=longitude,
                  latitude=latitude)
    event.category = "test"
    return event


class TestEvent(unittest.TestCase):
    """
    Test Event file
    """

    def setUp(self) -> None:
        self.app = app
        self.app.config['TESTING'] = True

        self.useremail = "test@test.com"
        self.username = "testUser"
        self.user = User(email=self.useremail, username=self.username)
        User.create_user(self.user)
        self.event = create_event()
        self.event_ids = []

        #Only for getNearByTest
        self.user2 = User(email="test@test2", username="testUser2")
        User.create_user(self.user2)

    def tearDown(self) -> None:
        for eventid in self.event_ids:
            Event.delete_event_by_id(eventid)
        User.delete_user_by_email(self.useremail)
        User.delete_user_by_email(self.user2.email)

    def test_create_event(self):
        """
        Test create_event
        """
        event = create_event()
        event_id = Event.create_event(event)
        self.event_ids.append(event_id)
        ret_event = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret_event.event_id, event_id)
        self.assertEqual(ret_event.user_email, event.user_email)
        self.assertEqual(ret_event.name, event.name)
        self.assertEqual(ret_event.address, event.address)
        self.assertEqual(ret_event.time, event.time)
        self.assertAlmostEqual(ret_event.longitude, event.longitude)
        self.assertAlmostEqual(ret_event.latitude, event.latitude)

    def test_delete_event(self):
        """
        Test delete_event
        """
        event = create_event()
        event_id = Event.create_event(event)
        self.event_ids.append(event_id)
        Event.delete_event_by_id(event_id)
        event = Event.get_event_by_id(event_id, event.user_email)
        self.assertIsNone(event)

    # update description
    def test_update_event1(self):
        """
        Test update_event
        """
        event = create_event()
        event_id = Event.create_event(event)
        self.event_ids.append(event_id)
        description = "new desc"
        Event.update_event({"description": description}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.description, description)

    # update time
    def test_update_event2(self):
        """
        Test update_event
        """
        event = create_event()
        event_id = Event.create_event(event)
        self.event_ids.append(event_id)
        time = datetime.strptime("2022-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
        Event.update_event({"time": time}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.time, time)

    # update address, longitude, latitude
    def test_update_event3(self):
        """
        Test update_event
        """
        event = create_event()
        event_id = Event.create_event(event)
        self.event_ids.append(event_id)
        address = "412 E, 110th St, New york"
        longitude = Decimal(22.1111)
        latitude = Decimal(33.2222)
        Event.update_event({"address": address,
                            "longitude": longitude,
                            "latitude": latitude}, event_id)
        ret = Event.get_event_by_id(event_id, event.user_email)
        self.assertEqual(ret.address, address)
        self.assertAlmostEqual(ret.longitude, longitude)
        self.assertAlmostEqual(ret.latitude, latitude)

    # get event not exists
    def test_get_event_id1(self):
        """
        Test get_event_id
        Test case1: event id does not exist
        """
        event_id = "0"
        event = Event.get_event_by_id(event_id)
        self.assertIsNone(event)

    # get event exists
    def test_get_event_id2(self):
        """
        Test get_event_id
        """
        event = create_event()
        event_id = Event.create_event(event)
        self.event_ids.append(event_id)
        event = Event.get_event_by_id(event_id)
        self.assertEqual(event.event_id, event_id)

    def test_get_all_event_created_by_user1(self):
        """
        Test get_all_event_created_by_user
        Case1: user has created some events
        """

        latitude = 40.730610
        longitude = -73.935242
        for i in range(10):
            time = datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i),
                             address="address" + str(i),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude + i,
                             latitude=latitude + i)
            tmp_event.category = "test"
            self.event_ids.append(Event.create_event(tmp_event))
        result = Event.get_all_event_created_by_user(self.useremail)
        for res in result:
            self.assertTrue(res.event_id in self.event_ids)
        self.assertEqual(10, len(result))

    def test_get_all_event_created_by_user2(self):
        """
        Test get_all_event_created_by_user
        Case1: user has not created some events
        """
        result = Event.get_all_event_created_by_user(self.useremail)
        self.assertEqual(len(result), 0)

    def test_get_all_event_liked_by_user1(self):
        """
        Test get_all_event_liked_by_user
        Case2: user has liked some events
        """

        latitude = 40.730610
        longitude = -73.935242
        for i in range(10):
            time = datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i),
                             address="address" + str(i),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude + i,
                             latitude=latitude + i)
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)
            like = Like(self.useremail, tmp_event_id)
            Like.create_like(like)
        result = Event.get_all_event_liked_by_user(self.useremail)
        for res in result:
            self.assertTrue(res.event_id in self.event_ids)
        self.assertEqual(10, len(result))

    def test_get_all_event_liked_by_user2(self):
        """
        Test get_all_event_liked_by_user
        Case2: user has not liked any events
        """
        result = Event.get_all_event_liked_by_user(self.useremail)
        self.assertEqual(len(result), 0)

    def test_get_all_history_event_by_user(self):
        """
        Test get_all_history_event_by_user
        Case1: user has history events
        """
        latitude = 40.730610
        longitude = -73.935242
        for i in range(5):
            latitude += 0.01
            longitude += 0.01
            time = datetime.strptime("2019-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i),
                             address="address" + str(i),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude + i,
                             latitude=latitude)
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

            join = Join(self.useremail, tmp_event_id)
            Join.create_join(join)
        for i in range(5):
            latitude += 0.01
            longitude += 0.01
            time = datetime.strptime("2023-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i + 5),
                             address="address" + str(i + 5),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude + i,
                             latitude=latitude)
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

            join = Join(self.useremail, tmp_event_id)
            Join.create_join(join)

        result = Event.get_all_history_event_by_user(self.useremail)
        for res in result:
            self.assertTrue(res.event_id in self.event_ids)
        self.assertEqual(5, len(result))


    def test_get_all_event_liked_by_user2(self):
        """
        Test get_all_history_event_by_user
        Case2: user has no history events
        """
        result = Event.get_all_event_liked_by_user(self.useremail)
        self.assertEqual(len(result), 0)

    def test_get_all_event_joined_by_user1(self):
        """
        Test get_all_ongoing_event_by_user
        Case1: user has joined some events
        """
        latitude = 40.730610
        longitude = -73.935242
        for i in range(5):
            latitude += 0.01
            longitude += 0.01
            time = datetime.strptime("2020-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                              name="testevent" + str(i),
                              address="address" + str(i),
                              zipcode=10025,
                              event_time=time,
                              longitude=longitude,
                              latitude=latitude)
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

            join = Join(self.useremail, tmp_event_id)
            Join.create_join(join)
            if i % 2 == 0:
                like = Like(self.useremail, tmp_event_id)
                Like.create_like(like)

        result = Event.get_all_event_joined_by_user(self.useremail)
        for res in result:
            self.assertTrue(res.event_id in self.event_ids)
        self.assertEqual(5, len(result))

    def test_get_all_event_joined_by_user2(self):
        """
        Test get_all_ongoing_event_by_user
        Case2: user has never joined some events
        """
        result = Event.get_all_event_joined_by_user(self.useremail)
        self.assertEqual(len(result), 0)

    def test_get_all_ongoing_event_by_user1(self):
        """
        Test get_all_ongoing_event_by_user
        Case1: user has some ongoing events
        """
        latitude = 40.730610
        longitude = -73.935242
        for i in range(5):
            latitude += 0.01
            longitude += 0.01
            time = datetime.strptime("2019-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i),
                             address="address" + str(i),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude,
                             latitude=latitude)
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

            join = Join(self.useremail, tmp_event_id)
            Join.create_join(join)
        for i in range(5):
            latitude += 0.01
            longitude += 0.01
            time = datetime.strptime("2023-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i + 5),
                             address="address" + str(i + 5),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude,
                             latitude=latitude)
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

            join = Join(self.useremail, tmp_event_id)
            Join.create_join(join)

        result = Event.get_all_ongoing_event_by_user(self.useremail)
        for res in result:
            self.assertTrue(res.event_id in self.event_ids)
        self.assertEqual(5, len(result))

    def test_get_all_ongoing_event_by_user2(self):
        """
        Test get_all_ongoing_event_by_user
        Case2: user has no ongoing events
        """
        result = Event.get_all_ongoing_event_by_user(self.useremail)
        self.assertEqual(len(result), 0)

    def test_get_nearby_events1(self):
        """
        Test get_nearby_events
        Test case1: if user email is provided
        """

        latitude = 40.730610
        longitude = -73.935242
        dif = 0.001
        user2 = User("test2@test.com", "test2")
        User.create_user(user2)
        for i in range(5):
            time = datetime.strptime("2023-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i),
                             address="address" + str(i),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude + dif,
                             latitude=latitude + dif)
            if i % 2 == 0:
                tmp_event.user_email = user2.email
            dif *= 10
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

        result = Event.get_nearby_events(self.useremail, latitude, longitude)
        self.assertEqual(5, len(result))
        for i in range(len(result)):
            self.assertEqual(result[i].event_id, self.event_ids[i])

    def test_get_nearby_events2(self):
        """
        Test get_nearby_events
        Test case2: if no user email is provided
        """

        latitude = 40.730610
        longitude = -73.935242
        dif = 0.001
        user2 = User("test2@test.com", "test2")
        User.create_user(user2)
        for i in range(5):
            time = datetime.strptime("2023-12-12 12:12:12", "%Y-%m-%d %H:%M:%S")
            tmp_event = Event(user=self.useremail,
                             name="testevent" + str(i),
                             address="address" + str(i),
                             zipcode=10025,
                             event_time=time,
                             longitude=longitude + dif,
                             latitude=latitude + dif)
            if i % 2 == 0:
                tmp_event.user_email = user2.email
            dif *= 10
            tmp_event.category = "test"
            tmp_event_id = Event.create_event(tmp_event)
            self.event_ids.append(tmp_event_id)

        result = Event.get_nearby_events(None, latitude, longitude)
        self.assertEqual(5, len(result))
        for i in range(len(result)):
            self.assertEqual(result[i].event_id, self.event_ids[i])
if __name__ == '__main__':
    unittest.main()
