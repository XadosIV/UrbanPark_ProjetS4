# Ressources

> All formats used by the client.

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
	"types":[
		"electrique", "handicapé"
	]
}
```

## Schedule

```json
{
	"id":1,
	"user":5,
	"parking":"h",
	"date_start":"2023-04-23T18:25:43.511Z",
	"date_end":"2023-04-23T19:25:43.511Z"
}
```

## Reservation

```json
{
	"id":7,
	"user":1,
	"date_start":"2022-3-20T12:03:13Z",
	"date_end":"2022-5-04T04:12:59Z"
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