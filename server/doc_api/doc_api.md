# Permissions

> Permissions are determined by your role.

| Permission | Description|
| ------------------ | ---- |
| AUTH | It's not really a permission. You need to be authentified as a special account, or meet another requirement |
| see_other_users | You can  see information of any user |
| modify_spot_users | You can modify spot attribution of any user |
| modify_role_users | You can modify role - and permissions - of any user |
| delete_other_users | You can delete any user |

# Erreurs

```json
{
	"code":"E_EXAMPLE",
	"message":"Le code est une chaine de caractères ayant une correspondance dans errors.js. Le message doit être compréhensible par un humain !"
}
```

Liste des noms d'erreurs : 
* E_MISSING_PARAMETER : Tout les paramètres n'ont pas été donné.
* E_EMAIL_FORMAT_INVALID : Le mail n'a pas le bon format. 
* E_PASSWORD_FORMAT_INVALID : Le mot de passe ne respecte pas les restrictions imposées. 
* E_EMAIL_ALREADY_USED : Un utilisateur possède déjà cette adresse mail. 
* E_UNDEFINED_USER : Le mail demandé n'appartient à aucun compte enregistré. 
* E_WRONG_PASSWORD : Le mot de passe ne correspond pas à l'email.
* E_CONFLICTING_PARAMETERS : Des paramètres se contredisent. Un ou plusieurs d'entre eux ne devraient pas être définits.
* E_SPOT_EXISTING_TYPE : Le type à ajouter appartient déjà à la place 
* E_SPOT_NOT_EXISTING_TYPE : Le type à supprimer de la place n'est pas attribué à celle-ci. 
* E_ROLE_NOT_FOUND : Le role n'existe pas dans la base de donnée. 
* E_SPOT_NOT_FOUND : La place n'existe pas dans la base de donnée. 
* E_TYPE_NOT_FOUND : Le type n'existe pas dans la base de donnée. 
* E_PARKING_NOT_FOUND : Le parking n'existe pas dans la base de donnée. 
* E_USER_NOT_FOUND : L'utilisateur n'existe pas dans la base de donnée. 
* E_SCHEDULE_NOT_FOUND : Le créneau n'existe pas dans la base de donnée. 