const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSpots
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_park, floor, number}
 */

function GetSpots(callback, infos){
	sql = `SELECT * FROM ${dbName}.Spot WHERE id_park LIKE :id_park AND floor LIKE :floor AND number LIKE :number ORDER BY floor, number;`;
    console.log("SQL at GetSpots : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id_park:infos.id_park||'%',
        floor:infos.floor||'%',
        number:infos.number||'%'
    }, callback);
}

module.exports = {GetSpots};