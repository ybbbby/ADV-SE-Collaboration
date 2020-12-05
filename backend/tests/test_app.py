import pytest
from app import app
import json


@pytest.fixture
def client():
    """
    Get a Flask app test client for each test
    :return: Flask app client
    """
    yield app.test_client()


class Test(object):

    def test_4(self, client):
        """
        index -> login -> userinfo -> create_event (past) -> get_all_history_event_by_user -> get_attendees_by_event
        -> leave event -> get_attendees_by_event -> join_event -> get_attendees_by_event -> delete_event
        """

        response = client.get('/')
        assert response.status_code == 200

        response = client.get('/google/login')
        assert response.status_code == 200

        response = client.get('/google/auth')
        assert response.status_code == 302

        response = client.get('/user/info')
        assert response.status_code == 200
        assert json.loads(response.data) == {'email': 'test@test.com', 'name': 'test'}

        response = client.post('/event', data={
            "Event_name": "event",
            "Address": "512 W, 110th St, New York",
            "Longitude": "12.1111",
            "Latitude": "23.2222",
            "Time": "2020-10-12 12:12:12",
            "Description": "",
            "Image": "",
            "Category": ""
        })
        assert response.status_code == 200
        event_id = str(json.loads(response.data))

        response = client.get('/events/history')
        events = json.loads(response.data)
        assert [event['event_id'] for event in events] == [event_id]

        response = client.get('/event/%s/attendees' % event_id)
        users = json.loads(response.data)
        assert [user['email'] for user in users] == ['test@test.com']

        response = client.post('/user/event/%s/join' % event_id)
        assert response.status_code == 200

        response = client.get('/event/%s/attendees' % event_id)
        users = json.loads(response.data)
        assert len(users) == 0

        response = client.post('/user/event/%s/join' % event_id)
        assert response.status_code == 200

        response = client.get('/event/%s/attendees' % event_id)
        users = json.loads(response.data)
        assert [user['email'] for user in users] == ['test@test.com']

        response = client.delete('/event/%s' % event_id)
        assert response.status_code == 200

    def test_5(self, client):
        """
        index -> login -> userinfo -> create_event -> get_all_ongoing_event_by_user -> leave event
        -> get_all_ongoing_event_by_user -> join_event -> get_all_ongoing_event_by_user -> delete event
        """
        response = client.get('/')
        assert response.status_code == 200

        response = client.get('/google/login')
        assert response.status_code == 200

        response = client.get('/google/auth')
        assert response.status_code == 302

        response = client.get('/user/info')
        assert response.status_code == 200
        assert json.loads(response.data) == {'email': 'test@test.com', 'name': 'test'}

        response = client.post('/event', data={
            "Event_name": "event2",
            "Address": "512 W, 110th St, New York",
            "Longitude": "12.1111",
            "Latitude": "23.2222",
            "Time": "2021-12-12 12:12:12",
            "Description": "",
            "Image": "",
            "Category": ""
        })
        assert response.status_code == 200
        event_id = str(json.loads(response.data))

        response = client.get('/events/ongoing')
        events = json.loads(response.data)
        assert [event['event_id'] for event in events] == [event_id]

        response = client.post('/user/event/%s/join' % event_id)
        assert response.status_code == 200

        response = client.get('/events/ongoing')
        events = json.loads(response.data)
        assert len(events) == 0

        response = client.post('/user/event/%s/join' % event_id)
        assert response.status_code == 200

        response = client.get('/events/ongoing')
        events = json.loads(response.data)
        assert [event['event_id'] for event in events] == [event_id]

        response = client.delete('/event/%s' % event_id)
        assert response.status_code == 200

    def test_6(self, client):
        """
        index -> login -> userinfo -> create_event -> like_event -> get_all_event_liked_by_user
        -> unlike event -> get_all_event_liked_by_user -> like_event -> get_all_event_liked_by_user -> delete_event
        """
        response = client.get('/')
        assert response.status_code == 200

        response = client.get('/google/login')
        assert response.status_code == 200

        response = client.get('/google/auth')
        assert response.status_code == 302

        response = client.get('/user/info')
        assert response.status_code == 200
        assert json.loads(response.data) == {'email': 'test@test.com', 'name': 'test'}

        response = client.post('/event', data={
            "Event_name": "event2",
            "Address": "512 W, 110th St, New York",
            "Longitude": "12.1111",
            "Latitude": "23.2222",
            "Time": "2021-12-12 12:12:12",
            "Description": "",
            "Image": "",
            "Category": ""
        })
        assert response.status_code == 200
        event_id = str(json.loads(response.data))

        response = client.get('/events/liked')
        events = json.loads(response.data)
        assert len(events) == 0

        response = client.post('/user/event/%s/like' % event_id)
        assert response.status_code == 200

        response = client.get('/events/liked')
        events = json.loads(response.data)
        assert [event['event_id'] for event in events] == [event_id]

        response = client.post('/user/event/%s/like' % event_id)
        assert response.status_code == 200

        response = client.get('/events/liked')
        events = json.loads(response.data)
        assert len(events) == 0

        response = client.delete('/event/%s' % event_id)
        assert response.status_code == 200