const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetParkings
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param { String } name - Name of the parking you want to get
 * @returns Array
 */

function GetParkings(callback, infos){
	sql = `SELECT * FROM ${process.env.DATABASE}.Parking WHERE name LIKE :name;`;
    console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        name:infos.name||'%'
    }, callback);
}

module.exports = {GetParkings};