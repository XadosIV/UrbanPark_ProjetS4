# Ressources

## User

```json
{
	"id":1,
	"first_name":"Jean",
	"name":"Dupond",
	"email":"my.email@itsamail.com",
	"id_place":1, // Can be null
	"role":"Abonné",
	"permissions":{
		// NY... Fully modelized.
	}
}
```

## Parking

```json
{
	"id":"h",
	"name":"Halles",
	"floors":1,
	"address":"5 rue Cpavré, 73000 Chambéry",
	"spots":[
		// See : Ressources - Spot
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
	"types":[
		// See : Ressources - Type
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

# Endpoints

## User

| Method | Endpoint      | Ressource | Description                      | Permission              |
| ------ | ------------- | --------- | -------------------------------- | ----------------------- |
| POST   | /users        | User      | Create a new user                |                         |
| GET    | /users        | User      | Get an array of all users        | see_other_users         |
|        |               |           | Get user for auth key            | AUTH                    |
| GET    | /users/:user  | User      | Get a user                       | see_other_users AUTH    | 
| PUT    | /users/:user  | User      | Modify informations about a user | AUTH                    |
|        |               |           | Modify the spot of a user        | modify_spot_users       |
|        |               |           | Modify the role of a user        | modify_role_users       |
| DELETE | /users/:user  | User      | Delete a user                    | delete_other_users AUTH |
| ------ | ------------- | --------- | -------------------------------- | ----------------------- |

# Permissions

| Permission         | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| AUTH               | It's not really a permission. You need to be authentified as a special account, or meet another requirement |
| see_other_users    | You can  see information of any user                                                                        |
| modify_spot_users  | You can modify spot attribution of any user                                                                 |
| modify_role_users  | You can modify role - and permissions - of any user                                                         |
| delete_other_users | You can delete any user                                                                                     |