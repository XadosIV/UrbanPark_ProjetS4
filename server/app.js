const express = require('express');
const app = express();
const {GetUsers} = require('./db_access/user');
const {GetParkings} = require('./db_access/parking');

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
	GetUsers((err, data) => {res.status(200).json(data)});
});

app.get('/api/parkings', (req, res) => {
	GetParkings((err, data) => {res.status(200).json(data)});
});

module.exports = app;