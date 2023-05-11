# Urban Park

Projet L2 réalisé durant le semestre 4, année 2023

## Equipe
- @github/UP-4303
- @github/MagicsssS
- @github/Osteriux
- @github/XadosIV
- @github/Poutchy

## Description

- Une application web d'un site de parking, possédant un système de gestion des employés du parking (Gardien, Equipe de nettoyage) ainsi que des utilisateurs (Abonnés)
- Une couche API REST permettant de communiquer efficaement avec une base de donnée SQL

## Langages

```
- HTML / CSS
- JavaScript
- SQL
```


## Frameworks et librairies

### Application cliente

```
- npm
- axios
- bootstrap
- moment
- react
- react-big-calendar
- react-bootstrap
- react-datepicker
- react-dom
- react-modal
- react-router-dom
- react-scripts
- react-select
- reactjs-popup
- web-vitals
```

### API

```
- npm
- dotenv
- express
- mysql2
```

## Prérequis

Pour pouvoir lancer le projet correctement, vous devez créer 2 fichier ```.env``` comme suit:

```client/.env```
```
REACT_APP_HOST=
REACT_APP_PORTSERVER=
```

```server/.env```
```
DATABASE=			//	nom de la base de donnée
PORT=				//	port d'accès de l'api
USER=				//	nom de l'utilisateur de la base de donnée
HOST=				//	nom de l'host de la base de donnée
PASSWORD=			//	mot de passe de la base de donnée
ADDITIONAL_SQL=		//	lien vers un fichier possédant des données de base pour la base de données
```

Vous devez aussi pouvoir avoir accès à un serveur sql fonctionnel ou une base de données accessible.

Une fois tout cela réalisé, lancez 2 terminaux et exécutez les commandes suivantes:

```
cd server
npm install
npm start
```

```
cd client
npm install
npm start
```