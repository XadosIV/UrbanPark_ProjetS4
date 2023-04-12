const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSpots
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_park}
 */

function GetSpots(callback, infos){
	sql = `SELECT * FROM ${dbName}.Spot WHERE id_park LIKE :id_park ORDER BY floor, number;`;
    console.log("SQL at GetSpots : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id_park:infos.id_park||'%'
    }, callback);
}

module.exports = {GetSpots};