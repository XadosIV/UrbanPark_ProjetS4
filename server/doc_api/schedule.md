# Ressource : SCHEDULE

## Json :

```json
{
	"id":1,
	"user":5,
	"parking":"h",
	"date_start":"2023-04-23T18:25:43.511Z",
	"date_end":"2023-04-23T19:25:43.511Z"
}
```

# Endpoint

# GET /api/schedule
> Permission requise : X

> Description : Renvoie un, plusieurs ou tout les créneaux.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| user | L'utilisateur concerné par le créneau | false |
| parking | Le parking du créneau | false |
| date_start | Date de début de créneau | false |
| date_end | Date de fin de créneau | false |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)
* * *
* * *
# POST /api/schedule
> Permission requise : X

> Description : Crée/Ajoute un créneau à la base de donnée.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| user | L'utilisateur concerné par le créneau | true |
| parking | Le parking du créneau | true |
| date_start | Date de début de créneau | true |
| date_end | Date de fin de créneau | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres n'ont pas été donné. |
* * *
* * *
# GET /api/schedule/:schedule
> Permission requise : X

> Description : Renvoie un créneau.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_SCHEDULE_NOT_FOUND | Le créneau n'existe pas dans la base de donnée. |

* * *
* * *
# DELETE /api/schedule/:schedule
> Permission requise : AUTH

> Description : Supprime un créneau.

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_SCHEDULE_NOT_FOUND | Le créneau n'existe pas dans la base de donnée. |

* * *
* * *