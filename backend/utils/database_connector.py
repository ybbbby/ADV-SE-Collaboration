import mysql.connector


def get_connection():
    cnx = mysql.connector.connect(
        host="localhost",
        database='YesOK',
        port=3306,
        user="root",
        password="lrg19971106mysql")
    return cnx