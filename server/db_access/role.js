const {dbConnection} = require('../database');

/**
 * GetPermRole
 * Get the selected role
 * 
 * @param {object} infos {role}
 * @param {function(*,*)} callback (err, data)
 */

function GetPermRole(infos, callback){
	sql = `SELECT * FROM Role WHERE name LIKE :role;`;
	console.log("SQL at GetPermRole : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		role: infos.role||'%'
	}, callback);
}

module.exports = { GetPermRole };