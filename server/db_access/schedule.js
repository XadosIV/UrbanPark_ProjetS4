const { dbConnection } = require('../database');
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
 * @param {object} infos {role, user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function GetSchedules(infos, callback) {
	if (infos.role && infos.user) {
		Errors.SendError(Errors.E_CONFLICTING_PARAMETERS, "Un seul champs peut être définit parmis : role, user", callback);
	} else if (infos.role) {
		GetSchedulesRole(infos, callback);
	} else {
		GetSchedulesUser(infos, callback);
	}
}

/**
 * GetSchedulesRoles
 * Return a JSON with every schedule corresponding to paramaters (search by user disabled)
 * 
 * @param {object} infos {role, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function GetSchedulesRole(infos, callback) {
	sql = `SELECT s.id, s.type, s.id_user AS user, u.last_name, u.role, p.name, s.id_parking AS parking, DATE_FORMAT(s.date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(s.date_end,"%Y-%m-%dT%T") AS date_end, s.first_spot, s.last_spot FROM Schedule s JOIN User u ON s.id_user = u.id JOIN Parking p ON s.id_parking = p.id WHERE u.role LIKE :role AND s.id_parking LIKE :parking AND s.date_start LIKE :date_start AND s.date_end LIKE :date_end AND (s.first_spot LIKE :first_spot OR '%' LIKE :first_spot) AND (s.last_spot LIKE :last_spot OR '%' LIKE :last_spot);`;
	// console.log("SQL at GetSchedulesRole : " + sql + " with " + JSON.stringify(infos));
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
 * @param {object} infos {user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function GetSchedulesUser(infos, callback) {
	sql = `SELECT s.id, s.type, s.id_user AS user, u.last_name, u.role, p.name, s.id_parking AS parking, DATE_FORMAT(s.date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(s.date_end,"%Y-%m-%dT%T") AS date_end, s.first_spot, s.last_spot FROM Schedule s JOIN User u ON s.id_user = u.id JOIN Parking p ON s.id_parking = p.id WHERE id_user LIKE :user AND id_parking LIKE :parking AND date_start LIKE :date_start AND date_end LIKE :date_end AND (s.first_spot LIKE :first_spot OR '%' LIKE :first_spot) AND (s.last_spot LIKE :last_spot OR '%' LIKE :last_spot);`;
	// console.log("SQL at GetSchedulesUser : " + sql + " with " + JSON.stringify(infos));
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
		Errors.SendError(Errors.E_CONFLICTING_PARAMETERS, 
			"Un seul champ peut être définit parmis : role, user.",
			callback);
	}else if (isNaN(infos.first_spot) != isNaN(infos.last_spot)) {
		Errors.SendError(Errors.E_MISSING_PARAMETER, 
			"Les champs suivants doivent être définits : first_spot, last_spot.",
			callback);
	}else if (!IsValidDatetime(infos.date_start) || !IsValidDatetime(infos.date_end)) {
		Errors.SendError(Errors.E_DATETIME_FORMAT_INVALID, "Le format de la date est invalide.", callback);
	}else if (infos.date_start > infos.date_end){
		Errors.SendError(Errors.E_WRONG_DATETIME_ORDER, "La date de fin ne peut pas précéder la date de commencement.", callback);
	}else if (!isNaN(infos.first_spot)){
		GetSpots({"id":infos.first_spot}, (err,first_spot) =>{
			if(err){
				callback(err,{});
			}else if(first_spot.length != 1){
				Errors.SendError(Errors.E_SPOT_NOT_FOUND, "L'un des spots de la sélection n'existe pas.", callback);
			}else{
				GetSpots({"id":infos.last_spot}, (err, last_spot) => {
					if(err){
						callback(err, {});
					}else if(last_spot.length != 1){
						Errors.SendError(Errors.E_SPOT_NOT_FOUND, "L'un des spots de la sélection n'existe pas.", callback);
					}else if(first_spot[0].id_park != last_spot[0].id_park){
						Errors.SendError(Errors.E_SPOTS_IN_DIFFERENT_PARKINGS, "Les places sélectionnées ne sont pas dans le même parking.", callback);
					}else if (first_spot[0].floor != last_spot[0].floor){
						Errors.SendError(Errors.E_SPOTS_IN_DIFFERENT_FLOORS, "Les places sélectionnées sont dans le même parking mais pas dans le même étage", callback);
					}else if (first_spot[0].number > last_spot[0].number){
						Errors.SendError(Errors.E_SPOTS_IN_DIFFERENT_FLOORS, "Les places sélectionnées sont dans le même parking mais pas dans le même étage", callback);
					}else{
						IsntSpotOverlapping(infos, (err, isntOverlapping)=>{
							if(err){
								callback(err, []);
							}else if(!isntOverlapping){
								Errors.SendError(Errors.E_OVERLAPPING_SPOTS, "La sélection est superposée à un autre créneau.", callback);
							}else if(infos.role){
								PostScheduleRole(infos, callback);
							}else{
								PostScheduleUser(infos, callback);
							}
						});
					}
				});
			}
		});
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
	GetPermRole({ "role": infos.role }, (err, data) => {
		if (err) {
			callback(err, data);
		} else if (data.length != 1) {
			Errors.SendError(Errors.E_ROLE_NOT_FOUND, "Ce rôle n'existe pas.", callback);
		} else {
			sql = `SELECT id FROM User WHERE role LIKE :role`;
			// console.log("SQL at PostScheduleRole : " + sql + " with " + JSON.stringify(infos));
			dbConnection.query(sql, {
				role: infos.role || '%'
			}, (err, data) => {
				if (err) {
					callback(err, data);
				} else {
					IsntScheduleOverlappingForList(infos, data.map(i => i.id), (err, isntOverlapping) => {
						if (err) {
							callback(err, {});
						} else if (!isntOverlapping) {
							Errors.SendError(Errors.E_OVERLAPPING_SCHEDULES, "Ce créneau est superposé à un autre pour un/des utilisateur(s) saisi(s).", callback);
						} else {
							PostScheduleUsers(infos, data.map(i => i.id), callback);
						}
					});
				}
			});
		}
	});
}

/**
 * PostScheduleUser
 * Insert a schedule for the user in the database
 * 
 * @param {object} infos {user, parking, date_start, date_end}
 * @param {function(*,*)} callback (err, data)
 */
function PostScheduleUser(infos, callback) {
	GetUsers({ id: infos.user }, (err, data) => {
		if (err) {
			callback(err, data);
		} else if (data.length != 1) {
			Errors.SendError(Errors.E_USER_NOT_FOUND, "Cet utilisateur n'existe pas.", callback);
		} else {
			IsntScheduleOverlapping(infos, (err, isntOverlapping) => {
				if (err) {
					callback(err, {});
				} else if (!isntOverlapping) {
					Errors.SendError(Errors.E_OVERLAPPING_SCHEDULES, "Ce créneau est superposé à un autre pour un/des utilisateur(s) saisi(s).", callback);
				} else {
					sql = `INSERT INTO Schedule (id_user, type, id_parking, date_start, date_end, first_spot, last_spot) VALUES (:user, :type, :parking, :date_start, :date_end, :first_spot, :last_spot);`;
					// console.log("SQL at PostScheduleUser : " + sql + " with " + JSON.stringify(infos));
					dbConnection.query(sql, {
						user:infos.user,
						type:infos.type,
						parking:infos.parking,
						date_start:infos.date_start,
						date_end:infos.date_end,
						first_spot:infos.first_spot||null,
						last_spot:infos.last_spot||null
					}, callback);
				}
			});
		}
	});
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
	sql = `SELECT s.id, s.type, s.id_user AS user, u.last_name, u.role, p.name, s.id_parking AS parking, DATE_FORMAT(s.date_start,"%Y-%m-%dT%T") AS date_start, DATE_FORMAT(s.date_end,"%Y-%m-%dT%T") AS date_end, s.first_spot, s.last_spot FROM Schedule s JOIN User u ON s.id_user = u.id JOIN Parking p ON s.id_parking = p.id WHERE s.id=:id;`;
	dbConnection.query(sql, {id:id}, callback);
}

function UpdateSchedule(infos, callback){
	//infos has {id, user, parking, date_start, date_end}
	//Check date_start syntax

	let doSqlRequest = (schedule) => {
		//insert sql
		sql = `UPDATE Schedule SET id_user=:user, id_parking=:parking, date_start=:start, date_end=:end, first_spot=:first, last_spot=:last WHERE id=:id`
		dbConnection.query(sql, schedule, callback);
	}

	if (infos.date_start){
		if (!IsValidDatetime(infos.date_start)){
			return Errors.SendError(Errors.E_DATETIME_FORMAT_INVALID, "Le format de la date est invalide.", callback);
		}
	}
	//Check date_end syntax
	if (infos.date_end){
		if (!IsValidDatetime(infos.date_end)){
			return Errors.SendError(Errors.E_DATETIME_FORMAT_INVALID, "Le format de la date est invalide.", callback);
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
					return Errors.SendError(Errors.E_WRONG_DATETIME_ORDER, "La date de fin ne peut pas précéder la date de commencement.", callback);
				}

				//check schedule overlap
				IsntScheduleOverlapping(schedule, (err, no_overlap) => {
					if (err){
						callback(err, {})
					}else{
						if (no_overlap){
							
							// get first spot
							if (schedule.first && schedule.last){
								GetSpots({id:schedule.first}, (err, first_spot) => {
									if (err){
										callback(err, [])
									}else if (first_spot.length == 0){
										return Errors.SendError(Errors.E_SPOT_NOT_FOUND, "L'un des spots de la sélection n'existe pas.", callback);
									}else{
										// get second spot
										GetSpots({id:schedule.last}, (err, last_spot) => {
											if (err){
												callback(err, [])
											}else if(last_spot.length == 0){
												return Errors.SendError(Errors.E_SPOT_NOT_FOUND, "L'un des spots de la sélection n'existe pas.", callback);
											}else{
												first_spot = first_spot[0]
												last_spot = last_spot[0]
												//check spot restriction error
												if (first_spot.id_park != last_spot.id_park){
													return Errors.SendError(Errors.E_SPOTS_IN_DIFFERENT_PARKINGS, "Les places sélectionnées ne sont pas dans le même parking.", callback);
												}else if (first_spot.id_park != schedule.parking){
													return Errors.SendError(Errors.E_SPOTS_PARKING_DIFFERENT_SCHEDULE_PARKING, "Les places sont dans un parking différent de celui attribué par le créneau.", callback);
												}else if (first_spot.floor != last_spot.floor){
													return Errors.SendError(Errors.E_SPOTS_IN_DIFFERENT_FLOORS, "Les places sélectionnées sont dans le même parking mais pas dans le même étage", callback);
												}else if (first_spot.number >= last_spot.number){
													return Errors.SendError(Errors.E_WRONG_SPOT_ORDER, "La place de fin ne peut pas être avant la place de début.", callback);
												}else{
													//Check overlapping spots
													IsntSpotOverlapping({date_start:schedule.start, date_end:schedule.end, first_spot:schedule.first, last_spot:schedule.last}, (err, no_overlap_spot) => {
														if (no_overlap_spot){
															doSqlRequest(schedule)
														}else{
															return Errors.SendError(Errors.E_OVERLAPPING_SPOTS, "La sélection est superposée à un autre créneau.", callback);
														}
													})
												}
											}
										})
									}
								})
							}else{
								doSqlRequest(schedule);
							}
						}else{
							return Errors.SendError(Errors.E_OVERLAPPING_SCHEDULES, "Ce créneau est superposé à un autre pour l'utilisateur concerné.", callback);
						}
					}
				})
			}else{
				return Errors.SendError(Errors.E_SCHEDULE_NOT_FOUND, "Le créneau demandé n'existe pas.", callback);
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
	sql = `SELECT * FROM Schedule WHERE id_user=:user AND (date_start < :date_end AND date_end > :date_start);`;
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
	GetSpots({"id":infos.first_spot}, (err,first_spot) =>{
		if(err){
			callback(err,{});
		}else if(first_spot.length != 1){
			return Errors.SendError(Errors.E_SPOT_NOT_FOUND, "L'un des spots de la sélection n'existe pas.", callback);
		}else{
			GetSpots({"id":infos.last_spot}, (err, last_spot) => {
				if(err){
					callback(err, {});
				}else if(last_spot.length != 1){
					return Errors.SendError(Errors.E_SPOT_NOT_FOUND, "L'un des spots de la sélection n'existe pas.", callback);
				}else{
					sql = `SELECT s.id FROM Schedule s JOIN Spot spf ON s.first_spot=spf.id JOIN Spot spl ON s.last_spot=spl.id WHERE s.date_start < :date_end AND s.date_end > :date_start AND spf.number < :first_spot AND spl.number > :last_spot;`;
					//console.log("SQL at IsntSpotOverlapping : " + sql + " with " + JSON.stringify(infos));
					dbConnection.query(sql, infos, (err, data) => {
						if (err) {
							callback(err, data)
						} else {
							callback(err, data.length == 0);
						}
					});
				}
			});
		}
	});
}

/**
 * DeleteUSchedule
 * Delete user by id
 * 
 * @param {int} id
 * @param {function(*,*)} callback (err, data)
 */
function DeleteSchedule(id, callback){
	sql = `DELETE FROM Schedule WHERE id=:id;`;
	//console.log("SQL at DeleteUser : " + sql + " with id=" + id);
	dbConnection.query(sql, {
		id:id
	}, callback);
}

/**
 * AdaptSchedule
 * Adapt a schedule for the place suppression
 * 
 * @param {int} id
 * @param {function(*,*)} callback (err, data)
 */
function AdaptSchedule(id, callback){
	sql = `SELECT id, first_spot, last_spot FROM Schedule WHERE first_spot=:id`;
	dbConnection.query(sql, {
		"id":id
	}, (err, data) => {
		if (err){
			callback(err, {})
		}
		else{
			//console.log(data)
			AdaptScheduleStart(data, (err, res) => {
				if (err){
					callback(err, res);
				}
				else {
					sql = `SELECT id, first_spot, last_spot FROM Schedule WHERE last_spot=:id`;
					dbConnection.query(sql, {id:id}, (err, data) => {
						if (err){
							callback(err, res);
						}else{
							//console.log(data)
							AdaptScheduleEnd(data, (err, res) => {
								callback(err, res);
							})
						}
					})
				}
			});
		}
	});
}

/**
 * AdaptScheduleStart
 * Adapt a schedule for the first place suppression
 * 
 * @param {Array} fdata {id, first_spot, last_spot}
 * @param {function(*,*)} callback (err, data)
 */
function AdaptScheduleStart(fdata, callback){
	if (fdata.length == 0){
		callback(null, {})
	}
	else {
		let info = fdata.shift()
		let id_schedule = info.id
		let first_spot = info.first_spot
		let last_spot = info.last_spot
		if (first_spot == last_spot){
			DeleteSchedule(id_schedule, (err, data) => {
				if (err){
					callback(err, data);
				}
				else if (fdata.length > 0){
					AdaptScheduleStart(fdata, (err, data) => {
						callback(err, data);
					})
				}
				else {
					callback(err, data)
				}
			})
		} else {
			sql = `SELECT number, floor, id_park FROM Spot WHERE id=:id`;
			dbConnection.query(sql, {id:first_spot}, (err, data) => {
				if (err){
					callback(err, {})
				}
				else{
					// console.log(data)
					let place_a_modifier = data.shift()
					sql = `SELECT id FROM Spot WHERE number > :prev_num AND id_park=:prev_id_park AND floor=:prev_floor ORDER BY number LIMIT 1`;
					dbConnection.query(sql, {
						prev_num:place_a_modifier.number,
						prev_id_park:place_a_modifier.id_park,
						prev_floor:place_a_modifier.floor
					}, (err, data) => {
						if (err){
							callback(err, {})
						}
						else{
							sql = `UPDATE Schedule SET first_spot=:new WHERE id=:id`;
							dbConnection.query(sql, {
								id:id_schedule,
								new:data[0].id
							}, (err, data) => {
								if (err){
									callback(err, data);
								}
								else if (fdata.length > 0){
									AdaptScheduleStart(fdata, (err, data) => {
										callback(err, data);
									})
								}
								else {
									callback(err, data)
								}
							})
						}
					})
				}
			})
		}
	}
}

/**
 * AdaptScheduleEnd
 * Adapt a schedule for the last place suppression
 * 
 * @param {Array} fdata {id, first_spot, last_spot}
 * @param {function(*,*)} callback (err, data)
 */
function AdaptScheduleEnd(fdata, callback){
	if (fdata.length == 0){
		callback(null, {})
	}
	else {
		let info = fdata.shift()
		let id_schedule = info.id
		let first_spot = info.first_spot
		let last_spot = info.last_spot
		if (data[0].id == first_spot){
			DeleteSchedule(id_schedule, (err, data) => {
				if (err){
					callback(err, data);
				} else if (fdata.length > 0){
					AdaptScheduleEnd(fdata, (err, data) => {
						callback(err, data);
					})
				} else {
					callback(err, data)
				}
			})
		} else {
			sql = `SELECT number, floor, id_park FROM Spot WHERE id=:id`;
			dbConnection.query(sql, {id:last_spot}, (err, data) => {
				if (err){
					callback(err, {})
				}else{
					let place_a_modifier = data.shift()
					sql = `SELECT id FROM Spot WHERE number < :prev_num AND id_park=:prev_id_park AND floor=:prev_floor ORDER BY number DESC LIMIT 1`;
					dbConnection.query(sql, {
						prev_num:place_a_modifier.number,
						prev_id_park:place_a_modifier.id_park,
						prev_floor:place_a_modifier.floor
					}, (err, data) => {
						if (err){
							callback(err, {})
						}
						else{
							sql = `UPDATE Schedule SET last_spot=:new WHERE id=:id`;
							dbConnection.query(sql, {
								id:id_schedule,
								new:data[0].id
							}, (err, data) => {
								if (err){
									callback(err, data);
								}
								else if (fdata.length > 0){
									AdaptScheduleEnd(fdata, (err, data) => {
										callback(err, data);
									})
								} else {
									callback(err, data)
								}
							})
						}
					})
				}
			})
		}
	}
}

module.exports = {GetSchedules, PostSchedule, UpdateSchedule, DeleteSchedule, GetScheduleById, AdaptSchedule};
