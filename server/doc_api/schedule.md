# Ressource : SCHEDULE

## Json :

```json
{
	"id": 1,
	"user": 1,
	"last_name": "Naej",
	"name": "Halles",
	"parking": "H",
	"date_start": "2023-04-14T08:00:00",
	"date_end": "2023-04-14T16:00:00",
	"first_spot":1,
	"last_spot":2
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
| first_spot | Début de la zone sélectionnée | false |
| last_spot | Fin de la zone sélectionnée | false |

X : Un paramètre parmis X peut être définit, les autres doivent ne pas être définits

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_CONFLICTING_PARAMETERS | Un seul champs peut être définit parmis : role, user |
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
| first_spot | Début de la zone sélectionnée | Y |
| last_spot | Fin de la zone sélectionnée | Y |

X : Un paramètre parmis X est requis, les autres doivent ne pas être définits
Y : Si l'un des paramètres est définit, les autres doivent être définits aussi

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres n'ont pas été donnés. |
| E_CONFLICTING_PARAMETERS | Un seul champs doit être définit parmis : role, user |
| E_USER_NOT_FOUND | Le champs `user` a été trouvé et est valide, mais l'utilisateur n'existe pas dans la base de donnée |
| E_ROLE_NOT_FOUND | Le champs `role` a été trouvé et est valide, mais le role n'existe pas dans la base de donnée |
| E_DATETIME_FORMAT_INVALID | L'une des dates en paramètres n'est pas valide. Utiliser le format ISO-8601 |
| E_WRONG_DATETIME_ORDER | La date de fin ne peut pas précéder la date de commencement |
| E_OVERLAPPING_SCHEDULES | Ce créneau est superposé à un autre pour un/des utilisateur(s) saisi(s) |
| E_SPOTS_IN_DIFFERENT_PARKINGS | Les places ne sont pas dans le même parking |
| E_SPOTS_IN_DIFFERENT_FLOORS | Les places sont dans le même parking, mais pas au même étage |
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