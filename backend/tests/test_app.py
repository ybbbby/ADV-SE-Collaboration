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
    """
    index -> login -> userinfo -> create_event (past) -> join_event
    -> get_all_history_event_by_user -> get_attendees_by_event
    """
    def test_3(self, client):
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

        event_id = json.loads(response.data)


