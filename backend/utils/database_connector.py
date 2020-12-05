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
        # host="adv-yesok.mysql.database.azure.com",
        host="localhost",
        # database='yesok',
        database='YesOKTest',  # for testing
        port=3306,
        # user="yesokadmin@adv-yesok",
        user="root",
        password=config.DB_PASSWORD)
    return cnx
