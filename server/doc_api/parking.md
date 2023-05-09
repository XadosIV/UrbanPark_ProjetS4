# Ressource : PARKING

## Json : 
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

# Endpoints
* * *
* * *
# GET: /api/parkings
> Permission requise : X

> Description : Renvoie un, plusieurs, ou tout les parkings, selon certains filtres.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| name | Le nom du parking | false |
| floors | Tout les parkings ayant X étages | false |
| id_spot | Le parking contenant la place donnée. | false |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

* * *
* * *

# POST: /api/parkings
> Permission requise : X

> Description : Crée/Ajoute un parking à la base de donnée.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| id | Son identifiant (souvent le premier caractère de son nom) | true |
| name | Le nom complet du parking | true |
| floors | Son nombre d'étages | true |
| address | Son adresse physique | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres requis ne sont pas donnés. |

* * *
* * *

# GET:  /api/parking/:parking
> Permission requise : X

> Description : Renvoie un parking.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_PARKING_NOT_FOUND | Le parking n'existe pas dans la base de donnée. |

* * *
* * *

# DELETE: /api/parking/:parking
> Permission requise : AUTH

> Description : Supprime un parking et toutes ses places.

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_PARKING_NOT_FOUND | Le parking n'existe pas dans la base de donnée. |

* * *
* * *

# PUT: /api/parking/:id
> Permission requise : AUTH

> Description : Modifie certaines informations d'un parking.

#### **Parametres** :

| Name | Description | Required? | 
| ---- | ----------- | --------- | 
| name | Pour renommer le parking | false | 
| floor | Modifier son nombre d'étages | false | 
| address | Modifier son adresse | false |

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_PARKING_NOT_FOUND | Le parking n'existe pas dans la base de donnée. |
| E_MISSING_PARAMETER | La requête nécessite au minimum un paramètre à modifier |

* * *
* * *