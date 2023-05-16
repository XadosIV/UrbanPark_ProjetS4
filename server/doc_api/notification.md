# Ressource : NOTIFICATION

## Json : 
```json
{
	"id":1,
	"id_user":2,
	"action":"POST",
	"type_notif":"réunion",
	"id_schedule":3, // If the notif isn't about a schedule, this one is null
	"type":null, // those fields depict the old version of the schedules
	"id_parking":null,
	"date_start":null,
	"date_end":null
}
```

# Endpoints
* * *
* * *
# GET: /api/notifications
> Permission requise : X

> Description : Renvoie les notifications correspondant aux paramètres.

#### **Parametres / Filtres** 

| Nom     | Description                                      | Requis ? |
| ------- | ------------------------------------------------ | -------- |
| id_user | id de l'utilisateur concerné par la notification | false    |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

* * *
* * *

#### **type_notif**

type_notif peut prendre les valeurs suivantes :
* "Réunion"
* "Nettoyage"
* "Gardiennage"
* "Place temporaire"