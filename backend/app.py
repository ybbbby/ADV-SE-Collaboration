from datetime import datetime
import json
import os
from flask import Flask, request
from flask_api import status
import traceback
from flask_mail import Mail

from authlib.client import OAuth2Session
import google.oauth2.credentials
import googleapiclient.discovery

import google_auth
import utils.create_all_tables as db_create_tables
from models.Event import Event
from models.User import User
from models.Comment import Comment
import utils.send_email as mail_service

app = Flask(__name__)
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = ''
app.config['MAIL_PASSWORD'] = ''
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

app.secret_key = os.environ.get("FN_FLASK_SECRET_KEY", default=False)
app.register_blueprint(google_auth.app)

# create tables in the database
db_create_tables.create_tables()


@app.route('/')
def index():
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        return '<div>You are currently logged in as ' + user_info['given_name'] + '<div><pre>' + json.dumps(user_info,
                                                                                                            indent=4) + "</pre>"

    return 'You are not currently logged in.'


# Test create user method in User
@app.route('/user/create', methods=['GET'])
def create_user():
    username = request.args.get('username')
    email = request.args.get('email')
    newUser = User(email=email, username=username)
    User.create_user(newUser)
    return "success"


@app.route('/userinfo')
def userinfo():
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        return json.dumps(user_info, indent=4)
    return "NOUSER"


# Tested - xyz
@app.route('/user/event/new', methods=['PUT'])
def create_new_event():
    user_info = google_auth.get_user_info()
    name = user_info["name"]
    # name = "123"
    event_name = request.form.get("Event_name")
    address = request.form.get("Address")
    zipcode = address[-5:]
    longitude = request.form.get("Longitude")
    latitude = request.form.get("Latitude")
    time = request.form.get("Time")
    description = request.form.get("Description")
    image_path = request.form.get("Image")
    e = Event(user=name, name=event_name, address=address, longitude=longitude, latitude=latitude, zipcode=zipcode,
              time=datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
    e.description = description
    e.image_path = image_path
    try:
        event_id = Event.create_event(e)
    except:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return event_id


# Tested - xyz
@app.route('/event/<id>/delete', methods=['POST'])
def delete_event_by_id(id):
    try:
        Event.delete_event_by_id(id)
    except:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


# Tested - xyz
@app.route('/event/<id>/update', methods=['POST'])
def update_event_by_id(id):
    # user_info = google_auth.get_user_info()
    # name = user_info["name"]
    name = "123"
    event_name = request.form.get("Event_name")
    address = request.form.get("Address")
    zipcode = address[-5:]
    longitude = request.form.get("Longitude")
    latitude = request.form.get("Latitude")
    time = request.form.get("Time")
    description = request.form.get("Description")
    image_path = request.form.get("Image")
    e = Event(user=name, name=event_name, address=address, longitude=longitude, latitude=latitude, zipcode=zipcode,
              time=datetime.datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
    e.id = id
    e.description = description
    e.image_path = image_path
    try:
        Event.update_event(e)
    except:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


# Tested - xyz
@app.route('/event/<id>', methods=['GET'])
def get_event_by_id(id):
    # user_name = "new@new.com"
    user_info = google_auth.get_user_info()
    user_name = user_info["name"]
    try:
        event = Event.get_event_by_id(id, user_name)
    except:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps(event.__dict__, default=Event.serialize_comment_in_event), status.HTTP_200_OK


# Tested - xyz
@app.route('/user/event/<id>/addcomment', methods=['POST'])
def create_new_comment(id):
    time = request.form.get("Time")
    content = request.form.get("Content")
    user_info = google_auth.get_user_info()
    name = user_info["name"]
    # name = "34@34.com"
    comment = Comment(user=name, content=content, time=datetime.strptime(time, '%Y-%m-%d %H:%M:%S'), event=id)
    try:
        Comment.create_comment(comment)
        # send notification to the event host
        # event = Event.get_event_by_id(id)
        # email_content = name + " just commented your event " + event.name + "."
        # mail_service.send(mail=mail, title="A user just comment your event", recipients=[event.user_email], content=email_content)
    except:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


@app.route('/user/event/hosted', methods=['GET'])
def get_all_created_events():
    # TODO: get email from session?
    email = request.args.get('email')
    return Event.get_all_event_created_by_user(email)


@app.route('/email', methods=['POST'])
def send_email():
    # mail_service.send(mail, title, recipients, content)
    return ""
