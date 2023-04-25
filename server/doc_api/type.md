# Ressource : TYPE

## Json : 
```json
{
	"name":"électrique"
}
```

# Endpoint
* * *
* * *

# GET /api/types
> Permission requise : X

> Description : Renvoie tout les types ou recherche un type par nom.

#### **Parametres / Filtres** 

| Nom | Description | Requis? |
| ---- | ----------- | --------- |
| name | Le nom du type | false |

#### **Erreurs**
Aucune (Tableau vide si la recherche n'a donné aucun résultat.)

* * *
* * *
# POST /api/types
> Permission requise : X

> Description : Crée/Ajoute un type à la base de donnée.

#### **Parametres**

| Name | Description | Required? |
| ---- | ----------- | --------- |
| name | Le nom du type | true |

#### **Erreurs**

| Nom | Cause |
| --- | ----- |
| E_MISSING_PARAMETER | Le nom du type n'a pas été donné. |

* * *
* * *
# GET /api/type/:type
> Permission requise : X

> Description : Renvoie un type.

#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_TYPE_NOT_FOUND | Le type n'existe pas dans la base de donnée. |

* * *
* * *

# DELETE /api/type/:type
> Permission requise : AUTH

> Description : Supprime un type.

> Renvoie : Booleen (Opération réussie ?)
#### **Parametres** : X

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_TYPE_NOT_FOUND | Le type n'existe pas dans la base de donnée. |

* * *
* * *
# PUT /api/type/:type
> Permission requise : AUTH

> Description : Modifie le nom du type.

#### **Parametres** :

| Name | Description | Required? | 
| ---- | ----------- | --------- | 
| name | Nouveau nom du type | false | 

#### **Erreurs** :

| Nom | Cause |
| --- | ----- |
| E_TYPE_NOT_FOUND | Le type n'existe pas dans la base de donnée. |
| E_MISSING_PARAMETER | Le nom du type n'a pas été donné. |

* * *
* * *