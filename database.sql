CREATE DATABASE IF NOT EXISTS `DATABASE`;
USE `DATABASE`;

CREATE TABLE IF NOT EXISTS Parking (
	id CHAR NOT NULL,
	name VARCHAR(45) NOT NULL,
	floors INT NOT NULL DEFAULT 1,
	address VARCHAR(100) NOT NULL,
	CONSTRAINT pk_parking PRIMARY KEY (id),
	CONSTRAINT uc_parking_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS Spot (
	id INT NOT NULL AUTO_INCREMENT,
	number INT NOT NULL,
	floor INT NOT NULL,
	id_park CHAR NOT NULL,
	CONSTRAINT pk_spot PRIMARY KEY (id),
	CONSTRAINT fk_spot_parking FOREIGN KEY (id_park) REFERENCES Parking (id)
);

CREATE TABLE IF NOT EXISTS Role (
	name VARCHAR(45) NOT NULL,
	see_other_users BIT(1) DEFAULT 0,
	modify_spot_users BIT(1) DEFAULT 0,
	modify_role_users BIT(1) DEFAULT 0,
	delete_other_user BIT(1) DEFAULT 0,
	modify_other_users BIT(1) DEFAULT 0,
	CONSTRAINT pk_role PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS User (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(200) NOT NULL,
	role VARCHAR(45) NOT NULL,
	token VARCHAR(20) NOT NULL,
	id_spot INT DEFAULT NULL,
	id_spot_temp INT DEFAULT NULL,
	id_park_demande CHAR DEFAULT NULL,
	CONSTRAINT pk_user PRIMARY KEY (id),
	CONSTRAINT fk_user_role FOREIGN KEY (role) REFERENCES Role (name),
	CONSTRAINT fk_user_spot FOREIGN KEY (id_spot) REFERENCES Spot (id),
	CONSTRAINT fk_user_spot_temp FOREIGN KEY (id_spot_temp) REFERENCES Spot (id),
	CONSTRAINT fk_user_park_demande FOREIGN KEY (id_park_demande) REFERENCES Parking (id),
	CONSTRAINT uc_user_email UNIQUE (email),
	CONSTRAINT uc_user_token UNIQUE (token)
);

CREATE TABLE IF NOT EXISTS Schedule (
	id INT NOT NULL AUTO_INCREMENT,
	type VARCHAR(50) NOT NULL,
	id_parking CHAR,
	date_start DATETIME NOT NULL,
	date_end DATETIME NOT NULL,
	CONSTRAINT pk_schedule PRIMARY KEY (id),
	CONSTRAINT fk_schedule_parking FOREIGN KEY (id_parking) REFERENCES Parking (id)
);

CREATE TABLE IF NOT EXISTS Schedule_Spot (
	id_schedule INT NOT NULL,
	id_spot INT NOT NULL,
	CONSTRAINT pk_schedule_spot PRIMARY KEY (id_schedule, id_spot),
	CONSTRAINT fk_schedule_spot_spot FOREIGN KEY (id_spot) REFERENCES Spot (id),
	CONSTRAINT fk_schedule_spot_schedule FOREIGN KEY (id_schedule) REFERENCES Schedule (id)
);

CREATE TABLE IF NOT EXISTS User_Schedule (
	id_user INT NOT NULL,
	id_schedule INT NOT NULL,
	is_guest TINYINT(1) NOT NULL,
	CONSTRAINT pk_user_schedule PRIMARY KEY (id_user, id_schedule),
	CONSTRAINT fk_user_schedule_user FOREIGN KEY (id_user) REFERENCES User (id),
	CONSTRAINT fk_user_schedule_schedule FOREIGN KEY (id_schedule) REFERENCES Schedule (id)
);

CREATE TABLE IF NOT EXISTS Type (
	name VARCHAR(45) NOT NULL,
	CONSTRAINT pk_type PRIMARY KEY (name)
);

CREATE TABLE IF NOT EXISTS Typed (
	id_spot INT NOT NULL,
	name_type VARCHAR(45) NOT NULL,
	CONSTRAINT pk_typed PRIMARY KEY (id_spot, name_type),
	CONSTRAINT fk_typed_spot FOREIGN KEY (id_spot) REFERENCES Spot (id),
	CONSTRAINT fk_typed_type FOREIGN KEY (name_type) REFERENCES Type (name)
);

CREATE TABLE IF NOT EXISTS Notification (
	id INT NOT NULL AUTO_INCREMENT,
	id_user INT NOT NULL,
	action VARCHAR(100) NOT NULL,
	type_notif VARCHAR(100) NOT NULL,

	id_schedule INT, -- Foreign key that is not a foreign key
	type VARCHAR(50),
	id_parking CHAR,
	date_start DATETIME,
	date_end DATETIME,
	CONSTRAINT pk_notification PRIMARY KEY (id),
	CONSTRAINT fk_notification_user FOREIGN KEY (id_user) REFERENCES User (id)
);