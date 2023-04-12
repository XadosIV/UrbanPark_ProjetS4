const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSpots
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param { Array } infos - All parameters needed
 * @returns Array
 */

function GetParkings(callback, infos){
	sql = `SELECT * FROM ${dbName}.Spot WHERE id_park LIKE :id_park;`;
    console.log("SQL at GetSpots : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id_park:infos.id_park||'%'
    }, callback);
}
// EN FONCTION DE L'ID DU USER

module.exports = {GetParkings};