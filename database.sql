CREATE DATABASE IF NOT EXISTS `DATABASE`;

CREATE TABLE IF NOT EXISTS `DATABASE`.Parking (
	id CHAR NOT NULL,
	name VARCHAR(45) NOT NULL,
	floors INT NOT NULL DEFAULT 1,
	address VARCHAR(100) NOT NULL,
	CONSTRAINT pk_parking PRIMARY KEY (id),
	CONSTRAINT uc_parking_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS `DATABASE`.Spot (
	id INT NOT NULL AUTO_INCREMENT,
	number INT NOT NULL,
	floor INT NOT NULL,
	id_park CHAR NOT NULL,
	CONSTRAINT pk_spot PRIMARY KEY (id),
	CONSTRAINT fk_spot_parking FOREIGN KEY (id_park) REFERENCES `DATABASE`.Parking (id)
);

CREATE TABLE IF NOT EXISTS `DATABASE`.Role (
	name VARCHAR(45) NOT NULL,
	see_other_users BIT(1) DEFAULT 0,
	modify_spot_users BIT(1) DEFAULT 0,
	modify_role_users BIT(1) DEFAULT 0,
	delete_other_user BIT(1) DEFAULT 0,
	CONSTRAINT pk_role PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS `DATABASE`.User (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL,
	role VARCHAR(45) NOT NULL,
	token VARCHAR(20) NOT NULL,
	id_spot INT DEFAULT NULL,
	id_spot_temp INT DEFAULT NULL,
	CONSTRAINT pk_user PRIMARY KEY (id),
	CONSTRAINT fk_user_role FOREIGN KEY (role) REFERENCES `DATABASE`.Role (name),
	CONSTRAINT fk_user_spot FOREIGN KEY (id_spot) REFERENCES `DATABASE`.Spot (id),
	CONSTRAINT fk_user_spot_temp FOREIGN KEY (id_spot_temp) REFERENCES `DATABASE`.Spot (id),
	CONSTRAINT uc_user_email UNIQUE (email),
	CONSTRAINT uc_user_token UNIQUE (token)
);

CREATE TABLE IF NOT EXISTS `DATABASE`.Schedule (
	id INT NOT NULL AUTO_INCREMENT,
	id_user INT NOT NULL,
	id_parking CHAR NOT NULL,
	date_start DATETIME NOT NULL,
	date_end DATETIME NOT NULL,
	first_spot INT DEFAULT NULL,
	last_spot INT DEFAULT NULL,
	CONSTRAINT pk_schedule PRIMARY KEY (id),
	CONSTRAINT fk_schedule_user FOREIGN KEY (id_user) REFERENCES `DATABASE`.User (id),
	CONSTRAINT fk_schedule_parking FOREIGN KEY (id_parking) REFERENCES `DATABASE`.Parking (id),
	CONSTRAINT fk_schedule_first_spot FOREIGN KEY (first_spot) REFERENCES `DATABASE`.Spot (id),
	CONSTRAINT fk_schedule_last_spot FOREIGN KEY (last_spot) REFERENCES `DATABASE`.Spot (id)
);

CREATE TABLE IF NOT EXISTS `DATABASE`.Type (
	name VARCHAR(45) NOT NULL,
	CONSTRAINT pk_type PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS `DATABASE`.Typed (
	id_spot INT NOT NULL,
	name_type VARCHAR(45) NOT NULL,
	CONSTRAINT pk_typed PRIMARY KEY (id_spot, name_type),
	CONSTRAINT fk_typed_spot FOREIGN KEY (id_spot) REFERENCES `DATABASE`.Spot (id),
	CONSTRAINT fk_typed_type FOREIGN KEY (name_type) REFERENCES `DATABASE`.Type (name)
);