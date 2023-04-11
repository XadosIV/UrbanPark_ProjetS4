const express = require('express');
const app = express();
const {GetToken} = require('./db_access/auth')
const {GetUsers, PostUser} = require('./db_access/user');
const {GetParkings} = require('./db_access/parking');
const {GetSpotTypes} = require('./db_access/spot_types');
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

// Test endpoint
app.get('/api/test', (req, res) => {
	let data = ["test1","test2","test3"];
	res.status(200).json(data);
});

app.get('/api/users', (req, res) => {
	let quer = req.query;
	console.log(quer);
	GetUsers((err, data) => {
		if (err){
			throw err;
		}else{
			res.status(200).json(data);
		}
	}, quer);
});

app.get('/api/auth', (req, res) => {
	if (req.query && req.query.email && req.query.password){
		GetToken((err, data) => {
			if (err){
				if (err.code == Errors.E_UNDEFINED_USER){
					res.status(400).json({"code":err.code, "message":"Aucun compte n'est inscrit avec cet email."})
				}else{
					throw err;
				}
			}else{
				if (data.length == 0){
					res.status(200).json({});
				}else{
					res.status(200).json(data[0]);
				}
			}
		}, req.query)
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : email, password"});
	}
	
})

app.post('/api/user', (req, res) => {
	console.log("REQUEST : " + req);
	if (req.body && req.body.first_name && req.body.last_name && req.body.email && req.body.password){
		PostUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password, (err, data) => {
			if (err){
				if (err.code == Errors.E_EMAIL_ALREADY_USED){
					res.status(400).json({"code":err.code,"message":"Email déjà utilisé"});
				}else if (err.code == Errors.E_EMAIL_FORMAT_INVALID){
					res.status(400).json({"code":err.code,"message":"Le format de l'email n'est pas conforme"});
				}else if (err.code == Errors.E_PASSWORD_FORMAT_INVALID){
					res.status(400).json({"code":err.code,"message":"Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule, un chiffre et un charactère spécial"})
				}else{
					throw err;
				}
			}else{
				res.status(201).json();
			}
		});
	}else{
		res.status(400).json({"code":"E_MISSING_PARAMETER","message":"Champs obligatoires : first_name, last_name, email, password"});
	}
});

app.get('/api/parkings', (req, res) => {
	GetParkings((err, data) => {
		if (err){
			throw err;
		}else{
			res.status(200).json(data);
		}
	});
});

app.get('/api/spot-types', (req, res) => {
	GetSpotTypes((err, data) => {
		if (err){
			throw err;
		}else{
			res.status(200).json(data);
		}
	});
});

module.exports = app;