const {dbConnection} = require('../database');
require('dotenv').config();

/**
 * GetParkings
 * Return a JSON with every parking
 * 
 * @returns Array
 */
function GetParkings(callback){
	dbConnection.query(`SELECT * FROM ${process.env.DATABASE}.Parking;`, callback);
}

module.exports = {GetParkings};