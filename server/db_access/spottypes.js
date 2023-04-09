const {dbConnection} = require('../database');
const Errors = require('../errors');
require('dotenv').config();

/**
 * GetSpotTypes
 * Get all guardians matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 */
function GetSpotTypes(callback){
	dbConnection.query(`SELECT name FROM ${process.env.DATABASE}.Type;`, callback);
}

module.exports = {GetSpotTypes};