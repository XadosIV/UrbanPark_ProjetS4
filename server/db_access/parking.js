const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetParkings
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {name}
 */

function GetParkings(callback, infos){
	sql = `SELECT * FROM ${dbName}.Parking WHERE name LIKE :name;`;
    console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        name:infos.name||'%'
    }, callback);
}


module.exports = {GetParkings};