import mysql.connector
import config

def get_connection():
    cnx = mysql.connector.connect(
        host="localhost",
        database='YesOK',
        port=3306,
        user="root",
        password=config.DB_PASSWORD)
    return cnx

