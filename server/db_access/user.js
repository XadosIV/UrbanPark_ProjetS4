const {dbConnection} = require('../database');
require('dotenv').config();

/**
 * GetUsers
 * Return a JSON with every user
 * 
 * @returns Array
 */
function GetUsers(callback){
	dbConnection.query("SELECT * FROM `"+process.env.DATABASE+"`.`Users`", callback);
}

module.exports = {GetUsers};