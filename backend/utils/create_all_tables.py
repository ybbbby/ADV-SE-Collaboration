import mysql.connector
import utils.database_connector as db_connector

TABLES = {}

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
    `address` VARCHAR(50) NOT NULL,
    `longitude` DECIMAL(9,6) NOT NULL,
    `latitude` DECIMAL(9,6) NOT NULL,
    `zipcode` VARCHAR(10) NOT NULL,
    `time` DATETIME NOT NULL,
    `description` VARCHAR(200) NULL,
    `image` VARCHAR(200) NULL,
    `num_likes` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_zipcode` (`zipcode` ASC) VISIBLE,
    INDEX `host_to_user_idx` (`host` ASC) VISIBLE,
    CONSTRAINT `host_to_user`
      FOREIGN KEY (`host`)
    REFERENCES `YesOK`.`user` (`email`)
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
    `content` VARCHAR(200) NULL,
    `time` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
	CONSTRAINT `comment_user` FOREIGN KEY (`user`) REFERENCES `YesOK`.`user` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `comment_event` FOREIGN KEY (`event`) REFERENCES `YesOK`.`event` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_event` (`event` ASC) VISIBLE);
    '''
)

TABLES['join'] = (
    '''
    CREATE TABLE IF NOT EXISTS `join` (
	`user` VARCHAR(25) NOT NULL,
    `event` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`user`, `event`),
	CONSTRAINT `join_user` FOREIGN KEY (`user`) REFERENCES `YesOK`.`user` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `join_event` FOREIGN KEY (`event`) REFERENCES `YesOK`.`event` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_join_user` (`user` ASC) VISIBLE,
    INDEX `idx_join_event` (`event` ASC) VISIBLE);
    '''
)

TABLES['like'] = (
    '''
    CREATE TABLE IF NOT EXISTS `like` (
	`user` VARCHAR(25) NOT NULL,
    `event` VARCHAR(25) NOT NULL,
    PRIMARY KEY (`user`, `event`),
	CONSTRAINT `like_user` FOREIGN KEY (`user`) REFERENCES `YesOK`.`user` (`email`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `like_event` FOREIGN KEY (`event`) REFERENCES `YesOK`.`event` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_like_user` (`user` ASC) VISIBLE,
    INDEX `idx_like_event` (`event` ASC) VISIBLE
);
    '''
)


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
