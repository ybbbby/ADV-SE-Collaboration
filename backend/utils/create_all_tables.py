"""
create all tables in database
"""


import mysql.connector
import utils.database_connector as db_connector

TABLES = {}
FUNCTIONS = {}

TABLES['user'] = (
    '''
    CREATE TABLE IF NOT EXISTS `user` (
    `email` VARCHAR(25) NOT NULL,
    `name` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`email`));
    '''
)

TABLES['event'] = (
    '''
    CREATE TABLE IF NOT EXISTS `event` (
    `id` VARCHAR(25) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `host` VARCHAR(25) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `longitude` DECIMAL(9,6) NOT NULL,
    `latitude` DECIMAL(9,6) NOT NULL,
    `zipcode` VARCHAR(10) NOT NULL,
    `time` DATETIME NOT NULL,
    `description` VARCHAR(600) NULL,
    `image` VARCHAR(200) NULL,
    `num_likes` INT NOT NULL,
    `category` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_zipcode` (`zipcode` ASC),
    INDEX `host_to_user_idx` (`host` ASC),
    CONSTRAINT `host_to_user`
      FOREIGN KEY (`host`)
    REFERENCES `user` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    '''
)

TABLES['comment'] = (
    '''
    CREATE TABLE IF NOT EXISTS `comment` (
	`id` VARCHAR(25) NOT NULL,
    `user` VARCHAR(25) NOT NULL,
    `event` VARCHAR(25) NOT NULL,
    `content` VARCHAR(300) NULL,
    `time` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
	CONSTRAINT `comment_user` FOREIGN KEY (`user`) REFERENCES `user` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `comment_event` FOREIGN KEY (`event`) REFERENCES `event` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_event` (`event` ASC));
    '''
)

TABLES['join'] = (
    '''
    CREATE TABLE IF NOT EXISTS `join` (
	`user` VARCHAR(25) NOT NULL,
    `event` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`user`, `event`),
	CONSTRAINT `join_user` FOREIGN KEY (`user`) REFERENCES `user` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `join_event` FOREIGN KEY (`event`) REFERENCES `event` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_join_user` (`user` ASC),
    INDEX `idx_join_event` (`event` ASC));
    '''
)

TABLES['like'] = (
    '''
    CREATE TABLE IF NOT EXISTS `like` (
	`user` VARCHAR(25) NOT NULL,
    `event` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`user`, `event`),
	CONSTRAINT `like_user` FOREIGN KEY (`user`) REFERENCES `user` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `like_event` FOREIGN KEY (`event`) REFERENCES `event` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_like_user` (`user` ASC),
    INDEX `idx_like_event` (`event` ASC)
);
    '''
)

FUNCTIONS['cal_dist'] = (
    '''
    create function cal_dist(lat1 double, lng1 double, lat2 double, lng2 double)
    returns double
    BEGIN
    declare dx,dy,b,lx,ly double;
    set dx = lng1 - lng2;
    set dy = lat1 - lat2;
    set b = (lat1 + lat2) / 2.0;
    set lx = radians(dx) * 6367000.0* cos(radians(b));
    set ly = 6367000.0 *  radians(dy);
    return lx *lx + ly *ly;

    END
    '''
)


def create_tables():
    """
    Create all tables when the project starts
    """
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
    for func_name in FUNCTIONS:
        function_desc = FUNCTIONS[func_name]
        try:
            print("Creating function {}: ".format(func_name), end='')
            cursor.execute(function_desc)
        except mysql.connector.Error as err:
            print(err.msg)
        else:
            print("create all function: OK")

    cursor.close()
    cnx.close()
