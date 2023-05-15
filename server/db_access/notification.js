const {dbConnection} = require('../database');
const Errors = require('../errors');
const {SendError} = require('../errors');

/**
 * GetNotifications
 * Get the notifications according to parameters
 * 
 * @param {object} infos {id_user}
 * @param {function(*,*)} callback (err, data)
 */
function GetNotifications(infos, callback){
	let sql = `SELECT
		id,
		id_user,
		action,
		type_notif,
		id_schedule,
		type,
		id_parking,
		date_start,
		date_end
	FROM Notification
	WHERE
		id_user LIKE :id_user;`;
	
	dbConnection.query(sql, {
		id_user:infos.id_user||'%'
	}, callback);
}

module.exports = {GetNotifications};