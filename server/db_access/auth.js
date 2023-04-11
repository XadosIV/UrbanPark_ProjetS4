const {dbConnection, dbName} = require('../database');
const {GetUsers} = require("./user");
const Errors = require('../errors');
var crypto = require("crypto");

/**
 * GenerateNewToken
 * Generate a new token
 * 
 * @param {function(string)} callback (token)
 */
function GenerateNewToken(callback){
	let token = crypto.randomBytes(10).toString('hex');
	let sql = `SELECT * FROM ${dbName}.User WHERE token=:token;`;
	console.log("SQL at GenerateNewToken : " + sql + " with " + JSON.stringify({token:token}));
	dbConnection.query(sql,{
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

/**
 * GetToken
 * Get token from mail and password
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {email, password}
 */
function GetToken(callback, infos){
	GetUsers((err, res) => {
		if (err) throw err;
		if (res.length == 1){ // User Exist
			let sql = `SELECT token FROM ${dbName}.User WHERE email=:email AND password=:password`;
			console.log("SQL at GetToken : " + sql + " with " + JSON.stringify(infos));
			dbConnection.query(sql, infos, (err, res) =>{
				if (res.length == 1){ // Password is correct
					callback(err, res[0].token);
				}else{
					let errorCode = Errors.E_WRONG_PASSWORD;
					let error = new Error(errorCode);
					error.code = errorCode;
					callback(error, "");
				}
			});
		}else{
			let errorCode = Errors.E_UNDEFINED_USER;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error,"");
		}
	}, {email:infos.email});
}

module.exports = {GenerateNewToken, GetToken};