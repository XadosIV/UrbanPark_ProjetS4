const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetSchedules
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {role, user, parking, date_start, date_end}
 */
function GetSchedules(callback, infos){
	if (infos.role && infos.user){
		let errorCode = Errors.E_CONFLICTING_PARAMETERS;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error,[]);
	}else if (infos.role){
		GetSchedulesRole(callback, infos);
	} else {
		GetSchedulesUser(callback, infos);
	}
}

/**
 * GetSchedulesRoles
 * Return a JSON with every parking corresponding to paramaters (search by user disabled)
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {role, parking, date_start, date_end}
 */
function GetSchedulesRole(callback, infos){
	sql = `SELECT s.id, s.id_user, s.id_parking, s.date_start, s.date_end FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON u.id=s.id_user WHERE u.role LIKE :role AND s.parking LIKE :parking AND s.date_start LIKE :date_start AND s.date_end LIKE :date_end;`;
	console.log("SQL at GetSchedulesRole : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		role:infos.role||'%',
		parking:infos.parking||'%',
		date_start:infos.date_start||'%',
		date_end:infos.date_end||'%'
	}, callback);
}

/**
 * GetSchedulesUser
 * Return a JSON with every parking corresponding to paramaters (search by role disabled)
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {user, parking, date_start, date_end}
 */
function GetSchedulesUser(callback, infos){
	sql = `SELECT id, id_user, id_parking, date_start, date_end FROM ${dbName}.Schedule WHERE id_user LIKE :user AND parking LIKE :parking AND date_start LIKE :date_start AND date_end LIKE :date_end;`;
	console.log("SQL at GetSchedulesUser : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		user:infos.user||'%',
		parking:infos.parking||'%',
		date_start:infos.date_start||'%',
		date_end:infos.date_end||'%'
	}, callback);
}

module.exports = {GetSchedules};