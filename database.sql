CREATE DATABASE IF NOT EXISTS `UrbanPark`;

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Parking` (
    id CHAR NOT NULL,
    nom VARCHAR(45) NOT NULL,
    nb_etage INT NOT NULL DEFAULT 1,
    CONSTRAINT PK_Parking PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Place` (
    id INT NOT NULL,
    nPlace INT,
    etage INT,
    id_parking CHAR,
    CONSTRAINT PK_Place PRIMARY KEY (id),
    CONSTRAINT FK_Place_Parking FOREIGN KEY (id_parking) REFERENCES `UrbanPark`.`Parking` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Role` (
    nom VARCHAR(45) NOT NULL,
    CONSTRAINT PK_Role PRIMARY KEY (nom)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Utilisateur` (
    id INT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    role VARCHAR(45) NOT NULL,
    -- role ENUM('ABONNE', 'GARDIEN', 'NETTOYAGE', 'ADMIN') NOT NULL DEFAULT 'Abonne',
    valide BOOLEAN NOT NULL DEFAULT FALSE,
    id_place INT NOT NULL,
    CONSTRAINT PK_Utilisateur PRIMARY KEY (id),
    CONSTRAINT FK_Utilisateur_Role FOREIGN KEY (role) REFERENCES `UrbanPark`.`Role` (nom),
    CONSTRAINT FK_Utilisateur_Place FOREIGN KEY (id_place) REFERENCES `UrbanPark`.`Place` (id),
    CONSTRAINT UC_Utilisateur UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Personnel_Parking` (
    id_utilisateur INT NOT NULL,
    id_parking CHAR NOT NULL,
    dstart DATETIME NOT NULL,
    dend DATETIME NOT NULL,
    CONSTRAINT PK_Travaille PRIMARY KEY (id_utilisateur, id_parking),
    CONSTRAINT FK_Travaille_Utilisateur FOREIGN KEY (id_utilisateur) REFERENCES `UrbanPark`.`Utilisateur` (id),
    CONSTRAINT FK_Travaille_Parking FOREIGN KEY (id_parking) REFERENCES `UrbanPark`.`Parking` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Utilisateur_Parking` (
    id INT NOT NULL,
    id_utilisateur INT NOT NULL,
    dstart DATETIME NOT NULL,
    dend DATETIME NOT NULL,
    CONSTRAINT PK_Reservation PRIMARY KEY (id),
    CONSTRAINT FK_Reservation_Utilisateur FOREIGN KEY (id_utilisateur) REFERENCES `UrbanPark`.`Utilisateur` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Type` (
    nom VARCHAR(45) NOT NULL,
    CONSTRAINT PK_Type PRIMARY KEY (nom)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Place_Type` (
    id_place INT NOT NULL,
    id_type VARCHAR(45) NOT NULL,
    CONSTRAINT PK_Possede PRIMARY KEY (id_place, id_type),
    CONSTRAINT FK_Possede_Place FOREIGN KEY (id_place) REFERENCES `UrbanPark`.`Place` (id),
    CONSTRAINT FK_Possede_Type FOREIGN KEY (id_type) REFERENCES `UrbanPark`.`Type` (nom),
    CONSTRAINT UC_Possede UNIQUE (id_place, id_type)
);