const {dbConnection, dbName} = require('../database');
const {GetUsers, GetUserFromToken} = require("./user");
const {GetPermRole} = require("./role")
const Errors = require('../errors');
const {SendError} = require('../errors');
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
		if (err){ // Not generated by us
			callback(err, "");
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
	if ( !(infos && infos.email && infos.password) ){
		return SendError(Errors.E_MISSING_PARAMETER, "Champs obligatoires : email, password", callback);
	}

	GetUsers((err, res) => {
		if (err){ // Not generated by us
			callback(err, {});
		}else if (res.length == 1){ // User Exist
			let sql = `SELECT token FROM ${dbName}.User WHERE email=:email AND password=:password`;
			console.log("SQL at GetToken : " + sql + " with " + JSON.stringify(infos));
			dbConnection.query(sql, infos, (err, res) =>{
				if (res.length == 1){ // Password is correct
					callback(err, {token:res[0].token});
				}else{
					return SendError(Errors.E_WRONG_PASSWORD, "Le mot de passe et l'email ne correspondent pas.", callback);
				}
			});
		}else{
			return SendError(Errors.E_UNDEFINED_USER, "Aucun compte n'est inscrit avec cet email.", callback);
		}
	}, {email:infos.email});
}


/**
 * HasPermission
 * Check if a user (by token) has the permission given
 * 
 * @param {string} token
 * @param {string} perm
 * @param {function(*,*)} callback (err, hasPerm(booleen))
 */
function HasPermission(token, perm, callback){
	perm = perm.toLowerCase()

	GetUserFromToken((err, res) => {
		if (err){
			callback(err, {})
		}else{
			if (res.length == 0){
				// If no user were found by the request
				let errorCode = Errors.E_UNDEFINED_USER;
				let error = new Error(errorCode);
				error.code = errorCode;
				callback(error,[]);
			}else{
				role = res[0].role // take role from the user
				GetPermRole((err, res) => { // and check for its permissions
					if (err){
						callback(err, {})
					}else{
						res = res[0] // role must exist cause a user cant have no role
						if (res[perm]){ //check if perm exist
							perm = res[perm].readInt8() // SQL store boolean as buffer, readInt8 convert them into int (0 or 1)
							if (perm){ // we now can know if the user has the permission
								callback(null, true)
							}else{
								callback(null, false)
							}
						}else{
							// the permission dont exist
							let errorCode = Errors.E_PERMISSION_DOESNT_EXIST;
							let error = new Error(errorCode);
							error.code = errorCode;
							callback(error,[]);
						}
					}
				}, {role:role})
			}
		}
	}, {token:token})
}

module.exports = {GenerateNewToken, GetToken, HasPermission};