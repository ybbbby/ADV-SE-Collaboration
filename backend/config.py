"""
Config file
"""
import os


# DB_PASSWORD = "41562020yesok!"
DB_PASSWORD = os.environ['DB_PASSWORD']
ACCESS_TOKEN_URI = os.environ['ACCESS_TOKEN_URI']
AUTHORIZATION_URL = os.environ['AUTHORIZATION_URL']
FN_AUTH_REDIRECT_URI = os.environ['FN_AUTH_REDIRECT_URI']
# FN_AUTH_REDIRECT_URI = 'http://yes-ok.herokuapp.com/google/auth'
FN_BASE_URI = os.environ['FN_BASE_URI']
# FN_BASE_URI = 'http://yes-ok.herokuapp.com/'
FN_CLIENT_ID = os.environ['FN_CLIENT_ID']
FN_CLIENT_SECRET = os.environ['FN_CLIENT_SECRET']
FN_FLASK_SECRET_KEY = os.environ['FN_FLASK_SECRET_KEY']
SMTP_EMAIL = os.environ['SMTP_EMAIL']
SMTP_PWD = os.environ['SMTP_PWD']
TEST = bool(os.environ['TEST'])
TRAVIS = False if 'TRAVIS' not in os.environ else bool(os.environ['TRAVIS'])
