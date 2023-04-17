const {dbConnection, dbName} = require('../database');
const Errors = require('../errors');
const { GetParkings } = require('./parking');

/**
 * GetAllSpots
 * Return a JSON with every spots
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {id_park, floor, number, type}
 */

function GetAllSpots(callback){
	sql = `SELECT s.id, s.number, s.floor, s.id_park, u.id as id_user, uu.id as id_user_temp FROM ${dbName}.Spot s LEFT JOIN ${dbName}.User u ON s.id = u.id_spot LEFT JOIN ${dbName}.User uu ON s.id = uu.id_spot_temp`;
    console.log("SQL at GetAllSpots : " + sql);
    dbConnection.query(sql, (err, data) => {
        if (err){
            callback(err, [])
        }else{
            sql = `SELECT * FROM ${dbName}.Typed`
            console.log("SQL at GetAllSpots : " + sql);
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
 * @param {object} infos {id_park, floor, number, type}
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
    })
}

/**
 * PostSpot
 * Create a new spot with no type
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {number, floor, parking}
 */
function PostSpot(callback, infos){
    GetSpots((err, res) => {
        if (err){
            callback(err, [])
        }else{
            if (res.length == 1){
                let errorCode = Errors.E_SPOT_ALREADY_EXIST;
                let error = new Error(errorCode);
                error.code = errorCode;
                callback(error, []);
            }else{
                GetParkings( (err, parkings) => {
                    if (err){
                        callback(err, []);
                    }else{
                        if (parkings.length != 1){
                            let errorCode = Errors.E_UNDEFINED_PARKING;
                            let error = new Error(errorCode);
                            error.code = errorCode;
                            callback(error, []);
                        }else{
                            if (infos.floor >= parkings[0].floors){
                                let errorCode = Errors.E_WRONG_FLOOR;
                                let error = new Error(errorCode);
                                error.code = errorCode;
                                callback(error, []);
                            }else{
                                sql = `INSERT INTO ${dbName}.Spot (number, floor, id_park) VALUES (:number, :floor, :id_park)`;
                                console.log("SQL at PostUser : " + sql + " with " + JSON.stringify(infos));
                                dbConnection.query(sql, infos, callback);
                            }
                        }
                    }
                }, {id:infos.parking})
            }
        }
    }, infos)
}

/**
 * PostSpot
 * Create a new spot with no type
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {object} infos {number, floor, parking}
 */
/*function UpdateSpot(){

}*/

module.exports = {GetAllSpots, GetSpots, PostSpot};