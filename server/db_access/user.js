const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetUsers
 * Get all users matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {string} email
 */
function GetUsers(callback, infos){
	sql = `SELECT * FROM ${dbName}.User WHERE email LIKE :email AND role LIKE :role AND last_name LIKE :last_name AND first_name LIKE :first_name;`;
	console.log("SQL at GetUsers : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		email:infos.email||'%',
		role:infos.role||'%',
		last_name:infos.last_name||'%',
		first_name:infos.first_name||'%'
	}, callback);
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
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {first_name, last_name, email, password}
 */
function PostUser(callback, infos){
	const {GenerateNewToken} = require('./auth');

	if (!IsValidEmail(infos.email)){
		let errorCode = Errors.E_EMAIL_FORMAT_INVALID;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error,[]);
	}else if (!IsValidPassword(infos.password)){
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
						let sql=`INSERT INTO ${dbName}.User (first_name, last_name, email, password, role, token, id_spot) VALUES (:first_name,:last_name,:email,:password,:role,:token,:spot);`;
						infos.token = token;
						infos.role="Abonné";
						infos.spot=null;
						console.log("SQL at PostUser : " + sql + " with " + JSON.stringify(infos));
						dbConnection.query(sql, infos, callback);
					}
				});
			}
		}, {email:infos.email});
	}
}

module.exports = {GetUsers, PostUser};