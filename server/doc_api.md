# Ressources

> All formats used by the API.

## Auth

```json
{
	"token":"string_max_20_charac"
}
```

## User

```json
{
	"id":1,
	"first_name":"Jean",
	"name":"Dupond",
	"email":"my.email@itsamail.com",
	"id_place":1, // Can be null
	"role":"Abonné"
}
```

## Parking

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

## Spot

```json
{
	"id":1,
	"number":3,
	"floor":0,
	"id_parking":2,
	"id_user":1,
	"types":[ // See : Ressources - Type
		1,
		3
	]
}
```

## Schedule

```json
{
	// NYI
}
```

## Reservation

```json
{
	// NYI
}
```

## Type

```json
{
	// NYI
}
```

## Role

```json
{
"id":"Abonné",
	"see_other_users":false,
	"modify_spot_users":false,
	"modify_role_users":false,
	"delete_other_users":false
}
```

# Endpoints

> You can access the API by these URIs. Or not.

## Auth

| Method | Endpoint      | Ressource | Description                      | Permission              |
| ------ | ------------- | --------- | -------------------------------- | ----------------------- |
| GET    | /auth         | AUTH      | Get token of the user for auth   |                         |
|		 |				 |			 | mail=$mail&mdp=$mdp_md5			|						  |
| ------ | ------------- | --------- | -------------------------------- | ----------------------- |

## User

| Method | Endpoint      | Ressource | Description                      | Permission              |
| ------ | ------------- | --------- | -------------------------------- | ----------------------- |
| GET    | /user         | User      | Get user for auth key            | AUTH                    |
| POST   | /users        | User      | Create a new user                |                         |
| GET    | /users        | User      | Get an array of all users        | see_other_users         |
| GET    | /users/:user  | User      | Get a user                       | see_other_users AUTH    | 
| PUT    | /users/:user  | User      | Modify informations about a user | AUTH                    |
|        |               |           | Modify the spot of a user        | modify_spot_users       |
|        |               |           | Modify the role of a user        | modify_role_users       |
| DELETE | /users/:user  | User      | Delete a user                    | delete_other_users AUTH |
| ------ | ------------- | --------- | -------------------------------- | ----------------------- |

# Permissions

> Permissions are determined by your role.

| Permission         | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| AUTH               | It's not really a permission. You need to be authentified as a special account, or meet another requirement |
| see_other_users    | You can  see information of any user                                                                        |
| modify_spot_users  | You can modify spot attribution of any user                                                                 |
| modify_role_users  | You can modify role - and permissions - of any user                                                         |
| delete_other_users | You can delete any user                                                                                     |