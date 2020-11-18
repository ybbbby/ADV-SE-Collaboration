"""
get a connection to database
"""


import mysql.connector
import config


def get_connection():
    """
    Get a connection to the database
    :return: A connection object
    """
    cnx = mysql.connector.connect(
        host="localhost",
        database='YesOK',
        # database='YesOKTest',  # for testing
        port=3306,
        user="root",
        password=config.DB_PASSWORD)
    return cnx
