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
    if config.TEST:
        cnx = mysql.connector.connect(
            host="localhost",
            database='YesOKTest',  # for testing
            port=3306,
            user="root",
            password=config.DB_PASSWORD)
        return cnx

    cnx = mysql.connector.connect(
        host="adv-yesok.mysql.database.azure.com",
        database='yesok',
        port=3306,
        user="yesokadmin@adv-yesok",
        password=config.DB_PASSWORD)
    return cnx
