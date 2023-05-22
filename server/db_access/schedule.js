const { dbConnection } = require('../database');
const { GetSpots } = require('./spot');
const Errors = require('../errors');
const { GetUsersFromRoleArray } = require("./reunion");
const { GetAllSpots } = require('./spot');

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
 * @param {object} infos {role, user, id}
 * @param {function(*,*)} callback (err, data)
 */
function GetSchedules(infos, callback){
	let doSqlRequest = (users) => {
		let sql = `SELECT DISTINCT s.* FROM Schedule s`
		if (users.length != 0){
			sql += ` JOIN User_Schedule us ON s.id = us.id_schedule 
			WHERE us.id_user IN (:users)`
		}
		if (infos.id){
			if (sql.includes("WHERE")){
				sql += " AND s.id = :id"
			}else{
				sql += " WHERE s.id = :id"
			}
		}

		dbConnection.query(sql, {users:users.length!=0?users:[0], id:infos.id}, (err, schedules) => {
			if (err) return callback(err, null);
			if (schedules.length == 0){
				callback(null, [])
			}else{
				// {id, type, id_parking, date_start, date_end}
				let sql = "SELECT * FROM Parking";
				dbConnection.query(sql, (err, parkings) => {
					const { GetUsers } = require('./user');
					if (err) return callback(err, null);
					GetUsers({}, (err, users) => {
						if (err) return callback(err, null);
						GetSpots({}, (err, spots) => {
							if (err) return callback(err, null);
							let sql = "SELECT * FROM Schedule_Spot"
							dbConnection.query(sql, (err, mnspot) => {
								if (err) return callback(err, null);
								let sql = "SELECT * FROM User_Schedule"
								dbConnection.query(sql, (err, mnuser) => {
									if (err) return callback(err, null);
									for (let schedule of schedules){
										schedule.parking = parkings.find(e => e.id == schedule.id_parking);
										let newmnuser = mnuser.filter(e => e.id_schedule == schedule.id && e.is_guest == 0).map(e => e.id_user);
										let newmnguest = mnuser.filter(e => e.id_schedule == schedule.id && e.is_guest == 1).map(e => e.id_user);
										let newmnspot = mnspot.filter(e => e.id_schedule == schedule.id).map(e => e.id_spot);
										schedule.users = users.filter(e => newmnuser.includes(e.id));
										schedule.guests = users.filter(e => newmnguest.includes(e.id));
										schedule.spots = spots.filter(e => newmnspot.includes(e.id));
										schedule.id_parking = undefined;
									}
									callback(null, schedules);
								})
							})
						})
					})
				})
			}
		})
	}

	if (!infos.roles && !infos.users && !infos.id){
		const { GetUsers } = require('./user');
		GetUsers({}, (err, data) => {
			if (err) return callback(err, null);
			doSqlRequest(data.map(e => e.id))
		})
	}else{
		let users = [];
		if (infos.users){
			users = users.concat(infos.users);
		}
		if (infos.roles){
			GetUsersFromRoleArray(infos.roles, (err, data) => {
				if (err) return callback(err, null);
				if (data){
					users = users.concat(data.map(e => e.id));
				}
				doSqlRequest(users);
			} )
		}else{
			doSqlRequest(users);
		}
	}
}

/**
 * PostSchedule
 * Insert a/several schedule(s) in the database
 * 
 * @param {object} infos {roles, users, guests, parking, date_start, date_end, spots, type}
 * @param {function(*,*)} callback (err, data)
 */
function PostSchedule(infos, callback) {	
	if (!infos.roles && !infos.users) return Errors.SendError(Errors.E_MISSING_PARAMETER, "Un des champs suivant doit être rempli : users, roles", callback);
	if (!infos.type) return Errors.SendError(Errors.E_TYPE_DONT_EXIST, "Aucun type n'a été demandé.", callback);
	if (!IsValidDatetime(infos.date_start) || !IsValidDatetime(infos.date_end)) return Errors.SendError(Errors.E_DATETIME_FORMAT_INVALID, "Le format de la date est invalide.", callback);
	if (infos.date_start > infos.date_end) return Errors.SendError(Errors.E_WRONG_DATETIME_ORDER, "La date de fin ne peut pas précéder la date de commencement.", callback);
	
	let doSqlRequest = (users, guests, spots) => {
		if (!infos.parking) infos.parking = null;
		let res = FixUsersGuests(users, guests);
		users = res[0];
		guests = res[1];
		if (users.length == 0) return Errors.SendError(Errors.E_USER_NOT_FOUND, "Aucun utilisateur obligatoire à ajouter au créneau.", callback);

		//Copy of users because IsntSchedule function empty the users variable
		users_copy = []
		for (let user of users){
			users_copy.push(user);
		}

		IsntScheduleOverlappingForList({date_start: infos.date_start, date_end: infos.date_end}, users, (err, isntOverlapping) => {
			if (err) return callback(err, null);
			if (!isntOverlapping) return Errors.SendError(Errors.E_OVERLAPPING_SCHEDULES, "Les créneaux se superpose pour au moins un des utilisateurs.", callback);

			// Insert schedule
			let sql = `INSERT INTO Schedule(type, id_parking, date_start, date_end) VALUES (:type, :parking, :date_start, :date_end)`
			dbConnection.query(sql, infos, (err, data) => {
				if (err) return callback(err, null);

				var id_schedule = data.insertId;
				//Insert USERS user_schedule
				InsertUsersSchedules(users_copy, id_schedule, false, infos.type, (err, data) => {
					if (err) return callback(err, null);
					// Insert GUESTS user_schedule
					InsertUsersSchedules(guests, id_schedule, true, infos.type, (err, data) => {
						if (err) return callback(err, null);
						InsertSpotsSchedules(spots.map(e => e.id), id_schedule, callback)
					})
				})
			})
		})
	}

	let getUsersFromParameters = (spots) => {
		// Get users_id from parameters
		let users = [];
		let guests = [];
		if (infos.users) users = users.concat(infos.users);
		if (infos.guests) guests = guests.concat(infos.guests);
		if (infos.roles){
			GetUsersFromRoleArray(infos.roles, (err, data) => {
				if (err) return callback(err, null);
				if (data){
					guests = guests.concat(data.map(e => e.id));
				}
				doSqlRequest(users, guests, spots);
			} )
		}else{
			doSqlRequest(users, guests, spots);
		}
	}
		
	
	// Check spots if exists
	var spots = [];
	if (infos.parking) {
		if (infos.type == "Nettoyage"){
			if (infos.spots.length == 0) return Errors.SendError(Errors.E_SPOT_NOT_FOUND, "Aucun spot n'a été donné.", callback);
			GetAllSpots({}, (err, spots) => {
				if (err) return callback(err, null);
				spots = spots.filter(e => infos.spots.includes(e.id))
				for (let spot of spots){
					if (spot.id_park != infos.parking){
						return Errors.SendError(Errors.E_SPOTS_IN_DIFFERENT_FLOORS, "Au moins une des places n'est pas dans le parking demandé.", callback);
					}
				}
				getUsersFromParameters(spots)
			})
		}else{
			getUsersFromParameters(spots)
		}
		
	}else{
		if (infos.type != "Réunion") return Errors.SendError(Errors.E_WRONG_TYPE_SCHEDULE, "Les créneaux n'étant pas des réunions ont besoin d'avoir un parking attribué.", callback)
		getUsersFromParameters(spots)
	}
}

/**
 * FixUsersGuests
 * Remove duplicated id in the two arrays
 * If an id is includes in the two arrays, remove the one from guests
 * (Because: if someone is a guest and a required person, it's just a required person)
 * 
 * @param {Array<integer>} users 
 * @param {Array<integer>} guests 
 */
function FixUsersGuests(users, guests, previous=[]){
	// Found the two next line in : https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
	users = [...new Set(users)];
	guests = [...new Set(guests)];

	// Get index of all duplicata between guests and users
	to_delete_index = [];
	for (let index in guests){
		if (users.includes(guests[index]) && !previous.includes(guests[index])){
			to_delete_index.push(index);
		}
	}

	// Remove all indexes, by descending order to avoid shifted index problems
	to_delete_index.sort((a,b) => a[0]<b[0]?-1:1) // Descending order sort
	for (let index in to_delete_index){
		guests.splice(index, 1); // remove id
	}

	return [users, guests];
}

/**
 * 
 * @param {Array<integer>} users_id liste des identifiants à ajouter
 * @param {integer} id_schedule le schedule auquel les ajouter
 * @param {boolean} isGuest Si oui ou non les utilisateurs qu'on ajoute sont des invités
 * @param {string} type  Type de notification
 * @param {function(*,*)} callback 
 */
function InsertUsersSchedules(users_id, id_schedule, isGuest, type, callback){
	const { PreparePostNotification, PostNotification } = require("./notification");  // Avoiding circular dependencies

	if (users_id.length == 0){
		callback(null, true)
	}else{
		let userId = users_id.pop();
		let sql = `INSERT INTO User_Schedule (id_user, id_schedule, is_guest) VALUES (:userId, :scheduleId, :isGuest)`
		dbConnection.query(sql, {userId:userId, scheduleId:id_schedule, isGuest:isGuest}, (err, data) => {
			if (err) return callback(err, data);
			PreparePostNotification(userId, "POST", type, id_schedule, (err,data) =>{
				if (err) return callback(err, data);
				PostNotification(data, (err,data) => {
					if (err) return callback(err, data);
					InsertUsersSchedules(users_id, id_schedule, isGuest, type, callback);
				});
			});
		})
	}
}

/**
 * 
 * @param {Array<integer>} spots_id liste des identifiants à ajouter
 * @param {integer} id_schedule le schedule auquel les ajouter
 * @param {function(*,*)} callback 
 */
function InsertSpotsSchedules(spots_id, id_schedule, callback){
	if (spots_id.length == 0){
		callback(null, true)
	}else{
		let spotId = spots_id.pop();
		let sql = `INSERT INTO Schedule_Spot VALUES (:scheduleId, :spotId)`
		dbConnection.query(sql, {spotId:spotId, scheduleId:id_schedule}, (err, data) => {
			if (err) return callback(err, data);
			InsertSpotsSchedules(spots_id, id_schedule, callback);
		})
	}
}

function GetScheduleById(id, callback){
	GetSchedules({id:id}, callback);
}

/**
 * 
 * @param {*} infos {id, users, guests, date_start, date_end, spots}
 * @param {function(*,*)} callback 
 */
function UpdateSchedule(infos, callback){
	const { PrepareListPostNotification, ListPostNotification } = require("./notification");  // Avoiding circular dependencies

	if(!infos.users && !infos.guests) return Errors.SendError(Errors.E_MISSING_PARAMETER, "un des deux champs suivant dois être remplis : users, guests", callback);
	if(!parseInt(infos.id)) return Errors.SendError(Errors.E_WRONG_ID_FORMAT, "l'id doit être un nombre", callback);

	let UpdateScheduleTable = (id, date_start, date_end, suite) => {
		if (date_start || date_end){

			let toChange = {}
			if (date_start){
				if (!IsValidDatetime(date_start)) return Errors.SendError(Errors.E_DATETIME_FORMAT_INVALID, "Le format de la date est invalide.", suite);
				else {
					toChange.start = date_start;
				}
			}
			if (date_end){
				if (!IsValidDatetime(date_end)) return Errors.SendError(Errors.E_DATETIME_FORMAT_INVALID, "Le format de la date est invalide.", suite);
				else {
					toChange.end = date_end;
				}
			}

			GetScheduleById(id, (err, schedule) => {
				if (err) return suite(err, null);
				if (!toChange.start) toChange.start = schedule.date_start;
				if (!toChange.end) toChange.end = schedule.date_end;
				if (toChange.start > toChange.end) return Errors.SendError(Errors.E_WRONG_DATETIME_ORDER, "Le créneau ne peut pas commencer après avoir fini.", suite);
				toChange.id = infos.id
				let sql = `UPDATE Schedule SET date_start=:start, date_end=:end WHERE id=:id`
				dbConnection.query(sql, toChange, suite)
			})


			
		}else{
			suite(null, null)
		}
	}

	let ToggleSpotSchedule = (id, spots, suite) => {
		if (spots.length == 0){
			suite(null, true);
		}else{
			idSpot = spots.pop();
			let sql = `SELECT * FROM Schedule_Spot WHERE id_schedule=:id AND id_spot=:spotid`

			dbConnection.query(sql, {id:id, spotid:idSpot}, (err, data) => {
				if (err) return suite(err, data);
				if (data.length == 0){
					//relation not existing, add it
					let sql = `INSERT INTO Schedule_Spot (id_schedule, id_spot) VALUES (:id, :spotid)`
					dbConnection.query(sql, {id:id, spotid:idSpot}, (err, data) => {
						if (err) return suite(err, data);
						ToggleSpotSchedule(id, spots, suite);
					})
				}else{
					//relation existing, delete it
					let sql = `DELETE FROM Schedule_Spot WHERE id_schedule=:id AND id_spot=:spotid`
					dbConnection.query(sql, {id:id, spotid:idSpot}, (err, data) => {
						if (err) return suite(err, data);
						ToggleSpotSchedule(id, spots, suite);
					})
				}
			})
		}
	}

	let ToggleUserSchedule = (id, users, isGuest, suite) => {
		if (users.length == 0){
			suite(null, true);
		}else{
			idUser = users.pop();
			let sql = `SELECT * FROM User_Schedule WHERE id_schedule=:id AND id_user=:idUser`

			dbConnection.query(sql, {id:id, idUser:idUser}, (err, data) => {
				if (err) return suite(err, data);
				if (data.length == 0){
					//relation not existing, add it
					let sql = `INSERT INTO User_Schedule (id_user, id_schedule, is_guest) VALUES (:idUser, :id, :isGuest)`
					dbConnection.query(sql, {id:id, idUser:idUser, isGuest:isGuest?1:0}, (err, data) => {
						if (err) return suite(err, data);
						ToggleUserSchedule(id, users, isGuest, suite);
					})
				}else{
					//relation existing, delete it
					let sql = `DELETE FROM User_Schedule WHERE id_schedule=:id AND id_user=:idUser`
					dbConnection.query(sql, {id:id, idUser:idUser}, (err, data) => {
						if (err) return suite(err, data);
						ToggleUserSchedule(id, users, isGuest, suite);
					})
				}
			})
		}
	}

	let SwitchUserSchedule = (id, users, prevStates, suite) => {
		if(users.length == 0){
			suite(null, true);
		}else{
			let idUser = users.pop();
			let prevstate = prevStates.filter(elt => elt.id_user == idUser);
			let newState = !!!prevstate[0].is_guest;

			let sql = `UPDATE User_Schedule SET is_guest = :is_guest WHERE id_schedule = :id_schedule AND id_user = :id_user`;

			dbConnection.query(sql, {
				is_guest: newState?1:0,
				id_schedule: id,
				id_user: idUser
			}, (err, data) => {
				if(err) return suite(err, null);
				SwitchUserSchedule(id, users, prevStates, suite);
			})
		}
	}

	let doUpdate = (users, guests, switchUser, dataPrevious, callback) => {

		//Start all functions
		UpdateScheduleTable(infos.id, infos.date_start, infos.date_end, (err, data) => {
			if (err) return callback(err, null);
		
			let spots = [];
			if (infos.spots){
				spots = spots.concat(infos.spots);
			}
		
			spots = [...new Set(spots)] // remove duplicated elements;

			ToggleSpotSchedule(infos.id, spots, (err, data) => {
				if (err) return callback(err, null);
			
				SwitchUserSchedule(infos.id, switchUser, dataPrevious, (err, data) => {
					if(err) return callback(err, null);
	
					ToggleUserSchedule(infos.id, users, false, (err, data) => {
						if (err) return callback(err, null);
						
						ToggleUserSchedule(infos.id, guests, true, (err, data) => {
							if (err) return callback(err, null);
							callback(null, null)
						})
					})
				})
			});
		})
	}
	
	// Get users_id from parameters
	let users = infos.users ? infos.users : [];
	let guests = infos.guests ? infos.guests : [];


	let sql = `SELECT id_user, is_guest FROM User_Schedule WHERE id_schedule=:id`;
	dbConnection.query(sql, {id: infos.id}, (err, dataPrevious) => {
		if(err){
			return callback(err, null);
		}else{
			let userAvant = dataPrevious.map(elt => elt.id_user);

			let switchUser = [];
			let postUser = [];
			let putUser = [];
			let deleteUser = [];
			
			userAvant.forEach(idU => {
				inU = users.includes(idU);
				inG = guests.includes(idU);
				if(!inU && !inG){
					putUser.push(idU);
				}else if(inU && inG){
					switchUser.push(idU);
					putUser.push(idU);
				}else{
					deleteUser.push(idU);
				}
			});
			users.forEach(idU => {
				if(!userAvant.includes(idU)){
					postUser.push(idU);
				}
			});
			guests.forEach(idU => {
				if(!userAvant.includes(idU) && !users.includes(idU)){
					postUser.push(idU);
				}
			});

			users = users.filter(idU => !switchUser.includes(idU));
			guests = guests.filter(idU => !switchUser.includes(idU));

			PrepareListPostNotification(postUser, "POST", "", infos.id, (err, notifsPost) => {
				if(err){
					return callback(err, null);
				}else{
					PrepareListPostNotification(putUser, "PUT", "", infos.id, (err, notifsPut) => {
						if(err){
							return callback(err, null);
						}else{
							PrepareListPostNotification(deleteUser, "DELETE", "", infos.id, (err, notifsDelete) => {
								if(err){
									return callback(err, null);
								}else{
									let allNotifs = notifsPost.concat(notifsPut).concat(notifsDelete);

									doUpdate(users, guests, switchUser, dataPrevious, (err, data) => {
										if(err){
											return callback(err, data);
										}else{
											ListPostNotification(allNotifs, (err, data) => {
												if(err){
													return callback(err, null);
												}else{
													return callback(null, null);
												}
											})
										}
									});
								}
							})
						}
					})
				}
			})
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
	sql = `SELECT * FROM User_Schedule us
		   	JOIN Schedule s on us.id_schedule = s.id
			WHERE 
			id_user=:user AND is_guest=0 AND 
			(date_start < :date_end AND date_end > :date_start);`;
	
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
 * DeleteSchedule
 * Delete a schedule by id
 * 
 * @param {int} id
 * @param {function(*,*)} callback (err, data)
 */
function DeleteSchedule(id, callback){
	const { PrepareListPostNotification, ListPostNotification } = require("./notification");  // Avoiding circular dependencies
	
	let sql = `SELECT id_user FROM User_Schedule WHERE id_schedule=:id`;
	dbConnection.query(sql, {id:id}, (err,data) => {
		let ids_user = data.map(elem => elem.id_user);
		PrepareListPostNotification(ids_user, "DELETE", "", id, (err, preparedNotifications) => {
			//Remove from MN Table User_Schedule
			let sql = `DELETE FROM User_Schedule WHERE id_schedule=:id`
			dbConnection.query(sql, {id:id}, (err, data) => {
				if (err) return callback(err, null);
				//Remove from MN Table Schedule_Spot
				let sql = `DELETE FROM Schedule_Spot WHERE id_schedule=:id`
				dbConnection.query(sql, {id:id}, (err, data) => {
					if (err) return callback(err, null);
					sql = `DELETE FROM Schedule WHERE id=:id;`;
					dbConnection.query(sql, {id:id}, (err, deletedData) => {
						if(err){
							callback(err,data);
						}else{
							ListPostNotification(preparedNotifications, (err,data)=>callback(err, deletedData));
						}
					});
				});
			});
		});
	});
}

module.exports = {GetSchedules, PostSchedule, UpdateSchedule, DeleteSchedule, GetScheduleById};