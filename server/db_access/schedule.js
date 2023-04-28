const { dbConnection, dbName } = require('../database');
const { GetUsers } = require('./user');
const { GetPermRole } = require('./role');
const { GetSpots } = require('./spot');
const Errors = require('../errors');
const e = require('express');

/**
 * IsValidDatetime
 * Check if the string is a valid datetime (ISO-8601)
 * 
 * @param {string} datetime
 * 
 * @return {boolean}
 */
function IsValidDatetime(datetime) {
	return (new Date(datetime) != "Invalid Date") && (datetime.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?$/i));
}

/**
 * GetSchedules
 * Return a JSON with every schedule corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {role, user, parking, date_start, date_end}
 */
function GetSchedules(callback, infos) {
	if (infos.role && infos.user) {
		let errorCode = Errors.E_CONFLICTING_PARAMETERS;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error, []);
	} else if (infos.role) {
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
function GetSchedulesRole(callback, infos) {
	sql = `SELECT s.id, s.id_user AS user, u.last_name, u.role, p.name, s.id_parking AS parking, DATE_FORMAT(s.date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(s.date_end,"%Y-%m-%dT%T") AS date_end, s.first_spot, s.last_spot FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON s.id_user = u.id JOIN ${dbName}.Parking p ON s.id_parking = p.id WHERE u.role LIKE :role AND s.id_parking LIKE :parking AND s.date_start LIKE :date_start AND s.date_end LIKE :date_end AND (s.first_spot LIKE :first_spot OR '%' LIKE :first_spot) AND (s.last_spot LIKE :last_spot OR '%' LIKE :last_spot);`;
	console.log("SQL at GetSchedulesRole : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		role: infos.role || '%',
		parking: infos.parking || '%',
		date_start: infos.date_start || '%',
		date_end: infos.date_end || '%',
		first_spot: infos.first_spot || '%',
		last_spot: infos.last_spot || '%'
	}, callback);
}

/**
 * GetSchedulesUser
 * Return a JSON with every schedule corresponding to paramaters (search by role disabled)
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {user, parking, date_start, date_end}
 */
function GetSchedulesUser(callback, infos) {
	sql = `SELECT s.id, s.id_user AS user, u.last_name, u.role, p.name, s.id_parking AS parking, DATE_FORMAT(s.date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(s.date_end,"%Y-%m-%dT%T") AS date_end, s.first_spot, s.last_spot FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON s.id_user = u.id JOIN ${dbName}.Parking p ON s.id_parking = p.id WHERE id_user LIKE :user AND id_parking LIKE :parking AND date_start LIKE :date_start AND date_end LIKE :date_end AND (s.first_spot LIKE :first_spot OR '%' LIKE :first_spot) AND (s.last_spot LIKE :last_spot OR '%' LIKE :last_spot);`;
	console.log("SQL at GetSchedulesUser : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		user: infos.user || '%',
		parking: infos.parking || '%',
		date_start: infos.date_start || '%',
		date_end: infos.date_end || '%',
		first_spot: infos.first_spot || '%',
		last_spot: infos.last_spot || '%'
	}, callback);
}

/**
 * PostSchedule
 * Insert a/several schedule(s) in the database
 * 
 * @param {object} infos {role, user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostSchedule(infos, callback) {
	if(infos.role && infos.user) {
		let errorCode = Errors.E_CONFLICTING_PARAMETERS;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error, []);
	}else if (isNaN(infos.first_spot) != isNaN(infos.last_spot)) {
		let errorCode = Errors.E_CONFLICTING_PARAMETERS;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error, []);
	}else if (!IsValidDatetime(infos.date_start) || !IsValidDatetime(infos.date_end)) {
		let errorCode = Errors.E_DATETIME_FORMAT_INVALID;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error, []);
	}else if (infos.date_start > infos.date_end){
		let errorCode = Errors.E_WRONG_DATETIME_ORDER;
		let error = new Error(errorCode);
		error.code = errorCode;
		callback(error, []);
	}else if (!isNaN(infos.first_spot)){
		GetSpots((err,first_spot) =>{
			if(err){
				callback(err,{});
			}else if(first_spot.length != 1){
				let errorCode = Errors.E_SPOT_NOT_FOUND;
				let error = new Error(errorCode);
				error.code = errorCode;
				callback(error, []);
			}else{
				GetSpots((err, last_spot) => {
					if(err){
						callback(err, {});
					}else if(last_spot.length != 1){
						let errorCode = Errors.E_SPOT_NOT_FOUND;
						let error = new Error(errorCode);
						error.code = errorCode;
						callback(error, []);
					}else if(first_spot[0].id_park != last_spot[0].id_park){
						let errorCode = Errors.E_SPOTS_IN_DIFFERENT_PARKINGS;
						let error = new Error(errorCode);
						error.code = errorCode;
						callback(error, []);
					}else if (first_spot[0].floor != last_spot[0].floor){
						let errorCode = Errors.E_SPOTS_IN_DIFFERENT_FLOORS;
						let error = new Error(errorCode);
						error.code = errorCode;
						callback(error, []);
					}else if (first_spot[0].number > last_spot[0].number){
						let errorCode = Errors.E_SPOTS_IN_DIFFERENT_FLOORS;
						let error = new Error(errorCode);
						error.code = errorCode;
						callback(error, []);
					}else{
						IsntSpotOverlapping(infos, (err, isntOverlapping)=>{
							if(err){
								callback(err, []);
							}else if(!isntOverlapping){
								let errorCode = Errors.E_OVERLAPPING_SPOTS;
								let error = new Error(errorCode);
								error.code = errorCode;
								callback(error, []);
							}else if(infos.role){
								PostScheduleRole(infos, callback);
							}else{
								PostScheduleUser(infos, callback);
							}
						});
					}
				},{"id":infos.last_spot});
			}
		},{"id":infos.first_spot});
	}else if (infos.role){
		PostScheduleRole(infos, callback);
	}else{
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
function PostScheduleRole(infos, callback) {
	GetPermRole((err, data) => {
		if (err) {
			callback(err, data);
		} else if (data.length != 1) {
			let errorCode = Errors.E_ROLE_NOT_FOUND;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error, {});
		} else {
			sql = `SELECT id FROM ${dbName}.User WHERE role LIKE :role`;
			console.log("SQL at PostScheduleRole : " + sql + " with " + JSON.stringify(infos));
			dbConnection.query(sql, {
				role: infos.role || '%'
			}, (err, data) => {
				if (err) {
					callback(err, data);
				} else {
					console.log(data)
					IsntScheduleOverlappingForList(infos, data.map(i => i.id), (err, isntOverlapping) => {
						if (err) {
							callback(err, {});
						} else if (!isntOverlapping) {
							let errorCode = Errors.E_OVERLAPPING_SCHEDULES;
							let error = new Error(errorCode);
							error.code = errorCode;
							callback(error, {});
						} else {
							PostScheduleUsers(infos, data.map(i => i.id), callback);
						}
					});
				}
			});
		}
	}, { "role": infos.role });
}

/**
 * PostScheduleUser
 * Insert a schedule for the user in the database
 * 
 * @param {object} infos {user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostScheduleUser(infos, callback) {
	GetUsers((err, data) => {
		if (err) {
			callback(err, data);
		} else if (data.length != 1) {
			let errorCode = Errors.E_USER_NOT_FOUND;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error, {});
		} else {
			IsntScheduleOverlapping(infos, (err, isntOverlapping) => {
				if (err) {
					callback(err, {});
				} else if (!isntOverlapping) {
					let errorCode = Errors.E_OVERLAPPING_SCHEDULES;
					let error = new Error(errorCode);
					error.code = errorCode;
					callback(error, {});
				} else {
					sql = `INSERT INTO ${dbName}.Schedule (id_user, id_parking, date_start, date_end, first_spot, last_spot) VALUES (:user, :parking, :date_start, :date_end, :first_spot, :last_spot);`;
					//console.log("SQL at PostScheduleUser : " + sql + " with " + JSON.stringify(infos));
					dbConnection.query(sql, {
						user:infos.user,
						parking:infos.parking,
						date_start:infos.date_start,
						date_end:infos.date_end,
						first_spot:infos.first_spot||null,
						last_spot:infos.last_spot||null
					}, callback);
				}
			});
		}
	}, { id: infos.user });
}

/**
 * PostScheduleUsers
 * Insert schedules for all users in the array
 * 
 * @param {object} infos {role, parking, date_start, date_end}
 * @param {Array<string>} ids IDs of the users
 * @param {function(*,*)} callback (err, data)
 */
function PostScheduleUsers(infos, ids, callback) {
	PostScheduleUser({
		user: ids.pop(),
		parking: infos.parking,
		date_start: infos.date_start,
		date_end: infos.date_end
	}, (err, data) => {
		if (err) {
			callback(err, data);
		} else if (ids.length > 0) {
			PostScheduleUsers(infos, ids, callback);
		} else {
			callback(err, data);
		}
	});
}

function GetScheduleById(id, callback){
	sql = `SELECT s.id, s.id_user AS user, u.last_name, u.role, p.name, s.id_parking AS parking, DATE_FORMAT(s.date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(s.date_end,"%Y-%m-%dT%T") AS date_end, s.first_spot, s.last_spot FROM ${dbName}.Schedule s JOIN ${dbName}.User u ON s.id_user = u.id JOIN ${dbName}.Parking p ON s.id_parking = p.id WHERE s.id=:id;`;
	dbConnection.query(sql, {id:id}, callback);
}

function UpdateSchedule(infos, callback){
	//infos has {id, user, parking, date_start, date_end}
	//Check date_start syntax

	let doSqlRequest = (schedule) => {
		//insert sql
		sql = `UPDATE ${dbName}.Schedule SET id_user=:user, id_parking=:parking, date_start=:start, date_end=:end, first_spot=:first, last_spot=:last WHERE id=:id`
		dbConnection.query(sql, schedule, callback);
	}

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
				schedule = {start:data.date_start, end:data.date_end, user:data.user, parking:data.parking, first:data.first_spot, last:data.last_spot, id:infos.id}
				if (infos.date_start) schedule.start = infos.date_start
				if (infos.date_end) schedule.end = infos.date_end
				if (infos.user) schedule.user = infos.user
				if (infos.parking) schedule.parking = infos.parking
				if (infos.first_spot) schedule.first = infos.first_spot
				if (infos.last_spot) schedule.last = infos.last_spot

				// check schedule order
				if (schedule.end < schedule.start){
					let errorCode = Errors.E_WRONG_DATETIME_ORDER;
					let error = new Error(errorCode);
					error.code = errorCode;
					callback(error,{});
					return;
				}

				//check schedule overlap
				IsntScheduleOverlapping(schedule, (err, no_overlap) => {
					if (err){
						callback(err, {})
					}else{
						if (no_overlap){
							
							// get first spot
							if (schedule.first && schedule.last){
								GetSpots((err, first_spot) => {
									if (err){
										callback(err, [])
									}else if (first_spot.length == 0){
											let errorCode = Errors.E_SPOT_NOT_FOUND;
											let error = new Error(errorCode);
											error.code = errorCode;
											callback(error,{});
											return;
									}else{
										// get second spot
										GetSpots((err, last_spot) => {
											if (err){
												callback(err, [])
											}else if(last_spot.length == 0){
												let errorCode = Errors.E_SPOT_NOT_FOUND;
												let error = new Error(errorCode);
												error.code = errorCode;
												callback(error,{});
												return;
											}else{
												first_spot = first_spot[0]
												last_spot = last_spot[0]
												//check spot restriction error
												if (first_spot.id_park != last_spot.id_park){
													let errorCode = Errors.E_SPOTS_IN_DIFFERENT_PARKINGS;
													let error = new Error(errorCode);
													error.code = errorCode;
													callback(error,{});
													return;
												}else if (first_spot.id_park != schedule.parking){
													let errorCode = Errors.E_SPOTS_PARKING_DIFFERENT_SCHEDULE_PARKING;
													let error = new Error(errorCode);
													error.code = errorCode;
													callback(error,{});
													return;
												}else if (first_spot.floor != last_spot.floor){
													let errorCode = Errors.E_SPOTS_IN_DIFFERENT_FLOORS;
													let error = new Error(errorCode);
													error.code = errorCode;
													callback(error,{});
													return;
												}else if (first_spot.number >= last_spot.number){
													let errorCode = Errors.E_WRONG_SPOT_ORDER;
													let error = new Error(errorCode);
													error.code = errorCode;
													callback(error,{});
													return;
												}else{
													//Check overlapping spots
													IsntSpotOverlapping({date_start:schedule.start, date_end:schedule.end, first_spot:schedule.first, last_spot:schedule.last}, (err, no_overlap_spot) => {
														if (no_overlap_spot){
															doSqlRequest(schedule)
														}else{
															let errorCode = Errors.E_OVERLAPPING_SPOTS;
															let error = new Error(errorCode);
															error.code = errorCode;
															callback(error,{});
															return;
														}
													})
												}
											}
										}, {id:schedule.last})
									}
								}, {id:schedule.first})
							}else{
								doSqlRequest(schedule);
							}
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
function IsntScheduleOverlapping(infos, callback) {
	sql = `SELECT * FROM ${dbName}.Schedule WHERE id_user=:user AND (date_start < :date_end AND date_end > :date_start);`;
	//console.log("SQL at IsntScheduleOverlapping : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, infos, (err, data) => {
		if (err) {
			callback(err, data)
		} else {
			callback(err, data.length == 0);
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
function IsntScheduleOverlappingForList(infos, ids, callback) {
	IsntScheduleOverlapping({
		user: ids.pop(),
		date_start: infos.date_start,
		date_end: infos.date_end
	}, (err, isntOverlapping) => {
		if (err) {
			callback(err, isntOverlapping);
		} else if (ids.length > 0 && isntOverlapping) {
			IsntScheduleOverlappingForList(infos, ids, callback);
		} else {
			callback(err, isntOverlapping);
		}
	});
}

/**
 * IsntSpotOverlapping
 * Check if the new schedule isn't overlapping an existing one ON SPOTS (true if no overlapping)
 * Hint : Use it after checking with IsntScheduleOverlapping
 * 
 * @param {object} infos {date_start, date_end, first_spot, last_spot}
 * @param {function(*,*)} callback (err, data)
 */
function IsntSpotOverlapping(infos, callback) {
	GetSpots((err,first_spot) =>{
		if(err){
			callback(err,{});
		}else if(first_spot.length != 1){
			let errorCode = Errors.E_SPOT_NOT_FOUND;
			let error = new Error(errorCode);
			error.code = errorCode;
			callback(error, []);
		}else{
			GetSpots((err, last_spot) => {
				if(err){
					callback(err, {});
				}else if(last_spot.length != 1){
					let errorCode = Errors.E_SPOT_NOT_FOUND;
					let error = new Error(errorCode);
					error.code = errorCode;
					callback(error, []);
				}else{
					sql = `SELECT s.id FROM ${dbName}.Schedule s JOIN ${dbName}.Spot spf ON s.first_spot=spf.id JOIN ${dbName}.Spot spl ON s.last_spot=spl.id WHERE s.date_start < :date_end AND s.date_end > :date_start AND spf.number < :first_spot AND spl.number > :last_spot;`;
					//console.log("SQL at IsntSpotOverlapping : " + sql + " with " + JSON.stringify(infos));
					dbConnection.query(sql, infos, (err, data) => {
						if (err) {
							callback(err, data)
						} else {
							callback(err, data.length == 0);
						}
					});
				}
			}, {"id":infos.last_spot});
		}
	},{"id":infos.first_spot});
}

/**
 * DeleteUSchedule
 * Delete user by id
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {int} id
 */
function DeleteSchedule(callback, id){
	sql = `DELETE FROM ${dbName}.Schedule WHERE id=:id;`;
	//console.log("SQL at DeleteUser : " + sql + " with id=" + id);
	dbConnection.query(sql, {
		id:id
	}, callback);
}

/**
 * AdaptSchedule
 * Adapt a schedule for the place suppression
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {int} id
 */
function AdaptSchedule(callback, id){
	sql = `SELECT id, first_spot, last_spot FROM ${dbName}.Schedule WHERE first_spot=:id`;
	dbConnection.query(sql, {
		id:id
	}, (err, data) => {
		if (err){
			callback(err, {})
		}
		else{
			console.log(data)
			AdaptScheduleStart((err, res) => {
				if (err){
					callback(err, res);
				}
				else {
					sql = `SELECT id, first_spot, last_spot FROM ${dbName}.Schedule WHERE last_spot=:id`;
					dbConnection.query(sql, {
						id:id
					}, (err, data) => {
						if (err){
							callback(err, res);
						}
						else{
							console.log(data)
							AdaptScheduleEnd((err, res) => {
								callback(err, res);
							}, data)
						}
					}, {
						id:id
					})
				}
			}, data);
		}
	});
}

/**
 * AdaptScheduleStart
 * Adapt a schedule for the first place suppression
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {Array} fdata {id, first_spot, last_spot}
 */
function AdaptScheduleStart(callback, fdata){
	if (fdata.length == 0){
		callback(null, {})
	}
	else {
		let info = fdata.shift()
		let id_schedule = info.id
		let first_spot = info.first_spot
		let last_spot = info.last_spot
		sql = `SELECT number, floor, id_park FROM ${dbName}.Spot WHERE id=:id`;
		dbConnection.query(sql, {
			id:first_spot
		}, (err, data) => {
			if (err){
				callback(err, {})
			}
			else{
				console.log(data)
				let place_a_modifier = data.shift()
				sql = `SELECT id FROM ${dbName}.Spot WHERE number > :prev_num AND id_park=:prev_id_park AND floor=:prev_floor ORDER BY number LIMIT 1`;
				dbConnection.query(sql, {
					prev_num:place_a_modifier.number,
					prev_id_park:place_a_modifier.id_park,
					prev_floor:place_a_modifier.floor
				}, (err, data) => {
					if (err){
						callback(err, {})
					}
					else{
						if (data[0].id == last_spot){
							DeleteSchedule((err, data) => {
								if (err){
									callback(err, data);
								}
								else if (fdata.length > 0){
									AdaptScheduleStart((err, data) => {
										callback(err, data);
									}, fdata)
								}
								else {
									callback(err, data)
								}
							}, id_schedule)
						}
						else{
							sql = `UPDATE ${dbName}.Schedule SET first_spot=:new WHERE id=:id`;
							dbConnection.query(sql, {
								id:id_schedule,
								new:data[0].id
							}, (err, data) => {
								if (err){
									callback(err, data);
								}
								else if (fdata.length > 0){
									AdaptScheduleStart((err, data) => {
										callback(err, data);
									}, fdata)
								}
								else {
									callback(err, data)
								}
							})
						}
					}
				})
			}
		})
	}
}

/**
 * AdaptScheduleEnd
 * Adapt a schedule for the last place suppression
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {Array} fdata {id, first_spot, last_spot}
 */
function AdaptScheduleEnd(callback, fdata){
	if (fdata.length == 0){
		callback(null, {})
	}
	else {
		let info = fdata.shift()
		let id_schedule = info.id
		let first_spot = info.first_spot
		let last_spot = info.last_spot
		sql = `SELECT number, floor, id_park FROM ${dbName}.Spot WHERE id=:id`;
		dbConnection.query(sql, {
			id:last_spot
		}, (err, data) => {
			if (err){
				callback(err, {})
			}
			else{
				let place_a_modifier = data.shift()
				sql = `SELECT id FROM ${dbName}.Spot WHERE number < :prev_num AND id_park=:prev_id_park AND floor=:prev_floor ORDER BY number DESC LIMIT 1`;
				dbConnection.query(sql, {
					prev_num:place_a_modifier.number,
					prev_id_park:place_a_modifier.id_park,
					prev_floor:place_a_modifier.floor
				}, (err, data) => {
					if (err){
						callback(err, {})
					}
					else{
						if (data[0].id == first_spot){
							DeleteSchedule((err, data) => {
								if (err){
									callback(err, data);
								}
								else if (fdata.length > 0){
									AdaptScheduleEnd((err, data) => {
										callback(err, data);
									}, fdata)
								}
								else {
									callback(err, data)
								}
							}, id_schedule)
						}
						else{
							sql = `UPDATE ${dbName}.Schedule SET last_spot=:new WHERE id=:id`;
							dbConnection.query(sql, {
								id:id_schedule,
								new:data[0].id
							}, (err, data) => {
								if (err){
									callback(err, data);
								}
								else if (fdata.length > 0){
									AdaptScheduleEnd((err, data) => {
										callback(err, data);
									}, fdata)
								}
								else {
									callback(err, data)
								}
							})
						}
					}
				})
			}
		})
	}
}

module.exports = {GetSchedules, PostSchedule, UpdateSchedule, DeleteSchedule, GetScheduleById, AdaptSchedule};
