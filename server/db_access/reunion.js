const {dbConnection} = require('../database');
const Errors = require('../errors');


/**
 * 
 * @param {object} infos roles[], users[], date_start, date_end
 * @param {function(*,*)} callback 
 */
function GetSchedulesAvailable(infos, callback){
	if (!infos.date_start) return Errors.SendError(Errors.E_MISSING_PARAMETER, "La date de début n'a pas été fournie.", callback);
	if (!infos.date_end) return Errors.SendError(Errors.E_MISSING_PARAMETER, "La date de fin n'a pas été fournie.", callback);
	if (!infos.roles && !infos.users) return Errors.SendError(Errors.E_MISSING_PARAMETER, "Au moins un utilisateur ou un rôle doit être fournis.", callback);

	// On récupère tout les utilisateurs concernés
	var users = [];
	if (infos.users){
		for (let id of infos.users){
			users.push(id);
		}
	}
	

	if (!infos.roles) infos.roles = [];


	GetUsersFromRoleArray(infos.roles, (err, data) => {
		if (err) {return callback(err, null)}
		else {
			for (let d of data){
				users.push(d.id);
			}
			// On devrait ajouter un algo pour retirer les doublons dans "users[]" ici afin d'optimiser les perfs
			GetAllSchedulesFromUserArray(users, infos.date_start, infos.date_end, (err, data) => {
				if (err) {return callback(err, null)}
				else {
					let schedules = ReduceSchedules(data);
					callback(null, InvertSchedules(infos.date_start, infos.date_end, schedules))
				}
			})
		}
	})
}

/**
 * Invert Schedules
 * 
 * Take two dates and an array of schedule with the format : [date_start, date_end]
 * Return an array of schedule with the same format, indicates all time where no schedules are found between the two dates.
 * 
 * @param {string} min starting date of inverting 
 * @param {string} max ending date of inverting
 * @param {*} schedules busy schedules to find not busy ones 
 */
function InvertSchedules(min, max, schedules){
	//on trie schedules par ordre alphabétique des tailles du début
	if (schedules.length == 0) return [min, max];
	
	schedules.sort((a,b) => a[0]<b[0]?-1:1) // c'est pas une bidouille, c'est juste pour trier.

	var i_schedules = [];
	if (schedules[0][0] <= min){ // si le tout premier schedule commence avant le début du min
		min = schedules[0][1]; // le min devient la date de fin du premier
	}else {
		i_schedules.push([min, schedules[0][0]]); // si il commence après, on ajoute un schedule entre les deux.
	}

	for (let i = 0; i < schedules.length - 1; i++){
		i_schedules.push([schedules[i][1], schedules[i+1][0]]); // on ajoute les schedules dans les intervalles entre les schedules existants
	}

	//Pour le dernier, on vérifie son état par rapport à max
	let last_schedule = schedules[schedules.length-1];
	if (last_schedule[0] < max){ // s'il commence avant la date de fin, on doit vérifier s'il finit après ou non
		// pour savoir si on doit rajouter un schedule de fin_last_schedule à fin_range
		if (last_schedule[1] < max){ //s'il finit avant
			// on ajoute un schedule
			i_schedules.push([last_schedule[1], max]);
		}
	}

	return i_schedules;
}

/**
 * ArrayEquals
 * 
 * Check if two arrays are equals
 * 
 * @param {Array} a 
 * @param {Array} b 
 */
function ArrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

/**
 * IncludeArray
 * 
 * Check if an array is includes in an array of array.
 * 
 * @param {Array} element 
 * @param {Array[Array]} array 
 */
function IncludeArray(element, array){
	for (let telement of array){
		if (ArrayEquals(telement, element)){
			return true;
		}
	}
	return false;
}

/**
 * ReduceSchedules
 * 
 * Take an array of schedules with the format [date_start, date_end]
 * Returns the array, fusing every schedules when it's possible.
 * 
 * @param {Array} schedules with the format [date_start, date_end] 
 */
function ReduceSchedules(schedules){
	// Retire les doublons
	var schedules_sans_doublons = [];
	while (schedules.length != 0){
		var schedule = schedules.pop();
		if (!IncludeArray(schedule, schedules_sans_doublons)){
			schedules_sans_doublons.push(schedule);
		}
	}

	schedules = schedules_sans_doublons;

	// Retirer ceux qui commencent ou finissent en même temps
	// Genre un 10h-20h et un 10h-12h donne qu'un 10h-20h
	ids_a_supprimer = []; // On delete pas dans les boucles donc on stocke avant
	for (let i in schedules){
		for (let j in schedules){
			if (i != j){
				if (schedules[i][0] == schedules[j][0]){ // si même date de début
					if (schedules[i][1] > schedules[j][1]){ // on retire la plus petite date de fin
						ids_a_supprimer.push(j);
					}else{
						ids_a_supprimer.push(i);
					}
				}else if (schedules[i][1] == schedules[j][1]){ // si même date de fin
					if (schedules[i][0] > schedules[j][0]){ // on retire la plus grande date de debut
						ids_a_supprimer.push(i);
					}else{
						ids_a_supprimer.push(j);
					}
				}

			}
		}
	}

	ids_a_supprimer.sort((a,b) => a-b); // on trie en descendant pour d'abord supprimer le dernier
	// comme ça on a pas de décalage d'id lors de la suppression

	for (let id of ids_a_supprimer){
		schedules.splice(id, 1); // suppression de l'element à l'index 'id'
	}

	//Fuse Overlapping Schedules
	let working = true;
	while (working){
		res = FusingOverlappingSchedules(schedules)
		schedules = res[1];
		working = res[0];
	}

	return schedules;
}

/**
 * FusingOverlappingSchedules
 * 
 * Take an array of schedules with the format [date_start, date_end]
 * Returns an array with :
 * 		[0] bool : Whether or not a fusing occured.
 * 		[1] array: The new schedules array
 * 
 * Designed to be used in a loop, exiting when res[0] == false
 * 
 * @param {Array} schedules with the format [date_start, date_end]
 */
function FusingOverlappingSchedules(schedules){
	res = []; // [bool working, schedules[]]

	for (let i in schedules){
		for (let j in schedules){
			//si une date de début se trouve entre la date de début et la date de fin d'un autre schedule
			//on supprime le schedule ayant cette date de début et on update la date de fin de l'autre si besoin.
			let s1 = schedules[i];
			let s2 = schedules[j];
			if (s1[0] > s2[0] && s1[0] < s2[1]){
				if (s1[1] > s2[1]){ // si le créneau à supprimer se finit après le créneau 'gagnant'
					s2[1] = s1[1]; // le créneau gagnant prend la date de fin de l'autre créneau, qui se finit donc après.
				}

				schedules.splice(i, 1);
				res.push(true);
				res.push(schedules)
				return res;

			}else if (s1[1] > s2[0] && s1[1] < s2[1]){ // idem pour la date de fin

				if (s1[0] < s2[0]){ // idem, si la date de début de celui qu'on supprime est avant celui qu'on garde
					s2[0] = s1[0]; // on change la date de celui qu'on garde
				}

				schedules.splice(i, 1);
				res.push(true);
				res.push(schedules)
				return res;
			}
		}
	}

	// Le parcours des schedules s'est fait sans problème d'overlap
	res.push(false);
	res.push(schedules)
	return res;
}

/**
 * GetAllSchedulesFromUserArray
 * 
 * Take an array of user_id, a minimum date and a maximum date
 * Returns all the schedules for all the users in this date range
 * 
 * @param {Array} user_array 
 * @param {string} min 
 * @param {string} max 
 * @param {function(*,*)} callback 
 * @param {array} schedules 
 */
function GetAllSchedulesFromUserArray(user_array, min, max, callback, schedules=[]){
	if (user_array.length == 0){
		callback(null, schedules);
	}else{
		let user = user_array.pop();

		let sql = `SELECT DATE_FORMAT(date_start,"%Y-%m-%dT%T") AS date_start,
						DATE_FORMAT(date_end,"%Y-%m-%dT%T") AS date_end 
				   FROM Schedule s
				   JOIN User_Schedule us ON us.id_schedule = s.id
				   WHERE us.id_user = :id AND (date_start <= :date_end AND date_end >= :date_start)`

		dbConnection.query(sql, {id:user, date_start:min, date_end:max}, (err, data) => {
			if (err) {callback(err, null)}
			else{
				for (let s of data){
					schedules.push([s.date_start, s.date_end]);
				}
				GetAllSchedulesFromUserArray(user_array, min, max, callback, schedules);
			}
		})
	}
}

/**
 * GetUsersFromRoleArray
 * 
 * Takes a role array
 * Returns an array of userId corresponding to all the users who had these roles.
 * 
 * @param {Array} role_array 
 * @param {function(*,*)} callback 
 * @param {Array} user_array 
 */
function GetUsersFromRoleArray(role_array, callback, user_array=[]){
	if (role_array.length == 0){
		callback(null, user_array)
	}else{
		let role = role_array.pop();

		let sql = `SELECT id FROM User WHERE role=:role`

		dbConnection.query(sql, {role:role}, (err, data) => {
			if (err) {callback(err, null)}
			else{
				for (let id of data){
					user_array.push(id);
				}
				GetUsersFromRoleArray(role_array, callback, user_array);
			}
		})
	}
}

module.exports = {GetSchedulesAvailable, GetUsersFromRoleArray, GetAllSchedulesFromUserArray};
