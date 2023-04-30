const {dbConnection} = require('../database');
const {GetSpotsMultipleFloors, DeleteSpots} = require('./spot.js');
const {Range} = require('../utils.js');
const Errors = require('../errors');

/**
 * GetParkings
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id}
 */

function GetParkings(callback, infos){
	sql = `SELECT * FROM Parking WHERE id LIKE :id;`;
    //console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id:infos.id||'%'
    }, callback);
}

/**
 * PostParking
 * 
 * @param {object} infos {id, name, floors, address} 
 * @param {function(*,*)} callback 
 */
function PostParking(infos, callback){
    if ( !(infos.id && infos.name && infos.floors && infos.address) ) return Errors.SendError(Errors.E_MISSING_PARAMETER, 
        "Les champs suivants doivent être remplis : 'id', 'name', 'floors', 'address'", callback);
    
    if (infos.id.length != 1) return Errors.SendError(Errors.E_WRONG_ID_FORMAT, "L'id ne doit faire qu'un caractère.", callback);
    if (isNaN(infos.floors)) return Errors.SendError(Errors.E_WRONG_FLOORS_FORMAT, "Le champ 'floors' doit être un nombre.", callback);
    if (parseInt(infos.floors) <= 0) return Errors.SendError(Errors.E_WRONG_FLOORS, "Le nombre d'étage ne peut pas être inférieur ou égal à zéro.", callback);

    GetParkings( (err, data) => {
        if (err) {
            callback(err, null);
        }else{
            if (data.length >= 1) return Errors.SendError(Errors.E_PARKING_ALREADY_EXIST, "Le parking existe déjà.", callback)

            let sql = `INSERT INTO Parking (id, name, floors, address) VALUES (:id, :name, :floors, :address)`
            
            dbConnection.query(sql, infos, callback);
        }
    } , {id:infos.id})
}

/**
 * PutParkings
 * Modify selected parking
 * 
 * @param {object} infos {id, name, floors, address}
 * @param {function(*,*)} callback
 */
function PutParkings(infos, callback){
	GetParkings((err,data)=>{
		if(err){
			callback(err,data);
		}else if(data.length != 1){
			return Errors.SendError(Errors.E_UNDEFINED_PARKING, "Ce parking n'existe pas", callback);
		}else{
			let oldParking = data[0];
			let update = (err,data)=>{
				sql = `UPDATE Parking SET name=:name, floors=:floors, address=:address WHERE id=:id;`;
				//console.log("SQL at PutParkings : " + sql + " with " + JSON.stringify(infos));
				dbConnection.query(sql, {
					"name":infos.name||oldParking.name,
					"floors":infos.floors||oldParking.floors,
					"address":infos.address||oldParking.address,
					"id":infos.id
				}, callback);
			};

			if (infos.floors && infos.floors < oldParking.floors){
				GetSpotsMultipleFloors({
					"id_park":infos.id,
					"floors":Range(infos.floors, oldParking.floors-1)
				}, (err,spotsToDelete)=>{
					if(err){
						callback(err, spotsToDelete);
					}else if(spotsToDelete.length>0){
						DeleteSpots(spotsToDelete.map(i => i.id), update);
					}else{
						update(err,spotsToDelete);
					}
				});
			}else{
				update(err,data);
			}
		}
	},{"id":infos.id});
}

/**
 * DeleteParking
 * 
 * @param {object} infos {id}
 * @param {function(*,*)} callback
 */
function DeleteParking(infos, callback){
    if (!infos.id) return Errors.SendError(Errors.E_MISSING_PARAMETER, "Spécifier l'id du parking à supprimer.", callback)

    //check if parking exist
    GetParkings( (err, data) => {
        if (err){
            callback(err,null)
        }else{
            if (data.length != 1) return Errors.SendError(Errors.E_UNDEFINED_PARKING, "Le parking n'existe pas.", callback);

            var parking = data[0];
            //delete schedule parking
            let sql = `DELETE FROM Schedule WHERE id_parking = :parkId`
            dbConnection.query(sql, {parkId: parking.id}, (err, data) => {
                if (err) {
                    callback(err, null)
                }else{
                    //delete typed
                    let sql = `DELETE t FROM Typed t INNER JOIN Spot s ON t.id_spot = s.id WHERE s.id_park = :parkId;`
                    dbConnection.query(sql, {parkId:parking.id}, (err, data) => {
                        if (err){
                            callback(err, null);
                        }else{
                            //delete cle etrangere spot dans user pour id_spot
                            let sql = `UPDATE User u LEFT JOIN Spot s ON s.id = u.id_spot SET id_spot = NULL WHERE s.id_park = :parkId`
                            dbConnection.query(sql, {parkId: parking.id}, (err, data) => {
                                if (err){
                                    callback(err, null);
                                }else{
                                    //delete cle etrangere spot dans user pour id_spot_temp
                                    let sql = `UPDATE User u LEFT JOIN Spot s ON s.id = u.id_spot_temp SET id_spot_temp = NULL WHERE s.id_park = :parkId`
                                    dbConnection.query(sql, {parkId: parking.id}, (err, data) => {
                                        if (err){
                                            callback(err, null);
                                        }else{
                                            //delete spot
                                            let sql = `DELETE FROM Spot WHERE id_park = :parkId`
                                            dbConnection.query(sql, {parkId: parking.id}, (err, data) => {
                                                if (err){
                                                    callback(err, null)
                                                }else{
                                                    //delete parking
                                                    let sql = `DELETE FROM Parking WHERE id=:parkId`
                                                    dbConnection.query(sql, {parkId: parking.id}, (err, data) => {
                                                        if (err){
                                                            callback(err, null)
                                                        }else{
                                                            callback(null, null);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }, {id:infos.id})
}

module.exports = {GetParkings, PostParking, PutParkings, DeleteParking};

