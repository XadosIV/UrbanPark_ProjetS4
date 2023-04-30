const {dbConnection} = require('../database');
const {SpotTypeExists} = require('./spot_type');
const Errors = require('../errors');

/**
 * GetAllSpots
 * Return a JSON with every spots
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_park, floor, number, type}
 */

function GetAllSpots(callback, infos){
	sql = `SELECT s.id, s.number, s.floor, s.id_park, u.id AS id_user, uu.id AS id_user_temp, u.first_name, u.last_name, uu.first_name AS first_name_temp, uu.last_name AS last_name_temp 
	FROM Spot s 
	LEFT JOIN User u ON s.id = u.id_spot 
	LEFT JOIN User uu ON s.id = uu.id_spot_temp 
	WHERE s.id_park LIKE :id_park AND s.floor LIKE :floor AND s.number LIKE :number
	ORDER BY floor, number`;
    //console.log("SQL at GetAllSpots : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, 
		{
			number:infos.number||'%',
			floor:infos.floor||'%',
			id_park:infos.id_park||'%'
		}, (err, data) => {
        if (err){
            callback(err, [])
        }else{
            sql = `SELECT * FROM Typed`
            //console.log("SQL at GetAllSpots : " + sql);
            allSpots = data
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
                    callback(err, allSpots)
                }
            })
        }
    });
}

/**
 * GetSpots
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_park, floor, number, type, id}
 */
function GetSpots(callback, infos){
    GetAllSpots((err, spots) => {
        if (err) {
            callback(err, []);
        }else{
            for (let key of Object.keys(infos)){
                key = key.toLowerCase()
                if (key == "type"){
                    spots = spots.filter(spot => spot.types.includes(infos.type));
                }else{
                    spots = spots.filter(spot => spot[key] == infos[key]);
                }
            }
            callback(err, spots);
        }
    }, infos)
}

/**
 * GetSpotsMultipleFloors
 * Return a JSON with every spots corresponding to paramaters
 * 
 * @param {*} infos {id_park, floors, number, type, id}
 * @param {*} callback 
 */
function GetSpotsMultipleFloors(infos, callback, recData=[]){
	poppedFloor = infos.floors.pop();
	GetSpots((err,data)=>{
		console.log(data);
		if(err){
			callback(err,data);
		}else if(infos.floors.length>0){
			data= recData.concat(data);
			GetSpotsMultipleFloors(infos,callback,data);
		}else{
			data= recData.concat(data);
			callback(err,data);
		}
	},{
		"id_park":infos.id_park,
		"floor":poppedFloor
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
 * Create a new spot with no type
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {number, floor, id_park, types}
 */
function PostSpot(callback, infos){
	const { GetParkings } = require('./parking');
	GetSpots((err, res) => {
		if (err){
			callback(err, []);
		}else if (res.length == 1){
			Errors.SendError(Errors.E_SPOT_ALREADY_EXIST, "La place existe déjà.", callback);
		}else{
			GetParkings((err, parkings) => {
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
							GetSpots((err,data) => {
								if(err){
									callback(err,data);
								}else{
									InsertListTyped(data[0].id, infos.types, callback);
								}
							}, {id_park: infos.id_park, floor: infos.floor,	number: infos.number});
						}else{
							callback(err,data);
						}
					});
				}
			}, {id:infos.id_park})
		}
    }, {id_park:infos.id_park, floor:infos.floor, number:infos.number});
}

/**
 * DeleteSpot
 * Delete a spot and all his references by id
 * 
 * @param {function (*,*)} callback (err, data)
 * @param {int} id
 */
function DeleteSpot(callback, id){
	const {AdaptSchedule} = require("./schedule");
	const {DeleteSpotType} = require("./spot_type");
	const {RemoveSpotUsers} = require("./user");
	AdaptSchedule((err, res) =>{
		if (err){
			callback(err, res);
		}
		else{
			DeleteSpotType((err, res) => {
				if (err){
					callback(err, res);
				}
				else{
					RemoveSpotUsers((err, res) => {
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
					}, id)
				}
			}, id);
		};
	}, id)
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

module.exports = {GetAllSpots, GetSpots, GetSpotsMultipleFloors, PostSpot, DeleteSpots, DeleteSpot};
