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
	//We could've did it in 2 separate functions, but what is life without challenge ?
	let sql = `SELECT t.name FROM ${dbName}.typed y
		RIGHT JOIN ${dbName}.Type t ON t.name=y.name_type
		GROUP BY t.Name
		HAVING MAX(case when y.id_spot LIKE :id_spot OR "%" = :id_spot then 1 else 0 end);`;
	console.log("SQL at GetSpotTypes : " + sql);
	dbConnection.query(sql, {
        id_spot:infos.id_spot||'%'
    },callback);
}

/**
 * SpotTypeExists
 * Does this spot type exists ?
 * 
 * @param {string} name
 * @param {function(*,*)} callback (err, boolean)
 */
function SpotTypeExists(name, callback) {
	let sql = `SELECT name FROM ${dbName}.Type WHERE name LIKE :name;`;
	console.log("SQL at GetSpotTypes : " + sql);
	dbConnection.query(sql, {
        name:name
    },(err, data) => {
		if (err){
			callback(err, false);
		}else{
			callback(err, data.length==1);
		}
	});
}

module.exports = {GetSpotTypes, SpotTypeExists};