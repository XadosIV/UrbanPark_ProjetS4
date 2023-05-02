const {dbConnection} = require('../database');
const Errors = require('../errors');

/**
 * GetParkings
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param {object} infos {id}
 * @param {function(*,*)} callback (err, data)
 */

function GetParkings(infos, callback){
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

    GetParkings({id:infos.id}, (err, data) => {
        if (err) {
            callback(err, null);
        }else{
            if (data.length >= 1) return Errors.SendError(Errors.E_PARKING_ALREADY_EXIST, "Le parking existe déjà.", callback)

            let sql = `INSERT INTO Parking (id, name, floors, address) VALUES (:id, :name, :floor, :address)`
            
            dbConnection.query(sql, infos, callback);
        }
    })
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
    GetParkings({id:infos.id}, (err, data) => {
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
    })
}

module.exports = {GetParkings, PostParking, DeleteParking};