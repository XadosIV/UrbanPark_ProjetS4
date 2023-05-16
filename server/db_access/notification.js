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
	const {GetSchedules} = require('./schedule'); // Avoiding circular dependencies

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

/**
 * PreparePostNotification
 * Get all the mandatory informations and put them in data
 * 
 * @param {number} id_user User that should get the notification
 * @param {string} action Should be `POST`, `PUT` or `DELETE`
 * @param {string} type_notif Should be a keyword specified in `notification.md`
 * @param {number | null} id_schedule If a schedule is involved, it's id. Else null
 * @param {function(*,*)} callback (err, data) data contains all the mandatory infos for PostNotification
 */
function PreparePostNotification(id_user, action, type_notif, id_schedule, callback){
	if(action === "POST" || id_schedule === null){
		callback(null, {
			"id_user":id_user,
			"action":action,
			"type_notif":type_notif,
			"id_schedule":id_schedule,
			"type":null,
			"id_parking":null,
			"date_start":null,
			"date_end":null
		})
	}else{
		GetSchedules({"id":id_schedule}, (err, data) => {
			if(err){
				callback(err, null);
			}else{
				let schedule = data[0];
				callback(err, {
					"id_user":id_user,
					"action":action,
					"type_notif":type_notif,
					"id_schedule":id_schedule,
					"type":schedule.type,
					"id_parking":schedule.id_parking,
					"date_start":schedule.date_start,
					"date_end":schedule.date_end
				})
			}
		})
	}
}

/**
 * PostNotification
 * 
 * @param {Object} infos {id_user, action, type_notif, id_schedule, type, id_parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostNotification(infos, callback){
	let sql = `INSERT INTO Notification
		(id_user,
			action,
			type_notif,
			id_schedule,
			type,
			id_parking,
			date_start,
			date_end
		)
		VALUES (
			:id_user,
			:action,
			:type_notif,
			:id_schedule,
			:type,
			:id_parking,
			:date_start,
			:date_end
		);`
	dbConnection.query(sql, infos, callback);
}

module.exports = {GetNotifications, PreparePostNotification, PostNotification};