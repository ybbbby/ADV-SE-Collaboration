import datetime
import json
import os
from flask import Flask, request

from authlib.client import OAuth2Session
import google.oauth2.credentials
import googleapiclient.discovery

import google_auth
import utils.create_all_tables as db_create_tables
from models.Event import Event
from models.User import User

app = flask.Flask(__name__)

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


# # Test get_user_by_email method in User
# @app.route('/user/get', methods=['GET'])
# def create_user():
#     email = request.args.get('email')
#     print(User.get_user_by_email(email).username)
#     return "success"

# Test create event
@app.route('/user/event/new', methods=['POST'])
def test():
    address = request.form.get("address")
    e = Event('aa@cc.com', '110st bb', '10022', datetime.datetime.now(), 21.2452, 11.2345)
    return Event.create_event(e)


@app.route('/user/event/hosted', methods=['GET'])
def get_all_created_events():
    #TODO: get email from session?
    email = request.args.get('email')
    return Event.get_all_event_created_by_user(email)


@app.route('/userinfo')
def userinfo():
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        return json.dumps(user_info, indent = 4)
    return "NOUSER"


@app.route('/event/<id>', methods=['GET'])
def get_event_by_id(id):
    return ""
