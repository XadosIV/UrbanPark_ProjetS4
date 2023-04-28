const express = require('express');
const app = express();
const {GetToken} = require('./db_access/auth')
const {GetUsers, PostUser, GetUserFromToken, DeleteUser, UpdateUser} = require('./db_access/user');
const {GetParkings, PostParking} = require('./db_access/parking');
const {GetSpotTypes, PostSpotType} = require('./db_access/spot_type');
const {GetSchedules, PostSchedule, UpdateSchedule, GetScheduleById, DeleteSchedule} = require('./db_access/schedule');
const {GetSpots, PostSpot} = require('./db_access/spot')
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
	next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
	let data = ["test1","test2","test3"];
	res.status(200).json(data);
});

app.get('/api/auth', (req, res) => {
	console.log("Request at GET /api/auth : " + JSON.stringify(req.query));
	GetToken((err, token) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(token);
		}
	}, req.query);
});


app.get('/api/users', (req, res) => {
	console.log("Request at GET /api/users : " + JSON.stringify(req.query));
	GetUsers((err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.get('/api/users/:id', (req, res) => {
	if (parseInt(req.params.id)){
		GetUsers((err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.length == 1){
					res.status(200).json(data[0]);
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		}, {id: req.params.id});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
});

app.delete('/api/users/:id', (req, res) => {
	console.log(req.params.id)
	if (parseInt(req.params.id)){
		DeleteUser((err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.affectedRows == 1){
					res.status(200).json();
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		}, parseInt(req.params.id));
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
});

app.put('/api/users/:id', (req, res) => {
	req.body.id = req.params.id;
	UpdateUser((err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json();
		}
	}, req.body);
});

app.get('/api/user', (req, res) => {
	console.log("Request at GET /api/user : " + JSON.stringify(req.query));
	GetUserFromToken((err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.post('/api/user', (req, res) => {
	console.log("Request at POST /api/user : " + JSON.stringify(req.body));
	if (req.body && req.body.first_name && req.body.last_name && req.body.email && req.body.password){
		PostUser((err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json();
			}
		}, req.body);
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : first_name, last_name, email, password"});
	}
});

app.get('/api/parkings', (req, res) => {
	console.log("Request at GET /api/parkings : " + JSON.stringify(req.query));
	GetParkings((err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	}, req.query);
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

app.get('/api/types', (req, res) => {
	console.log("Request at GET /api/types : " + JSON.stringify(req.query));
	GetSpotTypes((err, data) => {
		if (err){ 
			Errors.HandleError(err, res)
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.post('/api/types', (req, res) => {
	console.log("Request at POST /api/types : " + JSON.stringify(req.body));
	if (req.body && req.body.name){
		PostSpotType((err, data) => {
			if (err){
				if (err.code == Errors.E_SPOT_TYPE_ALREADY_EXIST){
					res.status(400).json({"code":err.code,"message":"Type de place déjà existant"});
				}else if (err.code == Errors.E_SPOT_TYPE_FORMAT_INVALID){
					res.status(400).json({"code":err.code,"message":"Le format du type de place n'est pas conforme"});
				}else{ // Not generated by us
					console.error(err);
					res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
				}
			}else{
				res.status(200).json();
			}
		}, req.body);
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : name"});
	}
});

app.get('/api/spots', (req, res) => {
	console.log("Request at GET /api/spots : " + JSON.stringify(req.query));
	GetSpots((err, data) => {
		if (err){ 
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.get('/api/spot/:spot', (req, res) => {
	console.log("Request at GET /api/spot/:spot : " + JSON.stringify(req.query));
	if (parseInt(req.params.spot)){
		GetSpots((err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.length == 0){
					res.status(200).json(data[0]);
				}else{
					res.status(400).json({"code":Errors.E_SPOT_NOT_FOUND, "message":"Aucune place n'a l'id demandé."})
				}
			}
		}, {id: parseInt(req.params.spot)});
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
});

app.post('/api/spot', (req, res) => {
	console.log("Request at POST /api/spot : " + JSON.stringify(req.body));
	if (req.body && !isNaN(req.body.number) && !isNaN(req.body.floor) && req.body.id_park){
		PostSpot((err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json();
			}
		}, req.body);
	}else{
		res.status(400).json({"code":Errors.E_MISSING_PARAMETER,"message":"Champs obligatoires : number, floor, id_park"});
	}
});

// TODO
// [ deprecated ] à changer vers /role/:role
app.get('/api/role', (req, res) => {
	//console.log("Request at GET /api/role : " + JSON.stringify(req.query));
	GetPermRole((err, data) => {
		if (err){
			Errors.HandleError(err, res)
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.get('/api/schedules', (req, res) => {
	//console.log("Request at GET /api/schedules : " + JSON.stringify(req.query));
	GetSchedules((err, data) => {
		if (err){
			Errors.HandleError(err, res);
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.post('/api/schedule', (req, res) => {
	//console.log("Request at POST /api/schedule : " + JSON.stringify(req.body));
	if (req.body && (!!req.body.role ^ req.body.user) && req.body.parking && req.body.date_start && req.body.date_end && (isNaN(req.body.first_spot) == isNaN(req.body.last_spot))){
		PostSchedule(req.body, (err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json();
			}
		});
	}else{
		res.status(400).json({"code":Errors.E_MISSING_PARAMETER,"message":"Champs obligatoires : user*, parking, date_start, date_end. * : Un seul de ces paramètres est requis, les autres ne doivent pas être définis. Champs optionels : first_spot**, last_spot**. ** : Si l'un des paramètres est définit, les autres doivent être définits aussi"});
	}
});

app.get('/api/schedule/:id', (req, res) => {
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
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
})

app.put('/api/schedule/:id', (req, res) => {
	req.body.id = req.params.id;
	if (req.body && (req.body.user || req.body.parking || req.body.date_start || req.body.date_end)){
		UpdateSchedule(req.body, (err, data) => {
			if (err){
				Errors.HandleError(err, res);
			}else{
				res.status(200).json()
			}
		})
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Un parmi user, parking, date_start, date_end doit être défini."})
	}
})

app.delete('/api/schedule/:id', (req, res) => {
	console.log(req.params.id)
	if (parseInt(req.params.id)){
		DeleteSchedule((err, data) => {
			if (err){ 
				Errors.HandleError(err, res);
			}else{
				if (data.affectedRows == 1){
					res.status(200).json();
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		}, parseInt(req.params.id));
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
});

module.exports = app;