const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSpots
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_park, floor, number, type}
 */

function GetSpots(callback, infos){
	sql = `SELECT * FROM ${dbName}.Spot s LEFT JOIN ${dbName}.Typed t ON t.id_spot=s.id WHERE id_park LIKE :id_park AND floor LIKE :floor AND number LIKE :number`;
    if (infos.type) {
		sql += ` AND name_type LIKE '` + infos.type + `'`;
	}
    sql += ` ORDER BY floor, number;`
    console.log("SQL at GetSpots : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id_park:infos.id_park||'%',
        floor:infos.floor||'%',
        number:infos.number||'%'
    }, callback);
}

module.exports = {GetSpots};