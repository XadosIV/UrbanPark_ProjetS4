const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');

/**
 * GetParkings
 * Return a JSON with every parking corresponding to paramaters
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id}
 */

function GetParkings(callback, infos){
	sql = `SELECT * FROM ${dbName}.Parking WHERE id LIKE :id;`;
    console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id:infos.id||'%'
    }, callback);
}

/**
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

            let sql = `INSERT INTO ${dbName}.parking (id, name, floors, address) VALUES (:id, :name, :floor, :address)`
            
            dbConnection.query(sql, infos, callback);
        }
    } , {id:infos.id})
}

module.exports = {GetParkings, PostParking};