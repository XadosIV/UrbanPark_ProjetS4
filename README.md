# Urban Park

Projet L3 réalisé durant le semestre 4, année 2023

## Equipe
- @github/UP-4303
- @github/MagicsssS
- @github/Osteriux
- @github/XadosIV
- @github/Poutchy

## Descritpion

- Une application Web d'un site de parking, possédant un système de gestion des employés du parking (Gardien, Equipe de nettoyage) ainsi que des utilisateurs (Abonnés)
- Une couche API REST permettant de communiquer efficaement avec une base de donnée SQL

## Langages

```
- HTML
- JavaScript
- SQL
```


## Frameworks et Librairies

### Application Cliente

```
- npm
- axios
- bootsrap
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
- react-datepicker
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
ADDITIONAL_SQL=		//	lien vers un fichier possédant des données de bases pour la base de donnée
```

Vous devez aussi pouvoir avoir accès à un serveur sql fonctionnel ou une base de donnée accessible.

Une fois tous cela réaliser, lancez 2 terminaux et executez les commandes suivantes:

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