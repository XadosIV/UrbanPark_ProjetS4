# Ressource : USER

## Json :
```json
{
	"id":1,
	"first_name":"Jean",
	"last_name":"Dupond",
	"email":"my.email@itsamail.com",
	"id_spot":1, // Can be null
	"id_spot_temp":2,
	"role":"Abonné"
}
```

# Endpoints
* * *
* * *
# GET: /api/user
> Permission requise : X

> Description : Récupère l'utilisateur via son token.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| token | Son token d'authentification | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres requis ne sont pas donnés. |

* * *
* * *

# POST: /api/user
> Permission requise : X

> Description : Crée/Ajoute un utilisateur à la base de donnée.

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

* * *
* * *

# GET: /api/users
> Permission requise : see_other_users

> Description : Renvoie un, plusieurs, ou tout les utilisateurs, selon certains filtres.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| email | Son adresse mail | false |
| role | Son rôle | false |
| first_name | Son prénom | false |
| last_name | Son nom de famille | false |
| token | Son token d'authentification | false |
| id_spot | Numero de sa place | false |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

* * *
* * *

# GET:  /api/users/:user
> Permission requise : see_others_users & AUTH

> Description : Renvoie un utilisateur.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_USER_NOT_FOUND | L'utilisateur n'existe pas dans la base de donnée. |

* * *
* * *

# DELETE: /api/users/:user
> Permission requise : delete_other_user & AUTH

> Description : Supprime un utilisateur.

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_USER_NOT_FOUND | L'utilisateur n'existe pas dans la base de donnée. |

* * *
* * *

# PUT: /api/users/:user
> Permission requise : AUTH / modify_spot_users / modify_role_users

> Description : Modifie certaines informations d'un utilisateur.

#### **Parametres** :

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