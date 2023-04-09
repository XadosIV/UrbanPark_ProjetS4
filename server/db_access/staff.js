const {dbConnection} = require('../database');
const Errors = require('../errors');
require('dotenv').config();

/**
 * GetGuardians
 * Get all guardians matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 */
function GetGuardians(callback){
	dbConnection.query(`SELECT * FROM ${process.env.DATABASE}.User WHERE role = "Gardien";`, callback);
}

/**
 * GetService
 * Get all washing service matching parameters
 * 
 * @param {function(*,*)} callback (err, data) 
 */
function GetService(callback){
	dbConnection.query(`SELECT * FROM ${process.env.DATABASE}.User WHERE role = "Agent d'entretien";`, callback);
}

module.exports = {GetGuardians, GetService};