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

# GET /api/schedules
> Permission requise : X

> Description : Renvoie un, plusieurs ou tout les créneaux.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| role | Le rôle concerné par le créneau | X |
| user | L'utilisateur concerné par le créneau | X |
| parking | Le parking du créneau | false |
| date_start | Date de début de créneau | false |
| date_end | Date de fin de créneau | false |

X : Un paramètre parmis X peut être définit, les autres doivent ne pas être définits

#### **Erreurs**
<<<<<<< HEAD
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

=======

| Nom | Cause |
| --- | ----- |
| E_CONFLICTING_PARAMETERS | Un seul champs peut être définit parmis : role, user |
>>>>>>> origin/p-test
* * *
* * *
# POST /api/schedules
> Permission requise : X

> Description : Crée/Ajoute un créneau à la base de donnée.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| role | Le rôle concerné par le créneau | X |
| user | L'utilisateur concerné par le créneau | X |
| parking | Le parking du créneau | true |
| date_start | Date de début de créneau | true |
| date_end | Date de fin de créneau | true |

X : Un paramètre parmis X est requis, les autres doivent ne pas être définits

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres n'ont pas été donnés. |
| E_CONFLICTING_PARAMETERS | Un seul champs doit être définit parmis : role, user |

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