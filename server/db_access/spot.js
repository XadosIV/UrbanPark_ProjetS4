const {dbConnection} = require('../database');
const {SpotTypeExists} = require('./spot_type');
const Errors = require('../errors');

/**
 * GetAllSpots
 * Return a JSON with every spots
 * 
 * @param {object} infos {id_park, floor, number, type}
 * @param {function(*,*)} callback (err, data)
 */

function GetAllSpots(infos, callback){
	sql = `SELECT
		s.id,
		s.number,
		s.floor,
		s.id_park,
		u.id AS id_user,
		uu.id AS id_user_temp,
		u.first_name,
		u.last_name,
		uu.first_name AS first_name_temp,
		uu.last_name AS last_name_temp,
		ns.date_end,
		ns.id AS next_schedule
	FROM Spot s
		LEFT JOIN User u ON s.id = u.id_spot
		LEFT JOIN User uu ON s.id = uu.id_spot_temp
		LEFT JOIN Schedule_Spot ss ON s.id = ss.id_spot
		LEFT JOIN Schedule ns ON ss.id_schedule = ns.id AND ns.date_end > NOW()
	WHERE
		s.id_park LIKE :id_park
		AND s.floor LIKE :floor
		AND s.number LIKE :number
		AND s.id LIKE :id
	ORDER BY s.id, ns.date_end`;

	/**
	 * Note on schedules :
	 * Only futur or actual schedules are fetched this way.
	 * Using a `GROUP BY s.id` clause along a `HAVING MIN(ns.date_end)` didn't work.
	 * BTW : Using an `AND` clause in a `LEFT JOIN ON` isn't a hack, it's taking advantage of the features.
	 * (Without joke, it auto-generate a `NULL` join if there's no matching and it's really usefull)
	 */
	
	//console.log("SQL at GetAllSpots : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
		id:infos.id ||'%',
		number:infos.number||'%',
		floor:infos.floor||'%',
		id_park:infos.id_park||'%'
	}, (err, data) => {
        if (err){
            callback(err, [])
        }else{
			let allSpots = [];

			data.forEach((element) => {
				let index = allSpots.map(spot => spot.id).indexOf(element.id)
				if(index != -1){
					if(allSpots[index].next_schedule === null || (element.next_schedule !== null && element.end_date < allSpots[index].end_date)){
						allSpots[index] = element;
					}
				}else{
					allSpots.push(element);
				}
			});

			allSpots = allSpots.map(({date_end, ...others}) => others);
    
			sql = `SELECT * FROM Typed`
    
			//console.log("SQL at GetAllSpots : " + sql);
            dbConnection.query(sql, (err, data) => {
                if (err){
                    callback(err, [])
                }else{
                    for (let spot of allSpots){
                        spot.types = []
                        for (let typed of data){
                        /*typed : {id_spot:1, name_type:"Handicapé"}*/
                            if (typed.id_spot == spot.id){
                                spot.types.push(typed.name_type)
                            }
                        }
                    }

					CheckIsCleanning(allSpots, callback);
                    // callback(err, allSpots)
                }
            })
        }
    });
}

/**
 * CheckIsCleanning
 * add a boolean to each spots OBJECT in a array indicating if it's beeing cleaned
 * 
 * @param { array of spots } arrSpot [ { OBJECT Spot}, ... ]
 * @param {function(*,*)} callback (err, data)
 */
function CheckIsCleanning(arrSpots, callback){

	let sql = 
	`SELECT DISTINCT sp.id_spot
	 FROM Schedule_Spot sp
	 JOIN Schedule s ON s.id = sp.id_schedule
	 WHERE 
	 	s.type = "Nettoyage" AND
		s.date_start <= NOW() AND
		s.date_end >= NOW()
	`;

	dbConnection.query(sql, {}, (err, data) => {
		// console.log(data);
		if(err){
			return callback(err, null);
		}else{
			arrSpotId = data.map(elt => elt.id_spot)
			arrSpots.forEach(spot => {
				spot.in_cleaning = arrSpotId.includes(spot.id);
			})
			return callback(err, arrSpots);
		}
	})

}

/**
 * GetSpots
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {object} infos {id_park, floor, number, type, id}
 * @param {function(*,*)} callback (err, data)
 */
function GetSpots(infos, callback){
    GetAllSpots(infos, (err, spots) => {
        if (err) {
            callback(err, []);
        }else{
			UpdateUserTemp(spots, (err, upSpots) => {
				if(err) return callback(err, null);

				for (let key of Object.keys(infos)){
					key = key.toLowerCase()
					if (key == "type"){
						upSpots = upSpots.filter(spot => spot.types.includes(infos.type));
					}else{
						upSpots = upSpots.filter(spot => spot[key] == infos[key]);
					}
				}
				return callback(null, upSpots);
			})

            
			//callback(null, spots)
			
        }
    })
}

/**
 * UpdateUserTemp
 * update id_spot_temp of temp user of the spots if necessary
 * 
 * @param {Array<Spot Object>} spots [{id, id_user_temp, ...}, {...}, ...]
 * @param {function(*,*)} callback (err, data)
 * @param {Array<Spot Object>} newSpots 
 */
function UpdateUserTemp(spots, callback, newSpots = []){
	//RECURSIVE
	console.log(newSpots)
	if (spots.length == 0){
		callback(null, newSpots)
	}else{
		let spot = spots.pop();
		ActualiseTempUser(spot, (err, newspot) => {
			if (err) return callback(err, null);
			newSpots.push(newspot);
			UpdateUserTemp(spots, callback, newSpots)
		})
	}
}

// Retirer la place temporaire si la place temporaire n'est plus en nettoyage
function ActualiseTempUser(spot, callback){
	const { GetUsers } = require("./user");
	if(spot.id_user || !spot.id_user_temp) return callback(null, spot);
	GetUsers({id: spot.id_user_temp}, (err, userTemp) => { // permet l'attribution ou la suppression de la place temporaire.
		if(err){
			return callback(err, null);
		}else{
			return callback(null, spot);
		}
	})
}

/**
 * GetSpotsMultipleFloors
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {object} infos {id_park, floors, number, type, id}
 * @param {function(*,*)} callback 
 */
function GetSpotsMultipleFloors(infos, callback, recData=[]){
	poppedFloor = infos.floors.pop();
	GetSpots({"id_park":infos.id_park, "floor":poppedFloor}, (err,data)=>{
		//console.log(data);
		if(err){
			callback(err,data);
		}else if(infos.floors.length>0){
			data= recData.concat(data);
			GetSpotsMultipleFloors(infos,callback,data);
		}else{
			data= recData.concat(data);
			callback(err,data);
		}
	});
}

/**
 * InsertListTyped
 * Insert the link between multiple spot types and a spot in the database
 * 
 * @param {int} id_spot ID of the spot
 * @param {Array<string>} names_types Names of the types
 * @param {function(*,*)} callback (err, data)
 */
function InsertListTyped(id_spot, name_types, callback){
	
	sql = `INSERT INTO Typed (id_spot, name_type) VALUES (:id_spot, :name_type)`;
	
	//console.log("SQL at InsertListTyped : " + sql + " with " + {id_spot:id_spot,names_types:names_types});
	dbConnection.query(sql, {
			id_spot:id_spot,
			name_type:name_types.pop()
		}, (err, data) => {
		if(err){
			callback(err,data);
		}else if(name_types.length>0){
			InsertListTyped(id_spot,name_types,callback);
		}else{
			callback(err,data);
		}
	});
}

/**
 * PostSpot
 * Create a new spot
 * 
 * @param {object} infos {number, floor, id_park, types}
 * @param {function(*,*)} callback (err, data)
 */
function PostSpot(infos, callback){
	const { GetParkings } = require("./parking")
	GetSpots({id_park:infos.id_park, floor:infos.floor, number:infos.number}, (err, res) => {
		if (err){
			callback(err, []);
		}else if (res.length == 1){
			Errors.SendError(Errors.E_SPOT_ALREADY_EXIST, "La place existe déjà.", callback);
		}else{
			GetParkings({id:infos.id_park}, (err, parkings) => {
				if (err){
					callback(err, []);
				}else if (parkings.length != 1){
					Errors.SendError(Errors.E_UNDEFINED_PARKING, "Le parking n'existe pas.", callback);
				}else if (infos.floor >= parkings[0].floors){
					Errors.SendError(Errors.E_WRONG_FLOOR, "L'étage n'existe pas.",callback);
				}else{
	
					sql = `INSERT INTO Spot (number, floor, id_park) VALUES (:number, :floor, :id_park)`;
	
					//console.log("SQL at PostSpot : " + sql + " with " + JSON.stringify(infos));
					dbConnection.query(sql, infos, (err, data) => {
						if(err){
							callback(err,data);
						}else if(infos.types && infos.types.length>0) {
							GetSpots({id_park: infos.id_park, floor: infos.floor,	number: infos.number}, (err,data) => {
								if(err){
									callback(err,data);
								}else{
									InsertListTyped(data[0].id, infos.types, callback);
								}
							});
						}else{
							callback(err,data);
						}
					});
				}
			})
		}
    });
}

/**
 * UpdateSpot
 * Modify a spot with specified parameters
 * 
 * @param {object} infos {number, floor, id_park, toggle_type[]} 
 * @param {function(*,*)} callback (err, data)
 * 
 * if toggle_type == [] then, delete all types
 */
function UpdateSpot(infos, callback){
	const { GetParkings } = require("./parking")
	if ( !(infos.number || infos.floor || infos.id_park || infos.toggle_type) ) return Errors.SendError(Errors.E_MISSING_PARAMETER, "Au moins un des champs doit être remplis parmi : number, floor, id_park & toggle_type", callback)
	// check if need update
	if ( infos.number || infos.floor || infos.id_park ){
		GetSpots({id:infos.id},  (err, currentSpot) => {
			if (err) return callback(err, null)
			if (currentSpot.length == 0) return Errors.SendError(Errors.E_SPOT_NOT_FOUND, "La place est introuvable.", callback);
			currentSpot = currentSpot[0]

			//console.log(currentSpot)
			//check if schedule with spot

			let sql = `SELECT * FROM Schedule sc
			JOIN Spot s ON sc.first_spot = s.id
			JOIN Spot ss ON sc.last_spot = ss.id
			WHERE id_parking = :id_park AND s.number <= :number AND ss.number >= :number`

			dbConnection.query(sql, currentSpot, (err, data) => {
				if (err) return callback(err, null)
				if (data.length > 0) return Errors.SendError(Errors.E_BUSY_SPOT, "La place est assigné à des créneaux et ne peut donc pas être modifié.", callback)

				// new spot data
				var spot = {
					number: infos.number || currentSpot.number,
					floor: infos.floor || currentSpot.floor,
					id_park: infos.id_park || currentSpot.id_park
				}
				// check si le parking + l'étage existe
				GetParkings({id:spot.id_park}, (err, data) => {
					if (err) return callback(err, null)
					if (data.length == 0) return Errors.SendError(Errors.E_UNDEFINED_PARKING, "Le parking demandé est introuvable.", callback);
					if (spot.floor >= data[0].floors) return Errors.SendError(Errors.E_WRONG_FLOOR, "L'étage n'existe pas dans ce parking.", callback);
					
					GetSpots(spot, (err, data) => {
						if (err) return callback(err, null)
						if (data.length != 0) return Errors.SendError(Errors.E_SPOT_ALREADY_EXIST, "La place existe déjà.", callback);

						let sql = `UPDATE Spot SET number=:number, floor=:floor, id_park=:id_park WHERE id=:id`;

						spot.id = infos.id;
						dbConnection.query(sql, spot, (err, data) => {
							if (err) return callback(err, null)
							CheckToggleTypes(infos.id, infos.toggle_type, callback);
						})
					})

				})
			})

		})

	}else{
		CheckToggleTypes(infos.id, infos.toggle_type, callback);
	}
}

/**
 * CheckToggleType
 * Process of toggle types of a spot
 * 
 * @param {int} id of the spot
 * @param {Array} toggle Array of the type to toggle
 * @param {function(*,*)} callback (err, data)
 * 
 * if toggle_type == [] then, delete all types
 */
function CheckToggleTypes(id, toggle, callback){
	if (toggle == undefined) return callback(null, null);
	if (toggle && toggle.length != undefined && typeof(toggle) == 'object'){ // check if it's an array (not a string, not a object, an array.)
		if (toggle.length == 0){

			let sql = `DELETE FROM Typed WHERE id_spot = :id`

			dbConnection.query(sql, {id:id}, callback)
		}else{
			// checkTypeExist passes toggle as reference so erase the array after its process. So we give a copy of toggle instead.
			toggle_copy = []; 
			for (var i of toggle){
				toggle_copy.push(i)
			}

			CheckTypeExist(toggle_copy, (err, exist) => {
				if (err) return callback(err, null)
				if (!exist) return Errors.SendError(Errors.E_TYPE_DONT_EXIST, "Un des types demandé n'existe pas.", callback);

				ToggleTypes(id, toggle, callback)
			})
		}
	}else{
		return Errors.SendError(Errors.E_WRONG_PARAMETER_FORMAT, "Le parametre toggle_type doit être un tableau.", callback)
	}
}

/**
 * CheckTypeExist
 * Check if all the types in 'toggle' exists in the database.
 * 
 * @param {*} toggle 
 * @param {function(*,boolean)} callback 
 */
function CheckTypeExist(toggle, callback){
	if (toggle.length == 0){
		callback(null, true)
	}else{
		let name = toggle.pop()

		sql = `SELECT * FROM Type WHERE name=:name`

		dbConnection.query(sql, {name:name}, (err, data) => {
			if (err) return callback(err, null);
			if (data.length == 0) return callback(null, false);
			
			CheckTypeExist(toggle, callback);
		})
	}
}

/**
 * ToggleTypes
 * Toggles the types of a spot specified.
 * 
 * @param {int} id of the spot
 * @param {*} toggle array of type to toggle
 * @param {*} callback 
 */
function ToggleTypes(id, toggle, callback){
	if (toggle.length == 0){
		callback(null, null)
	}else{
		let name = toggle.pop();

		//check if spot has type

		let sql = `SELECT * FROM Typed WHERE id_spot=:id AND name_type=:name`

		dbConnection.query(sql, {id:id, name:name}, (err, data) => {
			if (err) return callback(err, null)
			if (data.length == 0){
				//type not exist, insert

				let sql = `INSERT INTO Typed (id_spot, name_type) VALUES (:id, :name)`

				dbConnection.query(sql, {id:id, name:name}, (err, data) => {
					if (err) return callback(err, null)

					ToggleTypes(id, toggle, callback)
				})
			}else{
				//type exist, delete

				let sql = `DELETE FROM Typed WHERE id_spot=:id AND name_type=:name`

				dbConnection.query(sql, {id:id, name:name}, (err, data) => {
					if (err) return callback(err, null)

					ToggleTypes(id, toggle, callback)
				})
			}
		})
		
	}
}

 /** DeleteSpot
 * Delete a spot and all his references by id
 * 
 * @param {int} id
 * @param {function (*,*)} callback (err, data)
 */
function DeleteSpot(id, callback){
	const {AdaptSchedule} = require("./schedule")
	const {DeleteSpotType} = require("./spot_type")
	const {RemoveSpotUsers} = require("./user")
	// AdaptSchedule((err, res) => {
	// 	callback(err, res);
	// }, id)
	AdaptSchedule(id, (err, res) =>{
		if (err){
			callback(err, res);
		}else{
			DeleteSpotType(id, (err, res) => {
				if (err){
					callback(err, res);
				}
				else{
					RemoveSpotUsers(id, (err, res) => {
						if (err){
							callback(err, res)
						}
						else {

							sql = `DELETE FROM Spot WHERE id=:id`;

							dbConnection.query(sql,{
								id:id
							}, (err, data) => {
								callback(err, data)
							});
						}
					})
				}
			});
		};
	})
}

/**
 * DeleteSpots
 * Delete a list of spots
 * 
 * @param {Array<int>} ids 
 * @param {function(*,*)} callback (err, data)
 */
function DeleteSpots(ids, callback){
	DeleteSpot((err, data) => {
		if(err){
			callback(err,data);
		}else if(ids.length>0){
			DeleteSpots(ids,callback);
		}else{
			callback(err,data);
		}
	},ids.pop());
}

module.exports = {GetAllSpots, GetSpots, GetSpotsMultipleFloors, PostSpot, DeleteSpots, DeleteSpot, UpdateSpot};
