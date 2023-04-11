const {dbConnection, dbName} = require('../database');
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

/**
 * GetToken
 * Get token from mail and password
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {string} email
 */
function GetToken(callback, infos){
	sql = `SELECT * FROM ${process.env.DATABASE}.User WHERE email='${infos.email}';`;
	dbConnection.query(sql, (err, res) => {
		if (err) throw err;
		if (res.length == 1){ // User Exist
			sql = `SELECT token FROM ${process.env.DATABASE}.User `;
			quest = SetQuery(infos);
			console.log(sql+quest);
			dbConnection.query(sql+quest, callback);
		}else{
			let errorCode = Errors.E_UNDEFINED_USER;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error,{});
		}
	});
}

/**
 * SetQuery
 * Set all the parameters for the research of users
 * 
 * @param {JSON} infos
 * 
 * @returns {string}
 */
function SetQuery(infos){

	// Not needed to check if they exists 'cause the request returns an error if they aren't there
	addMail = "email = '"+infos.email+"'"
	addPassword = "password = '"+infos.password+"'"

	res = "WHERE "
	res += addMail
	res += " AND "
	res += addPassword
	res += ";"
	return res
}

module.exports = {GenerateNewToken, GetToken};