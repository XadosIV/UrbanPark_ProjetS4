const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSpotTypes
 * Get all spot types matching parameters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_spot}
 */
function GetSpotTypes(callback, infos){
	//Don't ask why this is that hard, only @UP-4303 knows
	let sql = `SELECT t.name FROM ${dbName}.Typed y
	RIGHT JOIN ${dbName}.Type t ON t.name=y.name_type
	GROUP BY t.name
	HAVING MAX(case when y.id_spot LIKE :id_spot OR (case when "%" = :id_spot then 1 else 0 end) then 1 else 0 end);`;
	console.log("SQL at GetSpotTypes : " + sql);
	dbConnection.query(sql, {
        id_spot:infos.id_spot||'%'
    },callback);
}

module.exports = {GetSpotTypes};