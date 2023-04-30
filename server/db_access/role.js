const {dbConnection} = require('../database');

/**
 * GetPermRole
 * Get the selected role
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {role}
 */
function GetPermRole(callback, infos){
	sql = `SELECT * FROM Role WHERE name=:role;`;
	console.log("SQL at GetPermRole : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		role: infos.role
	}, callback);
}

module.exports = { GetPermRole };