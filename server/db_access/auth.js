const {dbConnection, dbName} = require('../database');
var crypto = require("crypto");

/**
 * GenerateNewToken
 * Generate a new token
 * 
 * @param {function(string)} callback (token)
 */
function GenerateNewToken(callback){
	let token = crypto.randomBytes(10).toString('hex');
	dbConnection.query(`SELECT * FROM ${dbName}.User WHERE token= :token;`,{
		token: token
	}, (err, data) => {
		if (err){ // SQL Error
			throw err;
		}else if (data.length != 0){ // Already used, retry
			GenerateNewToken(callback);
		}else{
			callback(err, token);
		}
	});
}

module.exports = {GenerateNewToken};