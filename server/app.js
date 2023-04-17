const express = require('express');
const app = express();
const {GetToken} = require('./db_access/auth')
const {GetUsers, PostUser, GetUserFromToken, DeleteUser, UpdateUser} = require('./db_access/user');
const {GetParkings} = require('./db_access/parking');
const {GetSpotTypes} = require('./db_access/spot_types');
const {GetSpots, PostSpot} = require('./db_access/spot')
const {GetPermRole} = require("./db_access/role");
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
	if (req.query && req.query.email && req.query.password){
		GetToken((err, token) => {
			if (err){
				if (err.code == Errors.E_UNDEFINED_USER){
					res.status(400).json({"code":err.code, "message":"Aucun compte n'est inscrit avec cet email."});
				}else if (err.code == Errors.E_WRONG_PASSWORD){
					res.status(401).json({"code":err.code, "message":"Le mot de passe et l'email ne correspondent pas"});
				}else{ // Not generated by us
					console.error(err);
					res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
				}
			}else{
				res.status(200).json(token);
			}
		}, req.query);
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : email, password"});
	}
});

app.get('/api/users', (req, res) => {
	console.log("Request at GET /api/users : " + JSON.stringify(req.query));
	GetUsers((err, data) => {
		if (err){ // Not generated by us
			console.error(err);
			res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.get('/api/users/:id', (req, res) => {
	if (parseInt(req.params.id)){
		GetUsers((err, data) => {
			if (err){ // Not generated by us
				console.error(err);
				res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
			}else{
				if (data.length == 1){
					res.status(200).json(data[0]);
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		}, {id: req.params.id})
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
})

app.delete('/api/users/:id', (req, res) => {
	console.log(req.params.id)
	if (parseInt(req.params.id)){
		DeleteUser((err, data) => {
			if (err){ // Not generated by us
				console.error(err);
				res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
			}else{
				if (data.affectedRows == 1){
					res.status(200).json()
				}else{
					res.status(400).json({"code":Errors.E_USER_NOT_FOUND,"message":"Aucun utilisateur n'a l'identifiant demandé."});
				}
			}
		}, parseInt(req.params.id))
	}else{
		res.status(400).json({"code":Errors.E_WRONG_PARAMETER,"message":"id must be an integer"});
	}
})

app.put('/api/users/:id', (req, res) => {
	req.body.id = req.params.id;
	UpdateUser((err, data) => {
		if (err){
			if (err.code == Errors.E_EMAIL_ALREADY_USED){
				res.status(400).json({"code":err.code,"message":"Email déjà utilisé"});
			}else if (err.code == Errors.E_EMAIL_FORMAT_INVALID){
				res.status(400).json({"code":err.code,"message":"Le format de l'email n'est pas conforme"});
			}else if (err.code == Errors.E_PASSWORD_FORMAT_INVALID){
				res.status(400).json({"code":err.code,"message":"Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule, un chiffre et un charactère spécial"})
			}else{ // Not generated by us
				console.error(err);
				res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
			}
		}else{
			res.status(200).json();
		}
	}, req.body)
})

app.get('/api/user', (req, res) => {
	console.log("Request at GET /api/user : " + JSON.stringify(req.query));
	GetUserFromToken((err, data) => {
		if (err){ // Not generated by us
			console.error(err);
			res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
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
				if (err.code == Errors.E_EMAIL_ALREADY_USED){
					res.status(400).json({"code":err.code,"message":"Email déjà utilisé"});
				}else if (err.code == Errors.E_EMAIL_FORMAT_INVALID){
					res.status(400).json({"code":err.code,"message":"Le format de l'email n'est pas conforme"});
				}else if (err.code == Errors.E_PASSWORD_FORMAT_INVALID){
					res.status(400).json({"code":err.code,"message":"Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule, un chiffre et un charactère spécial"})
				}else{ // Not generated by us
					console.error(err);
					res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
				}
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
		if (err){ // Not generated by us
			console.error(err);
			res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.get('/api/spot-types', (req, res) => {
	console.log("Request at GET /api/spot-types : " + JSON.stringify(req.query));
	GetSpotTypes((err, data) => {
		if (err){ // Not generated by us
			console.error(err);
			res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.get('/api/spots', (req, res) => {
	console.log("Request at GET /api/spots : " + JSON.stringify(req.query));
	GetSpots((err, data) => {
		if (err){ // Not generated by us
			console.error(err);
			res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

app.post('/api/spot', (req, res) => {
	//console.log("Request at POST /api/spot : " + JSON.stringify(req.body));
	if (req.body && req.body.number && req.body.floor && req.body.id_park){
		PostSpot((err, data) => {
			if (err){
				if (err.code == Errors.E_WRONG_FLOOR){
					res.status(400).json({"code":err.code,"message":"L'étage n'existe pas."});
				}else if (err.code == Errors.E_UNDEFINED_PARKING){
					res.status(400).json({"code":err.code,"message":"Le parking n'existe pas."});
				}else if (err.code == Errors.E_SPOT_ALREADY_EXIST){
					res.status(400).json({"code":err.code,"message":"La place existe déjà."});
				}else{ // Not generated by us
					console.error(err);
					res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
				}
			}else{
				res.status(200).json();
			}
		}, req.body);
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : number, floor, id_park"});
	}
});

app.get('/api/role', (req, res) => {
	console.log("Request at GET /api/role : " + JSON.stringify(req.query));
	GetPermRole((err, data) => {
		if (err){ // Not generated by us
			console.error(err);
			res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
		}else{
			res.status(200).json(data);
		}
	}, req.query);
});

module.exports = app;