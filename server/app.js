const express = require('express');
const app = express();
const {GetToken} = require('./db_access/auth')
const {GetUsers, PostUser, GetUserFromToken, DeleteUser, UpdateUser} = require('./db_access/user');

const {GetParkings, PostParking, PutParkings, DeleteParking} = require('./db_access/parking');
const {GetSpotTypes, PostSpotType} = require('./db_access/spot_type');

const {GetSchedules, PostSchedule, UpdateSchedule, GetScheduleById, DeleteSchedule} = require('./db_access/schedule');
const {GetSchedulesAvailable} = require('./db_access/reunion');
const {GetSpots, PostSpot, UpdateSpot, DeleteSpot} = require('./db_access/spot')

const {GetPermRole} = require('./db_access/role');
const Errors = require('./errors');

// Default headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        req.token=req.headers.authorization.split(' ')[1];
	}
	Object.keys(req.query).forEach((key)=>{
		if (req.query[key] == '\x00'){
			req.query[key] = 'NULL';
		}
	});
	Object.keys(req.body).forEach((key)=>{
		if (req.body[key] == '\x00'){
			req.body[key] = null;
		}
	});
	next();
});

app.get('/api/auth', (req, res) => {
	//console.log("Request at GET /api/auth : " + JSON.stringify(req.query));
	GetToken(req.query, (err, token) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(token);
		}
	});
});


app.get('/api/users', (req, res) => {
	//console.log("Request at GET /api/users : " + JSON.stringify(req.query));
	GetUsers(req.query, (err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	});
});

app.get('/api/users/:id', (req, res) => {
	if (parseInt(req.params.id)){
		GetUsers({id: req.params.id}, (err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.length == 1){
					res.status(200).json(data[0]);
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id doit être un nombre"});
	}
});

app.delete('/api/users/:id', (req, res) => {
	if (parseInt(req.params.id)){
		DeleteUser(parseInt(req.params.id), (err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.affectedRows == 1){
					res.status(200).json();
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id doit être un nombre"});
	}
});

app.put('/api/users/:id', (req, res) => {
	req.body.id = req.params.id;
	UpdateUser(req.body, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	});
});

app.get('/api/user', (req, res) => {
	//console.log("Request at GET /api/user : " + JSON.stringify(req.query));
	GetUserFromToken(req.query, (err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	});
});

app.post('/api/user', (req, res) => {
	//console.log("Request at POST /api/user : " + JSON.stringify(req.body));
	if (req.body && req.body.first_name && req.body.last_name && req.body.email && req.body.password){
		PostUser(req.body, (err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json();
			}
		});
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : first_name, last_name, email, password"});
	}
});

app.get('/api/parkings', (req, res) => {
	//console.log("Request at GET /api/parkings : " + JSON.stringify(req.query));
	GetParkings(req.query, (err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	});
});

app.put('/api/parkings/:id', (req, res) => {
	//console.log("Request at PUT /api/parkings : " + JSON.stringify(req.body) + " and " + JSON.stringify(req.params));
	req.body.id = req.params.id;
	PutParkings(req.body, (err,data) => {
		if (err){ // Not generated by us
			Errors.HandleError(err, res);
		}else{
			res.status(200).json();
		}
	});
});

app.post('/api/parking', (req, res) => {
	PostParking(req.body, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json();
		}
	})
});

app.delete('/api/parking/:id', (req, res) => {
	DeleteParking(req.params, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json();
		}
	});
});

app.get('/api/types', (req, res) => {
	//console.log("Request at GET /api/types : " + JSON.stringify(req.query));
	GetSpotTypes(req.query, (err, data) => {
		if (err){ 
			Errors.HandleError(err, res)
		}else{
			res.status(200).json(data);
		}
	});
});

app.post('/api/types', (req, res) => {
	//console.log("Request at POST /api/types : " + JSON.stringify(req.body));
	if (req.body && req.body.name){
		PostSpotType(req.body, (err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json();
			}
		});
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : name"});
	}
});

app.get('/api/spots', (req, res) => {
	// console.log("Request at GET /api/spots : " + JSON.stringify(req.query));
	GetSpots(req.query, (err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	});
});

app.get('/api/spot/:spot', (req, res) => {
	//console.log("Request at GET /api/spot/:spot : " + JSON.stringify(req.params));
	if (parseInt(req.params.spot)){
		GetSpots({id: parseInt(req.params.spot)}, (err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.length == 1){
					res.status(200).json(data[0]);
				}else{
					res.status(400).json({"code":Errors.E_SPOT_NOT_FOUND, "message":"Aucune place n'a l'id demandé."})
				}
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id doit être un nombre"});
	}
});

app.post('/api/spot', (req, res) => {
	//console.log("Request at POST /api/spot : " + JSON.stringify(req.body));
	if (req.body && !isNaN(req.body.number) && !isNaN(req.body.floor) && req.body.id_park){
		PostSpot(req.body, (err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json();
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_MISSING_PARAMETER,"message":"Champs obligatoires : number, floor, id_park"});
	}
});

app.put('/api/spot/:id', (req, res) => {
	req.body.id = req.params.id
	UpdateSpot(req.body, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json();
		}
	})
})

app.delete('/api/spot/:id', (req, res) => {
	//console.log("Request at DELETE /api/post/:id : " + JSON.stringify(req.query));
	if (parseInt(req.params.id)){
		DeleteSpot(parseInt(req.params.id), (err, data)=>{
			if (err){
				console.log(err);
				res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
			} else {
				res.status(200).json();
			}
		})
	}else{
		res.status(400).json({"code":Errors.E_MISSING_PARAMETER,"message":"Champs obligatoires : id"});
	}
})

// TODO
// [ deprecated ] à changer vers /role/:role
app.get('/api/role', (req, res) => {
	//console.log("Request at GET /api/role : " + JSON.stringify(req.query));
	GetPermRole(req.query, (err, data) => {
		if (err){
			Errors.HandleError(err, res)
		}else{
			res.status(200).json(data);
		}
	});
});

app.get('/api/schedules', (req, res) => {
	//console.log("Request at GET /api/schedules : " + JSON.stringify(req.query));
	GetSchedules(req.body, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	});
});

app.post('/api/schedule', (req, res) => {
	//console.log("Request at POST /api/schedule : " + JSON.stringify(req.body));
	PostSchedule(req.body, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	})
});

app.get('/api/schedules/:id', (req, res) => {
	if (parseInt(req.params.id)){
		GetScheduleById(req.params.id, (err, data) => {
			if (err){ // Not generated by us
				Errors.HandleError(err, res);
			}else{
				if (data.length == 1){
					res.status(200).json(data[0]);
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun créneau n'a l'identifiant demandé."});
				}
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id doit être un nombre"});
	}
})

app.put('/api/schedules/:id', (req, res) => {
	req.body.id = req.params.id;
	UpdateSchedule(req.body, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json()
		}
	})
})

app.delete('/api/schedule/:id', (req, res) => {
	//console.log(req.params.id)
	if (parseInt(req.params.id)){
		DeleteSchedule(parseInt(req.params.id), (err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.affectedRows == 1){
					res.status(200).json();
				}else{
					res.status(400).json({"code":Errors.E_SCHEDULE_NOT_FOUND,"message":"Aucun créneau n'a l'identifiant demandé."});
				}
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id doit être un nombre"});
	}
});

app.get('/api/reunion', (req, res) => {
	// req.body
	GetSchedulesAvailable(req.query, (err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			console.log(data)
			res.status(200).json(data);
		}
	})
})

module.exports = app;