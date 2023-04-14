# Ressource : AUTH

## Json : 

```json
{
	"token":"string_max_20_charac"
}
```

# Endpoints
* * *
* * *
# GET /api/auth
> Permission requise : X

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