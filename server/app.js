const express = require('express');
require('dotenv').config();
const mysql = require('mysql');

const app = express();

// Default headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

// Test endpoint
app.use('/', (req, res, next) => {
	let data = [];
	res.status(200).json(data);
});

module.exports = app;