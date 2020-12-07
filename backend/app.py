"""
Flask backend apis of YesOK application
"""

from datetime import datetime
import json
import os
import traceback
import smtplib
from flask import Flask, request
from flask_api import status
import mysql.connector

import google_auth
import config
import utils.create_all_tables as db_create_tables
import utils.send_email as mail_service
from models.event import Event
from models.user import User
from models.comment import Comment
from models.join import Join
from models.like import Like


app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
smtp_obj = None
if not config.TRAVIS:
    smtp_obj = smtplib.SMTP('smtp.gmail.com', 587)
    smtp_obj.starttls()
    smtp_obj.login(config.SMTP_EMAIL, config.SMTP_PWD)
LINK = "http://yes-ok.herokuapp.com"
app.secret_key = config.FN_FLASK_SECRET_KEY
app.register_blueprint(google_auth.app)
clients = {}

# create tables in the database
db_create_tables.create_tables()


@app.route('/')
def index():
    """
    Display homepage
    :return: index.html
    """
    if config.TRAVIS:
        return "", status.HTTP_200_OK
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(event):
    """
    Handle 404
    :return: index.html
    """
    print(event)
    if config.TRAVIS:
        return "", status.HTTP_200_OK
    return app.send_static_file('index.html')


@app.route('/event', methods=['POST'])
def create_new_event():
    """
    Create a new event
    :return: event id
    """
    user_info = google_auth.get_user_info()
    email = user_info["email"]
    event_name = request.form.get("Event_name")
    address = request.form.get("Address")
    # zipcode = address[-5:]
    zipcode = "10025"
    longitude = request.form.get("Longitude")
    latitude = request.form.get("Latitude")
    time = request.form.get("Time")
    description = request.form.get("Description")
    image_path = request.form.get("Image")
    category = request.form.get("Category")
    new_event = Event(user=email, name=event_name, address=address,
                      longitude=longitude, latitude=latitude, zipcode=zipcode,
                      event_time=datetime.strptime(str(time), "%Y-%m-%d %H:%M:%S"))
    new_event.description = description
    new_event.image = image_path
    new_event.category = category
    try:
        event_id = Event.create_event(new_event)
        Join.create_join(Join(email, event_id))
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return event_id


@app.route('/event/<event_id>', methods=['POST', 'DELETE', 'GET'])
def handle_event(event_id):
    """
    Handles http Post, Delete and Get request to update, delete and return an event
    :param event_id: id of the event
    :return: http status code
    """
    if request.method == 'DELETE':
        return delete_event_by_id(event_id)
    if request.method == 'POST':
        return update_event_by_id(event_id)
    if request.method == 'GET':
        return get_event_by_id(event_id)
    return "", status.HTTP_200_OK


def delete_event_by_id(event_id):
    """
    Helper function to delete the event
    :param event_id: event id
    :return: http status code
    """
    try:
        event = Event.get_event_by_id(event_id)
        users = User.get_attendees_by_event(event_id)
        user_emails = [user.email for user in users]
        Event.delete_event_by_id(event_id)
        delete_notification(user_emails, event)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


def update_event_by_id(event_id):
    """
    Helper function to update the event
    :param event_id: id of the event
    :return: http status code
    """
    event_type = request.form.get("Type")
    try:
        if event_type == "time":
            Event.update_event({"time": request.form.get("Time")}, event_id)
        elif event_type == "address":
            Event.update_event({"address": request.form.get("Address"),
                                "longitude": request.form.get("Longitude"),
                                "latitude": request.form.get("Latitude")}, event_id)
        elif event_type == "description":
            Event.update_event(
                {"description": request.form.get("Description")}, event_id)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


def get_event_by_id(event_id):
    """
    Helper function to get an event by event id
    :param event_id: event id
    :return: json of the event
    """
    email = None
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        email = user_info["email"]
    try:
        event = Event.get_event_by_id(event_id, email)
        if not event:
            return "", status.HTTP_400_BAD_REQUEST
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps(event.__dict__, default=Event.serialize_comment_in_event), status.HTTP_200_OK


@app.route('/event/<event_id>/attendees', methods=['GET'])
def get_attendees_by_event(event_id):
    """
    Get all attendees of the given event
    :param event_id:
    :return: json of the users
    """
    Join.get_join_by_event(event_id)
    try:
        users = User.get_attendees_by_event(event_id)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps([ob.__dict__ for ob in users], default=str), status.HTTP_200_OK


@app.route('/user/info', methods=['GET'])
def userinfo():
    """
    Get cur user info
    :return: json of the user info
    """
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        return json.dumps(user_info, indent=4)
    return json.dumps("NOUSER", indent=4)


@app.route('/user/event/<event_id>/join', methods=['POST'])
def join_event(event_id):
    """
    user join a event
    :return: http status code
    """
    info = google_auth.get_user_info()
    email = info["email"]

    try:
        exists = Join.user_is_attend(email, event_id)
        if exists:
            Join.delete_join(Join(email, event_id))
        else:
            Join.create_join(Join(email, event_id))
            join_notification([email], Event.get_event_by_id(event_id, email))
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


@app.route('/user/event/<event_id>/like', methods=['POST'])
def like_event(event_id):
    """
    user like a event
    :return: http status code
    """
    email = google_auth.get_user_info()["email"]
    try:
        exists = Like.exist(email, event_id)
        if not exists:
            Like.create_like(Like(email, event_id))
        else:
            Like.delete_like(Like(email, event_id))
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


@app.route('/user/event/<event_id>/comment', methods=['POST'])
def create_new_comment(event_id):
    """
    user create a new comment on a event
    :return: http status code
    """
    time = request.form.get("Time")
    content = request.form.get("Content")
    user_info = google_auth.get_user_info()
    email = user_info["email"]
    comment = Comment(user=email, content=content,
                      comment_time=datetime.strptime(time, '%Y-%m-%d %H:%M:%S'), event=event_id)
    try:
        comment_id = Comment.create_comment(comment)
        # send notification to the event host
        # event = Event.get_event_by_id(id)
        # email_content = name + " just commented your event " + event.name + "."
        # mail_service.send(mail=mail, title="A user just comment your event",
        # recipients=[event.user_email], content=email_content)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return comment_id, status.HTTP_200_OK


@app.route('/comment/<comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """
    Delete a comment
    :return: ""
    """
    try:
        Comment.delete_comment(comment_id)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return "", status.HTTP_200_OK


@app.route('/events/liked', methods=['GET'])
def get_all_event_liked_by_user():
    """
    Get all event a user liked
    :return: json of events
    """
    email = google_auth.get_user_info()["email"]
    try:
        events = Event.get_all_event_liked_by_user(email)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps([ob.__dict__ for ob in events], default=str), status.HTTP_200_OK


@app.route('/events/history', methods=['GET'])
def get_all_history_event_by_user():
    """
    Get all events a user joined and happened
    :return: json of events
    """
    email = google_auth.get_user_info()["email"]
    try:
        events = Event.get_all_history_event_by_user(email)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps([ob.__dict__ for ob in events], default=str), status.HTTP_200_OK


@app.route('/events/ongoing', methods=['GET'])
def get_all_ongoing_event_by_user():
    """
    Get all events a user joined and haven't happened
    :return: json of events
    """
    email = google_auth.get_user_info()["email"]
    try:
        events = Event.get_all_ongoing_event_by_user(email)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps([ob.__dict__ for ob in events], default=str), status.HTTP_200_OK


@app.route('/events/nearby', methods=['GET'])
def get_nearby_events():
    """
    Get all events nearby a user
    :return: json of events
    """
    email = None
    if google_auth.is_logged_in():
        email = google_auth.get_user_info()["email"]
    try:
        pos = request.args.get("pos")
        if pos == "null":
            events = Event.get_all_ongoing_events(email)
        else:
            latitude = float("{:.6f}".format(float(pos.split(",")[0])))
            longitude = float("{:.6f}".format(float(pos.split(",")[1])))
            events = Event.get_nearby_events(email, latitude, longitude)
    except mysql.connector.Error:
        traceback.print_exc()
        return "", status.HTTP_400_BAD_REQUEST
    return json.dumps([ob.__dict__ for ob in events], default=str), status.HTTP_200_OK


def join_notification(recipients, event):
    """
    helper function for notification when joining event
    :param recipients: list of recipients' email address
    :param event: event object
    """
    title = "You have registered the event successfully!"
    event_link = LINK + "/event/" + event.event_id
    content = """
                <p>You have registered the event {name}  
                hosted by {host} successfully! To see details, please
                 visit <a href={eventlink}>here</a></p>
               """.format(name=event.name,
                          host=event.author, eventlink=event_link)
    if not config.TRAVIS:
        mail_service.send(smtp_obj, title, recipients, content, False)


def delete_notification(recipients, event):
    """
    helper function for notification when event is deleted
    :param recipients: list of recipients' email address
    :param event: event object
    """
    title = "The event you registered is canceled"
    event_link = LINK + "/#/event/" + event.event_id
    content = """
            <p>Unfortunately, the event {name} you 
            registered is canceled. To see details, please
             visit <a href={eventlink}>here</a></p>
    """.format(name=event.name, eventlink=event_link)
    if not config.TRAVIS:
        mail_service.send(smtp_obj, title, recipients, content, True)

# # Test create user method in User
# @app.route('/user/create', methods=['GET'])
# def create_user():
#     username = request.args.get('username')
#     email = request.args.get('email')
#     newUser = User(email=email, username=username)
#     User.create_user(newUser)
#     return "success"


if __name__ == '__main__':
    app.run(host='localhost', debug=False, port=os.environ.get('PORT', 3000))
