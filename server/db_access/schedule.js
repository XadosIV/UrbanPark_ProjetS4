const {dbConnection, dbName} = require('../database');
const {GetUsers} = require('./user');
const {GetPermRole} = require('./role');
const Errors = require('../errors');

/**
 * IsValidDatetime
 * Check if the string is a valid datetime (ISO-8601)
 * 
 * @param {string} datetime
 * 
 * @return {boolean}
 */
function IsValidDatetime(datetime){
	return (new Date(datetime) != "Invalid Date") && (datetime.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?$/i));
}

/**
 * GetSchedules
 * Return a JSON with every schedule corresponding to paramaters
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
 * Return a JSON with every schedule corresponding to paramaters (search by user disabled)
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {role, parking, date_start, date_end}
 */
function GetSchedulesRole(callback, infos){
	sql = `SELECT s.id, s.id_user AS user, u.last_name, p.name, s.id_parking AS parking, DATE_FORMAT(date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(date_end,"%Y-%m-%dT%T") AS date_end FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON s.id_user = u.id JOIN ${dbName}.Parking p ON s.id_parking = p.id WHERE u.role LIKE :role AND s.id_parking LIKE :parking AND s.date_start LIKE :date_start AND s.date_end LIKE :date_end;`;
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
 * Return a JSON with every schedule corresponding to paramaters (search by role disabled)
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {user, parking, date_start, date_end}
 */
function GetSchedulesUser(callback, infos){
	sql = `SELECT s.id, s.id_user AS user, u.last_name, p.name, s.id_parking AS parking, DATE_FORMAT(date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(date_end,"%Y-%m-%dT%T") AS date_end FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON s.id_user = u.id JOIN ${dbName}.Parking p ON s.id_parking = p.id WHERE id_user LIKE :user AND id_parking LIKE :parking AND date_start LIKE :date_start AND date_end LIKE :date_end;`
	console.log("SQL at GetSchedulesUser : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		user:infos.user||'%',
		parking:infos.parking||'%',
		date_start:infos.date_start||'%',
		date_end:infos.date_end||'%'
	}, callback);
}

/**
 * PostSchedule
 * Insert a/several schedule(s) in the database
 * 
 * @param {object} infos {role, user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostSchedule(infos, callback){
	if (infos.role && infos.user){
		let errorCode = Errors.E_CONFLICTING_PARAMETERS;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error,[]);
	}else if(!IsValidDatetime(infos.date_start) || !IsValidDatetime(infos.date_end)){
		let errorCode = Errors.E_DATETIME_FORMAT_INVALID;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error,[]);
	}else if (infos.role){
		PostScheduleRole(infos, callback);
	} else {
		PostScheduleUser(infos, callback);
	}
}

/**
 * PostScheduleRole
 * Insert a schedule for every user with the role in the database
 * 
 * @param {object} infos {role, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostScheduleRole(infos, callback){
	GetPermRole((err, data)=>{
		if(err){
			callback(err,data);
		}else if(data.length!=1){
			let errorCode = Errors.E_ROLE_NOT_FOUND;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error,{});
		}else{
			sql = `SELECT id FROM ${dbName}.User WHERE role LIKE :role`;
			// console.log("SQL at PostScheduleRole : " + sql + " with " + JSON.stringify(infos));
			dbConnection.query(sql, {
				role:infos.role||'%'
			}, (err, data)=>{
				if (err){
					callback(err,data);
				}else{
					IsntScheduleOverlappingForList(infos, data.map(i => i.id), (err, isntOverlapping) =>{
						if(err){
							callback(err,{});
						}else if(!isntOverlapping){
							let errorCode = Errors.E_OVERLAPPING_SCHEDULES;
							let error = new Error(errorCode);
							error.code = errorCode;
							callback(error,{});
						}else{
							PostScheduleUsers(infos, data.map(i => i.id), callback);
						}
					});
				}
			});
		}
	}, {"role":infos.role});
}

/**
 * PostScheduleUser
 * Insert a schedule for the user in the database
 * 
 * @param {object} infos {user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostScheduleUser(infos, callback){
	GetUsers((err,data)=>{
		if(err){
			callback(err,data);
		}else if(data.length != 1){
			let errorCode = Errors.E_USER_NOT_FOUND;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error,{});
		}else{
			IsntScheduleOverlapping(infos,(err,isntOverlapping)=>{
				if(err){
					callback(err,{});
				}else if(!isntOverlapping){
					let errorCode = Errors.E_OVERLAPPING_SCHEDULES;
					let error = new Error(errorCode);
					error.code = errorCode;
					callback(error,{});
				}else{
					sql = `INSERT INTO ${dbName}.Schedule (id_user, id_parking, date_start, date_end) VALUES (:user, :parking, :date_start, :date_end);`;
					console.log("SQL at PostScheduleUser : " + sql + " with " + JSON.stringify(infos));
					dbConnection.query(sql, infos, callback);
				}
			});
		}
	}, {id:infos.user});
}

/**
 * PostScheduleUsers
 * Insert schedules for all users in the array
 * 
 * @param {object} infos {role, parking, date_start, date_end}
 * @param {Array<string>} ids IDs of the users
 * @param {function(*,*)} callback (err, data)
 */
function PostScheduleUsers(infos, ids, callback){
	PostScheduleUser({
		user:ids.pop(),
		parking:infos.parking,
		date_start:infos.date_start,
		date_end:infos.date_end
	}, (err, data) =>{
		if(err){
			callback(err,data);
		}else if(ids.length>0){
			PostScheduleUsers(infos,ids,callback);
		}else{
			callback(err,data);
		}
	});
}

function GetScheduleById(id, callback){
	sql = `SELECT s.id, s.id_user AS user, u.last_name, p.name, s.id_parking AS parking, DATE_FORMAT(date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(date_end,"%Y-%m-%dT%T") AS date_end FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON s.id_user = u.id JOIN ${dbName}.Parking p ON s.id_parking = p.id WHERE s.id=:id;`
	dbConnection.query(sql, {id:id}, callback);

}

function UpdateSchedule(infos, callback){
	//infos has {id, user, parking, date_start, date_end}
	//Check date_start syntax
	if (infos.date_start){
		if (!IsValidDatetime(infos.date_start)){
			let errorCode = Errors.E_DATETIME_FORMAT_INVALID;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error,{});
			return;
		}
	}
	//Check date_end syntax
	if (infos.date_end){
		if (!IsValidDatetime(infos.date_end)){
			let errorCode = Errors.E_DATETIME_FORMAT_INVALID;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error,{});
			return;
		}
	}

	GetScheduleById(infos.id, (err, data) => {
		if (err){
			callback(err, {})
		}else{
			if (data.length == 1){
				data = data[0]
				// schedule object will contains information post update, to check if everything works fine with the new data
				schedule = {start:data.date_start, end:data.date_end, user:data.user, parking:data.parking, id:infos.id}
				if (infos.date_start) schedule.start = infos.date_start
				if (infos.date_end) schedule.end = infos.date_end
				if (infos.user) schedule.user = infos.user
				if (infos.parking) schedule.parking = infos.parking

				// check order
				if (schedule.end < schedule.start){
					let errorCode = Errors.E_WRONG_DATETIME_ORDER;
					let error = new Error(errorCode);
					error.code = errorCode;
					callback(error,{});
					return;
				}

				//check overlap
				IsntScheduleOverlapping(schedule, (err, no_overlap) => {
					if (err){
						callback(err, {})
					}else{
						if (no_overlap){
							//insert sql
							sql = `UPDATE ${dbName}.Schedule SET id_user=:user, id_parking=:parking, date_start=:start, date_end=:end WHERE id=:id`
							console.log(schedule)
							dbConnection.query(sql, schedule, callback);
						}else{
							let errorCode = Errors.E_OVERLAPPING_SCHEDULES;
							let error = new Error(errorCode);
							error.code = errorCode;
							callback(error,{});
							return;
						}
					}
				})
			}else{
				let errorCode = Errors.E_SCHEDULE_NOT_FOUND;
				let error = new Error(errorCode);
				error.code = errorCode;
				callback(error,{});
				return;
			}
		}
	})
}

/**
 * IsntScheduleOverlapping
 * Check if the new schedule isn't overlapping an existing one (true if no overlapping)
 * 
 * @param {object} infos {user, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function IsntScheduleOverlapping(infos, callback){
	sql = `SELECT * FROM ${dbName}.Schedule WHERE id_user=:user AND (date_start < :date_end AND date_end > :date_start);`;
	// console.log("SQL at IsntScheduleOverlapping : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, infos, (err, data) =>{
		if (err){
			callback(err,data)
		}else{
			// console.log(data);
			callback(err,data.length == 0);
		}
	});
}

/**
 * IsntScheduleOverlappingForList
 * Check if the new schedule isn't overlapping an existing one (true if no overlapping)
 * 
 * @param {object} infos {date_start, date_end}
 * @param {Array<string>} ids IDs of the users
 * @param {function(*,*)} callback (err, data)
 */
function IsntScheduleOverlappingForList(infos, ids, callback){
	IsntScheduleOverlapping({
		user:ids.pop(),
		date_start:infos.date_start,
		date_end:infos.date_end
	}, (err, isntOverlapping) =>{
		if(err){
			callback(err,isntOverlapping);
		}else if(ids.length>0 && isntOverlapping){
			PostScheduleUsers(infos,ids,callback);
		}else{
			callback(err,isntOverlapping);
		}
	});
}



module.exports = {GetSchedules, PostSchedule, UpdateSchedule, GetScheduleById};