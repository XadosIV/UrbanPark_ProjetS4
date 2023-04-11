const {dbConnection, dbName} = require('../database');
require('dotenv').config();

/**
 * GetParkings
 * Return a JSON with every parking
 * 
 * @returns Array
 */
function GetParkings(callback){
	let sql = `SELECT * FROM ${dbName}.Parking;`
	console.log("SQL at GetParkings : " + sql);
	dbConnection.query(sql, {}, callback);
}

module.exports = {GetParkings};