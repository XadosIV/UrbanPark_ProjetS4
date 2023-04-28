const {dbConnection, dbName} = require('../database');
const {GetSpots, GetSpotsMultipleFloors, DeleteSpots} = require('./spot.js');
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
	sql = `SELECT * FROM ${dbName}.Parking WHERE id LIKE :id;`;
    console.log("SQL at GetParkings : " + sql + " with " + JSON.stringify(infos));
    dbConnection.query(sql, {
        id:infos.id||'%'
    }, callback);
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

module.exports = {GetParkings, PutParkings};