# Ressources

> All formats used by the API.

## Auth

```json
{
	"token":"string_max_20_charac"
}
```

## User

```json
{
	"id":1,
	"first_name":"Jean",
	"last_name":"Dupond",
	"email":"my.email@itsamail.com",
	"id_place":1, // Can be null
	"role":"Abonné"
}
```

## Parking

```json
{
	"id":"h",
	"name":"Halles",
	"floors":1,
	"address":"5 rue Cpavré, 73000 Chambéry",
	"spots":[ // See : Ressources - Spot
		1,
		2,
		4
	]
}
```

## Spot

```json
{
	"id":1,
	"number":3,
	"floor":0,
	"id_parking":2,
	"id_user":1,
	"types":[ // See : Ressources - Type
		1,
		3
	]
}
```

## Schedule

```json
{
	"id":1,
	"user":5,
	"parking":"h",
	"date_start":"2023-04-23T18:25:43.511Z",
	"date_end":"2023-04-23T19:25:43.511Z"
}
```

## Reservation

```json
{
	"id":7,
	"user":1,
	"date_start":"2022-3-20T12:03:13Z",
	"date_end":"2022-5-04T04:12:59Z"
}
```

## Type

```json
{
	"name":"électrique"
}
```

## Role

```json
{
	"id":"Abonné",
	"see_other_users":false,
	"modify_spot_users":false,
	"modify_role_users":false,
	"delete_other_users":false
}
```

## Errors

```json
{
	"code":"E_EXAMPLE",
	"message":"Le code est une chaine de caractères ayant une correspondance dans errors.js. Le message doit être compréhensible par un humain !"
}
```

# Permissions

> Permissions are determined by your role.

| Permission         | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| AUTH               | It's not really a permission. You need to be authentified as a special account, or meet another requirement |
| see_other_users    | You can  see information of any user                                                                        |
| modify_spot_users  | You can modify spot attribution of any user                                                                 |
| modify_role_users  | You can modify role - and permissions - of any user                                                         |
| delete_other_users | You can delete any user                                                                                     |

* * *
* * *

# Endpoints



## /api/auth

> Ressource : AUTH
>
> Permission requise : X

### Requête : GET

> Description : Renvoie le token d'un utilisateur  via son mail et son mot de passe

#### **Parametres**

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| email | Son adresse mail | true |
| password | Son mot de passe | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres requis ne sont pas donnés. |
| E_UNDEFINED_USER | Le mail demandé n'appartient à aucun compte enregistré. |
| E_WRONG_PASSWORD | Le mot de passe mis en paramètre ne correspond pas au mot de passe du compte. |


* * *
* * *

## /api/users

> Ressource : [User]
>
> Permission requise : see_other_users

### Requête : GET

> Description : Renvoie un, plusieurs, ou tout les utilisateurs, selon certains filtres.

#### **Parametres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| email | Son adresse mail | false |
| role | Son rôle | false |
| first_name | Son prénom | false |
| last_name | Son nom de famille | false |
| token | Son token d'authentification | false |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

* * *
* * *

## /api/users/:user

> Ressource : User
>
> Permission requise : see_others_users & AUTH

### Requête : GET

> Description : Renvoie un utilisateur.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_USER_NOT_FOUND | L'utilisateur n'existe pas dans la base de donnée. |


### Requête : DELETE

> Description : Supprime un utilisateur.

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_USER_NOT_FOUND | L'utilisateur n'existe pas dans la base de donnée. |


### Requête : PUT

> Description : Modifie certaines informations d'un utilisateur.

#### **Parametres**

| Name | Description | Required? | Permission |
| ---- | ----------- | --------- | ---------- |
| email | Son adresse mail | false | AUTH |
| password | Son mot de passe | false | AUTH |
| first_name | Son prénom | false | AUTH |
| last_name | Son nom de famille | false | AUTH |
| role | Son rôle | false | modify_role_users |
| token | Son token d'authentification | false | AUTH |
| id_spot | Son numéro de place | false | modify_spot_users |
| id_spot_temp | Son numéro de place temporaire | false | modify_spot_users |

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_USER_NOT_FOUND | L'utilisateur n'existe pas dans la base de donnée. |
| E_MISSING_PARAMETER | La requête nécessite au minimum un paramètre à modifier |

* * *
* * *

## /api/user

> Ressource : User
>
> Permission requise : X

### Requête GET

> Description : Récupère l'utilisateur via son token.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| token | Son token d'authentification | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres requis ne sont pas donnés. |

### Requête POST

> Description : Crée/Ajoute un utilisateur à la base de données.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| email | Son adresse mail | true |
| password | Son mot de passe | true |
| first_name | Son prénom | true |
| last_name | Son nom de famille | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres requis ne sont pas donnés. |
| E_EMAIL_FORMAT_INVALID | Le mail n'a pas le bon format. |
| E_PASSWORD_FORMAT_INVALID | Le mot de passe ne respecte pas les restrictions imposées. |
| E_EMAIL_ALREADY_USED | Un utilisateur possède déjà cette adresse mail. |
