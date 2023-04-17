const express = require('express');
const app = express();
const {GetToken} = require('./db_access/auth')
const {GetUsers, PostUser, GetUserFromToken} = require('./db_access/user');
const {GetParkings} = require('./db_access/parking');
const {GetSpotTypes} = require('./db_access/spot_types');
const {GetPermRole} = require('./db_access/role');
const {GetSchedules} = require('./db_access/schedules');
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
	});
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

app.get('/api/schedules', (req, res) => {
	console.log("Request at GET /api/schedules : " + JSON.stringify(req.query));
	GetSchedules((err, data) => {
		if (err){
			if (err.code == Errors.E_CONFLICTING_PARAMETERS){
				res.status(400).json({"code":err.code,"message":"Un seul champs peut être définit parmis : role, user"})
			}else{ // Not generated by us
				console.error(err);
				res.status(500).json({"code":Errors.E_INTERNAL_ERROR, "message":"Une erreur est survenue"});
			}
		}else{
			res.status(200).json(data);
		}
	}, req.query);
})

module.exports = app;