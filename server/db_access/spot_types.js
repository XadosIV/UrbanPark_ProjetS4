const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSpotTypes
 * Get all spot types matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 */
function GetSpotTypes(callback){
	let sql = `SELECT name FROM ${dbName}.Type;`;
	console.log("SQL at GetSpotTypes : " + sql);
	dbConnection.query(sql, callback);
}

module.exports = {GetSpotTypes};