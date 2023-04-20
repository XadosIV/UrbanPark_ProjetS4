const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetPermRole
 * Get the selected role
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {role}
 */
function GetPermRole(callback, infos){
	sql = `SELECT * FROM ${dbName}.Role WHERE name=:role;`;
	console.log("SQL at GetPermRole : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		role: infos.role
	}, callback);
}

module.exports = { GetPermRole };