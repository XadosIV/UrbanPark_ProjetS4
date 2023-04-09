const {dbConnection} = require('../database');
const {GenerateNewToken} = require('./auth');
const Errors = require('../errors');
require('dotenv').config();

/**
 * GetUsers
 * Get all users matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {string} email
 */
function GetUsers(callback, email="*"){
	dbConnection.query(`SELECT * FROM ${process.env.DATABASE}.User WHERE email LIKE "${email}";`, callback);
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
 * Minimum 8 characters long, a lower case, an upper case, a digit and a special character
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
		callback(error,);
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
						dbConnection.query(`INSERT INTO ${process.env.DATABASE}.User (first_name, last_name, email, password, role, token, id_spot) VALUES ("${firstName}","${lastName}","${email}","${password}","Abonné","${token}", NULL);`, callback);
					}
				});
			}
		}, email);
	}
}

module.exports = {GetUsers, PostUser};