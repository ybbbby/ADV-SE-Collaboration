import mysql.connector
import utils.database_connector as db_connector

TABLES = {}

TABLES['user'] = (
    "CREATE TABLE IF NOT EXISTS `user` ("
    "`email` VARCHAR(25) NOT NULL,"
    "`name` VARCHAR(25) NOT NULL,"
    "PRIMARY KEY (`email`));")

TABLES['event'] = (
    "CREATE TABLE IF NOT EXISTS `event` ("
  "`id` VARCHAR(25) NOT NULL,"
  "`host` VARCHAR(25) NOT NULL,"
  "`address` VARCHAR(50) NOT NULL,"
  "`longitude` DECIMAL(9,6) NOT NULL,"
  "`latitude` DECIMAL(9,6) NOT NULL,"
  "`zipcode` VARCHAR(10) NOT NULL,"
  "`time` DATETIME NOT NULL,"
  "`description` VARCHAR(200) NULL,"
  "`image` BLOB NULL,"
  "`num_likes` INT NOT NULL,"
  "PRIMARY KEY (`id`),"
  "INDEX `idx_zipcode` (`zipcode` ASC) VISIBLE,"
  "INDEX `host_to_user_idx` (`host` ASC) VISIBLE,"
  "CONSTRAINT `host_to_user`"
    "  FOREIGN KEY (`host`)"
    "REFERENCES `YesOK`.`user` (`email`)"
    "ON DELETE NO ACTION "
    "ON UPDATE NO ACTION);")


def create_tables():
    cnx = db_connector.get_connection()
    cursor = cnx.cursor()
    for table_name in TABLES:
        table_description = TABLES[table_name]
        try:
            print("Creating table {}: ".format(table_name), end='')
            cursor.execute(table_description)
        except mysql.connector.Error as err:
            print(err.msg)
        else:
            print("create all tables: OK")

    cursor.close()
    cnx.close()
