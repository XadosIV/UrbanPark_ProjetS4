# Ressource : SPOT

## Json :
```json
{
	"id":1,
	"number":3,
	"floor":0,
	"id_park":"h",
	"id_user":1,
	"types":[ // See : Ressources - Type
		1,
		3
	]
}
```

# Endpoint
* * *
* * *

# GET /api/spots
> Permission requise : X

> Description : Renvoie une, plusieurs ou toutes les places selon certains filtres.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| number | Le numéro de la place. | false |
| floor | L'étage de la place. | false |
| parking | Le parking dans lequel se trouve la place. | false |
| user | L'utilisateur ayant la place. | false |
| type | Le type de place. | false |
#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

* * *
* * *
# POST /api/spots
> Permission requise : X

> Description : Crée/Ajoute une place à la base de donnée.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| number | Le numero de la place | true |
| floor | L'étage de la place. | true |
| parking | Le parking où se trouve la place. | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres n'ont pas été donné. |

* * *
* * *

# GET /api/spot/:spot
> Permission requise : X

> Description : Renvoie une place.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_SPOT_NOT_FOUND | La place n'existe pas dans la base de donnée. |

* * *
* * *
# DELETE /api/spot/:spot
> Permission requise : AUTH

> Description : Supprime une place.

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_SPOT_NOT_FOUND | La place n'existe pas dans la base de donnée. |

* * *
* * *
# PUT /api/spot/:spot
> Permission requise : AUTH

> Description : Modifie la place ou lui ajoute/retire un type.

#### **Parametres** :

| Name | Description | Required? | 
| ---- | ----------- | --------- | 
| number | Nouveau numero de la place. | false | 
| floor | Nouvel étage de la place. | false |
| parking | Nouveau parking de la place. | false |
| user | Nouveau abonné de la place. | false |
| add_type | Type à ajouter à la place. | false |
| del_type | Type à retirer de la place. | false |

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_SPOT_NOT_FOUND | La place n'existe pas dans la base de donnée. |
| E_MISSING_PARAMETER | Au moins un paramètre est nécessaire. |
| E_SPOT_EXISTING_TYPE | Le type à ajouter appartient déjà à la place |
| E_SPOT_NOT_EXISTING_TYPE | Le type à supprimer de la place n'est pas attribué à celle-ci. |

* * *
* * *