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
    console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id:infos.id||'%'
    }, callback);
}

/**
 * PostParking
 * 
 * @param {object} infos {id, name, floor, address} 
 * @param {function(*,*)} callback 
 */
function PostParking(infos, callback){
    if ( !(infos.id && infos.name && infos.floor && infos.address) ) return Errors.SendError(Errors.E_MISSING_PARAMETER, 
        "Les champs suivants doivent être remplis : 'id', 'name', 'floor', 'address'", callback);
    
    if (infos.id.length != 1) return Errors.SendError(Errors.E_WRONG_ID_FORMAT, "L'id ne doit faire qu'un caractère.", callback);
    if (isNaN(infos.floor)) return Errors.SendError(Errors.E_WRONG_FLOOR_FORMAT, "Le champ 'floor' doit être un nombre.", callback);
    if (parseInt(infos.floor) <= 0) return Errors.SendError(Errors.E_WRONG_FLOOR, "Le nombre d'étage ne peut pas être inférieur ou égal à zéro.", callback);

    GetParkings( (err, data) => {
        if (err) {
            callback(err, null);
        }else{
            if (data.length >= 1) return Errors.SendError(Errors.E_PARKING_ALREADY_EXIST, "Le parking existe déjà.", callback)

            let sql = `INSERT INTO Parking (id, name, floors, address) VALUES (:id, :name, :floor, :address)`
            
            dbConnection.query(sql, infos, callback);
        }
    } , {id:infos.id})
}

/**
 * PutParkings
 * Modify selected parking
 * 
 * @param {object} infos {id, name, floor, address}
 * @param {function(*,*)} callback
 */
function PutParkings(infos, callback){
	GetParkings({"id":infos.id}, (err,data)=>{
		if(err){
			callback(err,data);
		}else if(data.length() != 0){
			return SendError(Errors.E_UNDEFINED_PARKING);
		}else{
			let oldParking = data[0];
			let update = (err,data)=>{
				sql = `UPDATE Parking SET name=:name, floor=:floor, address=:address WHERE id=:id;`;
				//console.log("SQL at PutParkings : " + sql + " with " + JSON.stringify(infos));
				dbConnection.query(sql, {
					"name":infos.name||oldParking.name,
					"floor":infos.floor||oldParking.floor,
					"address":infos.address||oldParking.address,
					"id":infos.id
				}, (err, dataUpdate) => {
					callback(err, dataUpdate)
				});
			};

			if (infos.floor && infos.floor < oldParking.floor){
				GetSpotsMultipleFloors({
					"id_park":infos.id,
					"floors":Range(infos.floor+1, oldParking.floor)
				}, (err,spotsToDelete)=>{
					if(err){
						callback(err, spotsToDelete);
					}else{
						DeleteSpots({"ids":spotsToDelete.map(i => i.id)}, update);
					}
				});
			}else{
				update(err,data);
			}
		}
	});
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

