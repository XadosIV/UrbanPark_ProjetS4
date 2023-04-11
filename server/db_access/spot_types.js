const {dbConnection} = require('../database');
const Errors = require('../errors');
require('dotenv').config();

/**
 * GetSpotTypes
 * Get all spot types matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 */
function GetSpotTypes(callback){
	let sql = `SELECT name FROM ${process.env.DATABASE}.Type;`;
	console.log("SQL at GetSpotTypes : " + sql);
	dbConnection.query(sql, callback);
}

module.exports = {GetSpotTypes};