const {dbConnection} = require('../database');
require('dotenv').config();

/**
 * GetUsers
 * Return a JSON with every user
 * 
 * @returns Array
 */
function GetUsers(callback){
	dbConnection.query(`SELECT * FROM ${process.env.DATABASE}.Users;`, callback);
}

function PostUser(firstName, lastName, email, password, callback){
	dbConnection.query(`INSERT INTO ${process.env.DATABASE}.Users first_name, last_name, email, password, role, token, id_spot VALUES ();`);
}

module.exports = {GetUsers};