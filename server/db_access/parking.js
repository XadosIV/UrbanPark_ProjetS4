const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetParkings
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id}
 */

function GetParkings(callback, infos){
	sql = `SELECT * FROM ${dbName}.Parking WHERE id LIKE :id;`;
    console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id:infos.id||'%'
    }, callback);
}


module.exports = {GetParkings};