CREATE DATABASE IF NOT EXISTS `UrbanPark`;

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Park_Lot` (
	id CHAR NOT NULL,
	name VARCHAR(45) NOT NULL,
	floors INT NOT NULL DEFAULT 1,
	address VARCHAR(100) NOT NULL,
	CONSTRAINT pk_parking PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Spot` (
	id INT NOT NULL AUTO_INCREMENT,
	number INT NOT NULL,
	floor INT NOT NULL,
	id_park CHAR NOT NULL,
	CONSTRAINT pk_spot PRIMARY KEY (id),
	CONSTRAINT fk_spot_parking FOREIGN KEY (id_park) REFERENCES `UrbanPark`.`Parking` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Role` (
	name VARCHAR(45) NOT NULL,
	CONSTRAINT pk_role PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`User` (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	role VARCHAR(45) NOT NULL,
	-- role ENUM('ABONNE', 'GARDIEN', 'NETTOYAGE', 'ADMIN') NOT NULL DEFAULT 'Abonne',
	id_spot INT,
	CONSTRAINT pk_user PRIMARY KEY (id),
	CONSTRAINT fk_user_role FOREIGN KEY (role) REFERENCES `UrbanPark`.`Role` (name),
	CONSTRAINT fk_user_spot FOREIGN KEY (id_spot) REFERENCES `UrbanPark`.`Spot` (id),
	CONSTRAINT uc_user_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Schedule` (
	id INT NOT NULL AUTO_INCREMENT,
	id_user INT NOT NULL,
	id_parking CHAR NOT NULL,
	time_start DATETIME NOT NULL,
	time_end DATETIME NOT NULL,
	CONSTRAINT pk_schedule PRIMARY KEY (id),
	CONSTRAINT fk_schedule_user FOREIGN KEY (id_user) REFERENCES `UrbanPark`.`User` (id),
	CONSTRAINT fk_schedule_parking FOREIGN KEY (id_parking) REFERENCES `UrbanPark`.`Parking` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Reservation` (
	id INT NOT NULL AUTO_INCREMENT,
	id_user INT NOT NULL,
	date_start DATETIME NOT NULL,
	date_end DATETIME NOT NULL,
	CONSTRAINT pk_reservation PRIMARY KEY (id),
	CONSTRAINT fk_reservation_user FOREIGN KEY (id_user) REFERENCES `UrbanPark`.`User` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Type` (
	name VARCHAR(45) NOT NULL,
	CONSTRAINT pk_type PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Typed` (
	id_spot INT NOT NULL,
	name_type VARCHAR(45) NOT NULL,
	CONSTRAINT pk_typed PRIMARY KEY (id_spot, name_type),
	CONSTRAINT fk_typed_spot FOREIGN KEY (id_spot) REFERENCES `UrbanPark`.`Spot` (id),
	CONSTRAINT fk_typed_type FOREIGN KEY (name_type) REFERENCES `UrbanPark`.`Type` (name)
);