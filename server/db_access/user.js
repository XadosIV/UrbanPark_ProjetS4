const {dbConnection, dbName} = require('../database');
const {GenerateNewToken} = require('./auth');
const Errors = require('../errors');

/**
 * SetQuery
 * Set all the parameters for the research of users
 * 
 * @param {JSON} infos
 * 
 * @returns {string}
 */
function SetQuery(infos){
	if (infos){
		ajoutMail = null;
		ajoutFirst = null;
		ajoutRole = null;
		ajoutLast = null;
		if (infos.email)
		{
			ajoutMail = " email LIKE '" + infos.email + "%' "
		}
		if (infos.role){
			ajoutRole = ' role = "' + infos.role + '" '
		}
		if (infos.last_name){
			ajoutLast = " last_name LIKE '" + infos.last_name + "%' "
		}
		if (infos.first_name){
			ajoutFirst = " first_name LIKE '" + infos.first_name + "%' "
		}
	}
	res = "";
	if (ajoutMail || ajoutLast || ajoutRole || ajoutFirst){
		res += "WHERE";
		if (ajoutMail){
			res += ajoutMail;
			if (ajoutLast || ajoutRole || ajoutFirst){
				res += "AND";
			}
		}
		if (ajoutLast){
			res += ajoutLast;
			if (ajoutRole || ajoutFirst){
				res += "AND";
			}
		}
		if (ajoutRole){
			res += ajoutRole;
			if (ajoutFirst){
				res += "AND";
			}
		}
		if (ajoutFirst){
			res += ajoutMail;
		}
	}
	res += `;`;
	return res;
}

/**
 * GetUsers
 * Get all users matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {string} email
 */
function GetUsers(callback, infos){
	sql = `SELECT * FROM ${process.env.DATABASE}.User `;
	quest = SetQuery(infos);
	console.log("SQL at GetUsers : "+sql+quest);
	dbConnection.query(sql+quest, callback);
}

/**
 * IsValidEmail
 * Check if the string is a valid email
 * 
 * @param {string} email 
 * 
 * @return {boolean}
 */
function IsValidEmail(email){
	return email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

/**
 * IsValidPassword
 * Check if the string is a valid password
 * Minimum 8 characters long, a lower case, an upper case, a digitanda special character
 * 
 * @param {string} password 
 * 
 * @returns {boolean}
 */
function IsValidPassword(password){
	return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
}

/**
 * PostUser
 * Create a new user with "Abonné" role
 * 
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {string} email 
 * @param {string} password 
 * @param {function(*,*)} callback (err, data)
 */
function PostUser(firstName, lastName, email, password, callback){
	if (!IsValidEmail(email)){
		console.log("TRACE 1");
		let errorCode = Errors.E_EMAIL_FORMAT_INVALID;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error,[]);
	}else if (!IsValidPassword(password)){
		console.log("TRACE 2");
		let errorCode = Errors.E_PASSWORD_FORMAT_INVALID;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error,[]);
	}else{
		GetUsers((err, data) => {
			if (err) { // SQL Error
				throw err;
			}else if (data.length != 0){ // Email already used
				let errorCode = Errors.E_EMAIL_ALREADY_USED;
				let error = new Error(errorCode);
				error.code = errorCode;
				callback(error,data);
			}else{
				GenerateNewToken((err, token) => {
					if (err){
						throw err;
					}else{
						dbConnection.query(`INSERT INTO ${dbName}.User (first_name, last_name, email, password, role, token, id_spot) VALUES (:firstName,:lastName,:email,:password,:role,:token,:spot);`,{
							firstName: firstName,
							lastName: lastName,
							email: email,
							password: password,
							role: "Abonné",
							token: token,
							spot: null
						}, callback);
					}
				});
			}
		}, {email:email});
	}
}

module.exports = {GetUsers, PostUser};