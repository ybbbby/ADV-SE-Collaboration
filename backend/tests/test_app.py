"""
Test methods in app file
"""
import json
import pytest
from app import app


@pytest.fixture
def client():
    """
    Get a Flask app test client for each test
    :return: Flask app client
    """
    yield app.test_client()


class Test:
    """
    Test App file
    """
    @staticmethod
    def test_login(client):
        """
        test index, login and userinfo
        """
        response = client.get('/user/info')
        assert response.status_code == 200
        assert json.loads(response.data) == "NOUSER"

        response = client.get('/')
        assert response.status_code == 200

        response = client.get('/google/login')
        assert response.status_code == 200

        response = client.get('/google/auth')
        assert response.status_code == 302

        response = client.get('/user/info')
        assert response.status_code == 200
        assert json.loads(response.data) == {'email': 'test@test.com', 'name': 'test'}

    def test_1(self, client):
        """
        index -> login -> userinfo -> create_event -> get_event
        -> update_event -> get_event -> delete_event -> get_event

        """
        self.test_login(client)
        # create event
        response = client.post('/event', data={
            "Event_name": "event",
            "Address": "512 W, 110th St, New York",
            "Longitude": "12.1111",
            "Latitude": "23.2222",
            "Time": "2021-10-12 12:12:12",
            "Description": "",
            "Image": "",
            "Category": ""
        })
        event_id = str(json.loads(response.data))
        assert response.status_code == 200

        # get event
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        assert json.loads(response.data)['event_id'] == event_id

        # update event description
        new_desc = "this is updated"
        response = client.post('/event/%s' % event_id, data={
            "Type": "description",
            "Description": new_desc
        })
        assert response.status_code == 200
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        assert json.loads(response.data)['description'] == new_desc

        # update event time
        new_time = "2021-01-01 10:00:00"
        response = client.post('/event/%s' % event_id, data={
            "Type": "time",
            "Time": new_time
        })
        assert response.status_code == 200
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        assert json.loads(response.data)['time'] == new_time

        # update event address
        new_address = "515 W 110th St, New York"
        new_longitude = "22.222222"
        new_latitude = "22.222222"
        response = client.post('/event/%s' % event_id, data={
            "Type": "address",
            "Address": new_address,
            "Longitude": new_longitude,
            "Latitude": new_latitude
        })
        assert response.status_code == 200
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        assert json.loads(response.data)['address'] == new_address
        assert json.loads(response.data)['longitude'] == new_longitude
        assert json.loads(response.data)['latitude'] == new_latitude

        # delete event
        response = client.delete('/event/%s' % event_id)
        assert response.status_code == 200

        # get event
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 400

    def test_2(self, client):
        """
        index -> login -> userinfo -> create_event
        -> create_event -> create_event -> get_nearby_events
        """
        self.test_login(client)

        # create three events
        longitude = 12.111123
        latitude = 23.222223
        dif = 0.01
        event_ids = []
        for i in range(3):
            dif *= 10
            response = client.post('/event', data={
                "Event_name": "event",
                "Address": "512 W, 110th St, New York",
                "Longitude": str(longitude + dif),
                "Latitude": str(latitude + dif),
                "Time": "2021-10-12 12:12:12",
                "Description": "",
                "Image": "",
                "Category": ""
            })
            event_ids.append(str(json.loads(response.data)))
            assert response.status_code == 200

        uri = '/events/nearby?pos={},{}'.format(latitude, longitude)
        response = client.get(uri)
        assert response.status_code == 200
        events = json.loads(response.data)
        assert len(events) == 3
        for i in range(3):
            assert events[i]["event_id"] == event_ids[i]

        uri = '/events/nearby?pos=null'
        response = client.get(uri)
        assert response.status_code == 200
        events = json.loads(response.data)
        assert len(events) == 3
        for i in range(3):
            assert events[i]["event_id"] == event_ids[i]

        for event_id in event_ids:
            # delete event
            response = client.delete('/event/%s' % event_id)
            assert response.status_code == 200

    def test_3(self, client):
        """
        index -> login -> userinfo -> create_event
        -> get_event -> create_comment -> get_event -> delete_comment -> get_event
        """
        self.test_login(client)
        # create event
        response = client.post('/event', data={
            "Event_name": "event",
            "Address": "512 W, 110th St, New York",
            "Longitude": "12.1111",
            "Latitude": "23.2222",
            "Time": "2021-10-12 12:12:12",
            "Description": "",
            "Image": "",
            "Category": ""
        })
        event_id = str(json.loads(response.data))
        assert response.status_code == 200

        # get event
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        assert json.loads(response.data)['event_id'] == event_id

        # create comment
        time = '2020-12-31 10:00:01'
        content = 'test comment'
        response = client.post('/user/event/%s/comment' % event_id, data={
            'Time': time,
            'Content': content
        })
        assert response.status_code == 200
        comment_id = str(json.loads(response.data))

        # get event
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        ret_event = json.loads(response.data)
        assert ret_event['comments'][0]['id'] == comment_id
        assert ret_event['comments'][0]['time'] == time
        assert ret_event['comments'][0]['content'] == content

        # delete comment
        response = client.delete('/comment/%s' % comment_id)
        assert response.status_code == 200

        # get event
        response = client.get('/event/%s' % event_id)
        assert response.status_code == 200
        ret_event = json.loads(response.data)
        assert len(ret_event['comments']) == 0

        # delete event
        response = client.delete('/event/%s' % event_id)
        assert response.status_code == 200

    def test_4(self, client):
        """
        index -> login -> userinfo -> create_event (past)
        -> get_all_history_event_by_user -> get_attendees_by_event
        -> leave event -> get_attendees_by_event -> join_event
        -> get_attendees_by_event -> delete_event
        """
        # response = client.get('/')
        # assert response.status_code == 200

        self.test_login(client)

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
        index -> login -> userinfo -> create_event
        -> get_all_ongoing_event_by_user -> leave event
        -> get_all_ongoing_event_by_user -> join_event
        -> get_all_ongoing_event_by_user -> delete event
        """
        self.test_login(client)

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
        index -> login -> userinfo -> create_event
        -> like_event -> get_all_event_liked_by_user
        -> unlike event -> get_all_event_liked_by_user
        -> like_event -> get_all_event_liked_by_user -> delete_event
        """
        self.test_login(client)

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
