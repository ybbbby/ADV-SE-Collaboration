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
        host="adv-eng-yesok.mysql.database.azure.com",
        database='yesok',
        # database='YesOKTest',  # for testing
        port=3306,
        user="yesokadmin@adv-eng-yesok",
        password=config.DB_PASSWORD)
    return cnx
