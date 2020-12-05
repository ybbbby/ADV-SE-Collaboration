"""
Google OAuth blueprint
"""


import functools
import flask

from authlib.client import OAuth2Session
import google.oauth2.credentials
import googleapiclient.discovery

import config
from models.user import User

ACCESS_TOKEN_URI = config.ACCESS_TOKEN_URI
AUTHORIZATION_URL = config.AUTHORIZATION_URL

AUTHORIZATION_SCOPE = 'openid email profile'

AUTH_REDIRECT_URI = config.FN_AUTH_REDIRECT_URI
BASE_URI = config.FN_BASE_URI
CLIENT_ID = config.FN_CLIENT_ID
CLIENT_SECRET = config.FN_CLIENT_SECRET

AUTH_TOKEN_KEY = 'auth_token'
AUTH_STATE_KEY = 'auth_state'

app = flask.Blueprint('google_auth', __name__)


def is_logged_in():
    """
    :return: boolean, indicates whether the user is logged in
    """
    if AUTH_TOKEN_KEY in flask.session:
        return True
    return False


def build_credentials():
    """
    Create credentials
    :return: Credential
    """
    if not is_logged_in():
        raise Exception('User must be logged in')

    oauth2_tokens = flask.session[AUTH_TOKEN_KEY]

    return google.oauth2.credentials.Credentials(
        oauth2_tokens['access_token'],
        refresh_token=oauth2_tokens['refresh_token'],
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        token_uri=ACCESS_TOKEN_URI)


def get_user_info():
    """
    Get the information of the current user
    :return: dictionary of the current user info
    """
    if config.TEST:
        return {'email': 'test@test.com', 'name': 'test'}

    credentials = build_credentials()

    oauth2_client = googleapiclient.discovery.build(
        'oauth2', 'v2',
        credentials=credentials)
    # pylint: disable=maybe-no-member
    return oauth2_client.userinfo().get().execute()


def no_cache(view):
    """
    Disable cache
    :param view: view
    :return: wrapper
    """
    @functools.wraps(view)
    def no_cache_impl(*args, **kwargs):
        response = flask.make_response(view(*args, **kwargs))
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return functools.update_wrapper(no_cache_impl, view)


@app.route('/google/login', methods=['GET'])
@no_cache
def login():
    """
    User log in
    :return: uri
    """
    session = OAuth2Session(CLIENT_ID, CLIENT_SECRET,
                            scope=AUTHORIZATION_SCOPE,
                            redirect_uri=AUTH_REDIRECT_URI)

    uri, state = session.authorization_url(AUTHORIZATION_URL)

    flask.session[AUTH_STATE_KEY] = state
    flask.session.permanent = True

    return uri


@app.route('/google/auth')
@no_cache
def google_auth_redirect():
    """
    Validate the user
    :return: redirect the uri
    """
    if config.TEST:
        flask.session[AUTH_TOKEN_KEY] = "testing"
    else:
        req_state = flask.request.args.get('state', default=None, type=None)

        if req_state != flask.session[AUTH_STATE_KEY]:
            response = flask.make_response('Invalid state parameter', 401)
            return response

        session = OAuth2Session(CLIENT_ID, CLIENT_SECRET,
                                scope=AUTHORIZATION_SCOPE,
                                state=flask.session[AUTH_STATE_KEY],
                                redirect_uri=AUTH_REDIRECT_URI)

        oauth2_tokens = session.fetch_access_token(
            ACCESS_TOKEN_URI,
            authorization_response=flask.request.url)

        flask.session[AUTH_TOKEN_KEY] = oauth2_tokens

    user_info = get_user_info()
    email = user_info["email"]
    username = user_info["name"]
    new_user = User(email=email, username=username)
    User.create_user(new_user)

    return flask.redirect(BASE_URI, code=302)


@app.route('/google/logout')
@no_cache
def logout():
    """
    User log out
    :return: redirect uri
    """
    flask.session.pop(AUTH_TOKEN_KEY, None)
    flask.session.pop(AUTH_STATE_KEY, None)

    return flask.redirect(BASE_URI, code=302)
