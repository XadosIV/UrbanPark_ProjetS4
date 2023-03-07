CREATE DATABASE IF NOT EXISTS `UrbanPark`;

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Parking` (
    cid CHAR NOT NULL,
    nom VARCHAR(45) NOT NULL,
    nb_etage INT NOT NULL DEFAULT 1,
    CONSTRAINT PK_Parking PRIMARY KEY (cid)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Place` (
    id INT NOT NULL,
    nPlace INT,
    etage INT,
    cid CHAR,
    CONSTRAINT PK_Place PRIMARY KEY (id),
    CONSTRAINT FK_Place_Parking FOREIGN KEY (cid) REFERENCES `UrbanPark`.`Parking` (cid)
);
CREATE TABLE IF NOT EXISTS `UrbanPark`.`Role` (
    id INT NOT NULL,
    nom VARCHAR NOT NULL,
    CONSTRAINT PK_Role PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Utilisateur` (
    id INT NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    role INT NOT NULL,
    -- role ENUM('ABONNE', 'GARDIEN', 'NETTOYAGE', 'ADMIN') NOT NULL DEFAULT 'Abonne',
    valide BOOLEAN NOT NULL DEFAULT FALSE,
    idPlace INT NOT NULL,
    CONSTRAINT PK_Utilisateur PRIMARY KEY (id),
    CONSTRAINT FK_Utilisateur_Role FOREIGN KEY (id) REFERENCES `UrbanPark`.`Role` (id),
    CONSTRAINT FK_Utilisateur_Place FOREIGN KEY (id) REFERENCES `UrbanPark`.`Place` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Travaille` (
    id INT NOT NULL,
    idUtilisateur INT NOT NULL,
    idParking CHAR NOT NULL,
    dstart DATETIME NOT NULL,
    dend DATETIME NOT NULL,
    CONSTRAINT PK_Travaille PRIMARY KEY (id),
    CONSTRAINT FK_Travaille_Utilisateur FOREIGN KEY (idUtilisateur) REFERENCES `UrbanPark`.`Utilisateur` (id),
    CONSTRAINT FK_Travaille_Parking FOREIGN KEY (idParking) REFERENCES `UrbanPark`.`Parking` (cid)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Reservation` (
    id INT NOT NULL,
    idUtilisateur INT NOT NULL,
    dstart DATETIME NOT NULL,
    dend DATETIME NOT NULL,
    CONSTRAINT PK_Reservation PRIMARY KEY (id),
    CONSTRAINT FK_Reservation_Utilisateur FOREIGN KEY (idUtilisateur) REFERENCES `UrbanPark`.`Utilisateur` (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Type` (
    id INT NOT NULL,
    nom VARCHAR(45) NOT NULL,
    CONSTRAINT PK_Type PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `UrbanPark`.`Possede` (
    id INT NOT NULL,
    idPlace INT NOT NULL,
    idType INT NOT NULL,
    CONSTRAINT PK_Possede PRIMARY KEY (id),
    CONSTRAINT FK_Possede_Place FOREIGN KEY (idPlace) REFERENCES `UrbanPark`.`Place` (id),
    CONSTRAINT FK_Possede_Type FOREIGN KEY (idType) REFERENCES `UrbanPark`.`Type` (id),
    CONSTRAINT UC_Possede UNIQUE (idPlace, idType)
);