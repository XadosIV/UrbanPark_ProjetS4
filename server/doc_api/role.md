# Ressource : ROLE

## JSON : 
```json
{
	"id":"Abonné",
	"see_other_users":false,
	"modify_spot_users":false,
	"modify_role_users":false,
	"delete_other_users":false
}
```

# Endpoint

# GET /api/role
> Permission requise : X

> Description : Renvoie tout les roles ou recherche un role par permission.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| see_other_users | Le role a cette permission ou non. | false |
| modify_spot_users | Le role a cette permission ou non. | false |
| modify_role_users | Le role a cette permission ou non. | false |
| delete_other_users | Le role a cette permission ou non. | false |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)
* * *
* * *
# POST /api/role
> Permission requise : X

> Description : Crée/Ajoute un role à la base de donnée.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| id | Le nom du role | true |
| see_other_users | Le role a cette permission ou non. | true |
| modify_spot_users | Le role a cette permission ou non. | true |
| modify_role_users | Le role a cette permission ou non. | true |
| delete_other_users | Le role a cette permission ou non. | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Tout les paramètres n'ont pas été donné. |
* * *
* * *
# GET /api/role/:role
> Permission requise : X

> Description : Renvoie un role.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_ROLE_NOT_FOUND | Le role n'existe pas dans la base de donnée. |

* * *
* * *
# DELETE /api/role/:role
> Permission requise : AUTH

> Description : Supprime un role et le retire de tout les utilisateurs (deviennent automatiquement abonnés? / Null).

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_ROLE_NOT_FOUND | Le role n'existe pas dans la base de donnée. |

* * *
* * *
# PUT /api/role/:role
> Permission requise : AUTH

> Description : Modifie le nom du role ou ses permissions.

#### **Parametres** :

| Name | Description | Required? | 
| ---- | ----------- | --------- | 
| id | Nouveau nom du role | false | 
| see_other_users | Le role a cette permission ou non. | false |
| modify_spot_users | Le role a cette permission ou non. | false |
| modify_role_users | Le role a cette permission ou non. | false |
| delete_other_users | Le role a cette permission ou non. | false |

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_ROLE_NOT_FOUND | Le role n'existe pas dans la base de donnée. |
| E_MISSING_PARAMETER | Au moins un paramètre est nécessaire. |

* * *
* * *