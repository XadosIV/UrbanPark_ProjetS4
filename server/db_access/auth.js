const {dbConnection} = require('../database');
require('dotenv').config();
var crypto = require("crypto");

/**
 * GenerateNewToken
 * Generate a new token
 * 
 * @param {function(string)} callback (token)
 */
function GenerateNewToken(callback){
	let token = crypto.randomBytes(10).toString('hex');
	dbConnection.query(`SELECT * FROM ${process.env.DATABASE}.Users WHERE token="${token}";`, (err, data) => {
		if (err){ // SQL Error
			throw err;
		}else if (data.json().length() == 0){ // Already used, retry
			GenerateNewToken(callback);
		}else{
			callback(token);
		}
	});
}

module.exports = {GenerateNewToken};