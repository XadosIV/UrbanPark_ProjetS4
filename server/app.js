const express = require('express');
const app = express();
const {GetUsers, PostUser} = require('./db_access/user');
const {GetParkings} = require('./db_access/parking');
const Errors = require('./errors');

// Default headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
	let data = ["test1","test2","test3"];
	res.status(200).json(data);
});

app.get('/api/users', (req, res) => {
	GetUsers((err, data) => {
		if (err){
			throw err;
		}else{
			res.status(200).json(data);
		}
	});
});

app.post('/api/user', (req, res) => {
	PostUser((err, data) => {
		if (err){
			if (err.code == Errors.E_EMAIL_ALREADY_USED){
				res.json({"code":"E_MAIL_ALREADY_USED","message":"Email déjà utilisé"});
			} else {
				throw err;
			}
			res.status(403);
		}else{
			res.status(201);
		}
	});
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

module.exports = app;