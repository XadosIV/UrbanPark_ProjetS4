const {dbConnection} = require('../database');
const { PreparePostNotification, PostNotification } = require("./notification");
const Errors = require('../errors');

/**
 * GetUsers
 * Get all users matching parameters
 * 
 * @param {object} infos {first_name, last_name, email, password, id_spot}
 * @param {function(*,*)} callback (err, data)
 */
function GetUsers(infos, callback){
	let sql = `SELECT 
		id,
		first_name,
		last_name,
		email,
		id_spot,
		id_spot_temp,
		role,
		id_park_demande
	FROM User 
	WHERE
		id LIKE :id AND
		email LIKE :email AND
		role LIKE :role AND
		last_name LIKE :last_name AND
		first_name LIKE :first_name AND
		(
			id_spot LIKE :id_spot OR
			'%' = :id_spot OR
			(:id_spot = 'NULL' AND id_spot IS NULL)
		) AND
		(
			id_spot_temp LIKE :id_spot_temp OR
			'%' = :id_spot_temp OR
			(:id_spot_temp = 'NULL' AND id_spot_temp IS NULL)
		);`;

	dbConnection.query(sql, {
		id:infos.id||'%',
		email:infos.email||'%',
		role:infos.role||'%',
		last_name:infos.last_name||'%',
		first_name:infos.first_name||'%',
		id_spot:infos.id_spot||'%',
		id_spot_temp:infos.id_spot_temp||'%',
		id_park_demande:infos.id_park_demande||'%'
	}, (err, data) => {
		if(err){
			return callback(err, null);
		}else{
			UpdateSpotTemp(data, callback);
		}
	});
}	

/**
 * UpdateSpotTemp
 * update id_spot_temp either setting it to NULL or giving at free temporary spot
 * 
 * @param {Array<object user>} [{ id, id_spot, ... }, {...}, ...]
 * @param {function(*,*)} callback (err, data)
 */
function UpdateSpotTemp(users, callback, newusers = []){
	//RECURSIVE
	if (users.length === 0){
		callback(null, newusers)
	}else{
		let user = users.pop();
		ActualiseTempSpot(user, (err, newuser) => {
			if (err) return callback(err, null);
			newusers.push(newuser);
			UpdateSpotTemp(users, callback, newusers)
		})
	}
}

function UpdateNewSpotTemp(user, idspot, callback){
	let suiv = (notification) => UpdateUser({id_spot_temp: idspot, id: user.id}, (err, data) => {
		if (err) return callback(err, null);
		user.id_spot_temp = idspot;
		PostNotification(notification, (err, data) =>{
			if(err){
				callback(err, null);
			}else{
				callback(null, user);
			}
		});
	});

	let action = (idspot === null) ? "DELETE" : "POST";
	PreparePostNotification(user.id, action, "Place temporaire", null, (err, notification) => {
		if(err){
			callback(err, null);
		}else{
			suiv(notification);
		}
	});
}

function ActualiseTempSpot(user, callback){
	const { GetSpots } = require("./spot");
	if (!user.id_spot) return callback(null, user);
	GetSpots({id: user.id_spot}, (err, userSpot) => { // Spot du user
		if(err)	return callback(err, null);
		if (userSpot.length == 0){return callback(null, user)}
		userSpot = userSpot[0]
		if (userSpot.in_cleaning){
			if(user.id_spot_temp) return callback(null, user);
			GetSpots({
				id_park: userSpot.id_park,
				type: ["Abonné"],
				id_user: null,
				id_user_temp: null,
				in_cleaning: false
			}, (err, optTempSpot) => {
				if (err) return callback(err, null);
				if(optTempSpot.length > 0){ 
					UpdateNewSpotTemp(user, optTempSpot[0].id, (err, newuser) => {
						if (err) return callback(err, null);
						callback(null, newuser);
					})
				}else{
					GetSpots({
						id_park: userSpot.id_park,
						id_user: null,
						id_user_temp: null,
						in_cleaning: false
					}, (err, optPasAbo) => {
						if (err) return callback(err, null);
						optPasAbo = optPasAbo.filter(e => !optTempSpot.includes(e))
						if (optPasAbo.length > 0){
							UpdateNewSpotTemp(user, optPasAbo[0].id, (err, newuser) => {
								if (err) return callback(err, null);
								callback(null, newuser);
							})
						}else{
							callback(null, user);
						}
					})
				}
			})
		}else{
			///
			if(user.id_spot_temp){
				UpdateNewSpotTemp(user, null, (err, newuser) => {
					if (err) return callback(err, null);
					callback(null, newuser);
				});
			}else{
				callback(null, user);
			}
		}
	})
}

/**
 * DeleteUser
 * Delete user by id
 * 
 * @param {int} id
 * @param {function(*,*)} callback (err, data)
 */
function DeleteUser(id, callback){

	sql = `DELETE FROM User WHERE id=:id;`;

	dbConnection.query(sql, {
		id:id
	}, callback);
}

/** 
* isMySelf
* check if the token and the id point to the same user
* 
* @param {object} infos {id*, token*}
* <>* -> required
* @param {function(*,*)} callback (err, data)
* 
* [DEPRECATED]
*/
function isMySelf(infos, callback){
	//Verification param required
	if(!(infos.id) || !(infos.token)){
		return Errors.SendError(Errors.E_MISSING_PARAMETER, "Champs obligatoires : id, token", callback);
	}
	//Verification format params
	if(isNaN(parseInt(infos.id))){
		return Errors.SendError(Errors.E_WRONG_PARAMETER, "id doit être un entier", callback);
	}
	GetUserFromToken((err, data) => {
		if (err){ 
			callback(err, {});
			return;
		}else{
			if(data.length != 1){
				return Errors.SendError(Errors.E_UNDEFINED_USER, "cet utilisateur n'existe pas", callback);
			}else{
				callback(null, parseInt(infos.id) == data[0].id);
			}
		}
	}, {token: infos.token})
}

/**
 * UpdateUser
 * Update user's information matching parameters
 * 
 * @param {object} infos {id, first_name, last_name, email, password, role, id_spot, id_spot_temp}
 * @param {function(*,*)} callback (err, data)
 */
function UpdateUser(infos, callback){
	//Verification syntaxe
	if (infos.email){
		if (!IsValidEmail(infos.email)){
			return Errors.SendError(Errors.E_EMAIL_FORMAT_INVALID, "Le format de l'email n'est pas conforme.", callback);
		}
	}
	// Verification syntaxe
	if (infos.password){
		if (!IsValidPassword(infos.password)){
			return Errors.SendError(Errors.E_PASSWORD_FORMAT_INVALID, 
				"Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule, un chiffre et un charactère spécial",
				callback);
		}else{
			//crypt password
			const {GetHash} = require('./auth');
			infos.password = GetHash(infos.password);
		}
	}
		
	let checkNewTokenNeeded = () => {

		// Fonction envoyant la reqûete sql
		let sqlRequest = (err, token) => {
			if (err) {
				callback(err, {});
				return;
			}
			// if token generated, add it to infos
			if (token) infos.token = token;
			
			// concat parameters with commas for update syntax
			parameters = ""
			for (let key of Object.keys(infos)){
				if (key != "id"){
					if (["id_spot", "id_spot_temp"].includes(key.toLowerCase())){
						parameters += `\`${key}\`=${infos[key]},` // int value
					}else{
						parameters += `\`${key}\`='${infos[key]}',` // string value
					}
				}
			}
			
			//remove last comma
			parameters = parameters.slice(0,-1) // = remove last char
		
			sql = `UPDATE User SET ${parameters} WHERE id=:id`;
		
      		// placeholders variables gave as the request
			placeholders = {id:infos.id, parameters:parameters}
			
			dbConnection.query(sql, placeholders, callback);
		}

		if 	(infos.email || infos.password){ // if a new token is needed
			const {GenerateNewToken} = require('./auth');
			GenerateNewToken(sqlRequest)
		}else{
			sqlRequest(null, null)
		}
	}
		
	//Verification doublon
	if (infos.email){
		GetUsers({email:infos.email}, (err, data) => {
			if (err) { // Not generated by us
				callback(err,data);
			}else if (data.length != 0){ // Email already used
				return Errors.SendError(Errors.E_EMAIL_ALREADY_USED, "Email déjà utilisé.", callback);
			}else{
				checkNewTokenNeeded();
			}
		})
	}else{
		checkNewTokenNeeded();
	}
}

/**
* GetUserFromToken
* Get all users matching parameters
* 
* @param {object} infos {token}
* @param {function(*,*)} callback (err, data)
*/
function GetUserFromToken(infos, callback){

	sql = `SELECT 
	id,
	first_name,
	last_name,
	email,
	id_spot,
	id_spot_temp,
	role,
	id_park_demande
		   FROM User 
		   WHERE token=:token;`;

	dbConnection.query(sql, {
		token: infos.token
	}, callback);
}

const regexNomPrenom = new RegExp(/^[a-zéèêëçîïùüñöôõàâäãß]+(((['`-]?)( )?){1}[a-zéèêëçîïùüñöôõàâäãß])+$/, "gi");
/**
* isValideNom
* Check if the string is a valid first name / last name
* 
* @param {string} email 
* 
* @return {boolean}
*/
function isValideNom(nom){
    regexNomPrenom.lastIndex = 0;
    let res = regexNomPrenom.test(nom);
    regexNomPrenom.lastIndex = 0;
	return res;
}

/**
* IsValidEmail
* Check if the string is a valid email
* 
* @param {string} email 
* 
* @return {boolean}
*/
function IsValidEmail(email){
	return email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

/**
* IsValidPassword
* Check if the string is a valid password
* Minimum 8 characters long, a lower case, an upper case, a digitanda special character
* 
* @param {string} password 
* 
* @returns {boolean}
*/
function IsValidPassword(password){
	return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\?\.\(\)\\\+\|\<\>/-\{\}\[\]])(?=.{8,})/);
}

/**
* PostUser
* Create a new user with "Abonné" role
* 
* @param {object} infos {first_name, last_name, email, password}
* @param {function(*,*)} callback (err, data)
* 
*/
function PostUser(infos, callback){
	const {GenerateNewToken} = require('./auth');
	const {GetParkings} = require('./parking');
	if (!IsValidEmail(infos.email)){
		return Errors.SendError(Errors.E_EMAIL_FORMAT_INVALID, "Le format de l'email n'est pas conforme.", callback);
	}else if (!IsValidPassword(infos.password)){
		return Errors.SendError(Errors.E_PASSWORD_FORMAT_INVALID,
			"Le mot de passe doit contenir au moins 8 caractères dont une minuscule, une majuscule, un chiffre et un charactère spécial.",
			callback);
	}else if(!isValideNom(infos.first_name) || !isValideNom(infos.last_name)){
		return Errors.SendError(Errors.E_NAME_FORMAT_INVALID,
			"le format du Nom ou Prénom est invalide",
			callback);
	}else{
		let create_user = (infos) => {
			GetUsers( {email:infos.email}, (err, data) => {
				if (err) { // Not generated by us
					callback(err,data);
				}else if (data.length != 0){ // Email already used
					return Errors.SendError(Errors.E_EMAIL_ALREADY_USED, "Email déjà utilisé", callback);
				}else{
					GenerateNewToken((err, token) => {
						if (err){ // Not generated by us
							callback(err,data);
						}else{

							//crypt password
							const {GetHash} = require('./auth');
							infos.password = GetHash(infos.password);

							let sql=`
								INSERT INTO User (
									first_name,
									last_name,
									email,
									password,
									role,
									token,
									id_park_demande
									)
								VALUES (
									:first_name,
									:last_name,
									:email,
									:password,
									:role,
									:token,
									:id_park_demande
								);`;
							
							infos.token = token;
							dbConnection.query(sql, infos, callback);
						}
					});
				}
			})
		}

		if (!infos.role) infos.role = "Abonné";

		if (infos.role == "Abonné"){
			if (!infos.id_park_demande) return Errors.SendError(Errors.E_MISSING_PARAMETER, "Pour la création d'un abonné, le champ id_park_demande doit être fourni.", callback);
			GetParkings({id: infos.id_park_demande}, (err, data) => {
				if(err){
					callback(err, data);
				}else if((data.length !== 1) && infos.id_park_demande){
					return Errors.SendError(Errors.E_UNDEFINED_PARKING, "le parking demandé n'existe pas", callback);
				}else{
					create_user(infos);
				}
			})
		}else{
			create_user(infos);
		}
	}
}

/**
 * RemoveSpotUsers
 * Remove the place of a user by id
 * 
 * @param {int} id
 * @param {function(*,*)} callback (err, data)
 */
function RemoveSpotUsers(id, callback){

	sql = `SELECT id FROM User WHERE id_spot=:id`;
	
	dbConnection.query(sql, {
		id:id
	}, (err, data) => {
		if (err){
			callback(err, {})
		}
		else{
			RemoveSpotUserPrinc(data, (err, data) => {
				if (err) return callback(err, {});
	
				sql = `SELECT id FROM User WHERE id_spot_temp=:id`;
	
				dbConnection.query(sql, {
					id:id
				}, (err, data) => {
					if (err){
						callback(err, {})
					}else{
						RemoveSpotUserTemp(data, (err, data) => {
							callback(err, data);
						})
					}
				});
			})
		}
	});
}

/**
 * RemoveSpotUserPrinc
 * Remove the place place of a user by id
 * 
 * @param {Array} infos {id}
 * @param {function(*,*)} callback (err, data)
 */
function RemoveSpotUserPrinc(infos, callback){
	if (infos.length > 0){
	
		sql = `UPDATE User SET id_spot=NULL WHERE id=:id`;
	
		dbConnection.query(sql, {
			id:infos.shift().id
		}, (err, data) => {
			if (err){
				callback(err, data);
			}
			else if (infos.length > 0){
				RemoveSpotUser({liste:infos}, (err, data) => {
					callback(err, data);
				})
			}
			else {
				callback(err, data)
			}
		})
	}
	else {
		callback(null, {})
	}
}

/**
 * RemoveSpotUserTemp
 * Remove the temp place of a user by id
 * 
 * @param {Array} infos {id}
 * @param {function(*,*)} callback (err, data)
 */
function RemoveSpotUserTemp(infos, callback){
	if (infos.length > 0){
	
		sql = `UPDATE User SET id_spot_temp=NULL WHERE id=:id`;
	
		dbConnection.query(sql, {
			id:infos.shift().id
		}, (err, data) => {
			if (err){
				callback(err, data);
			}
			else if (infos.length > 0){
				RemoveSpotUser({liste:infos}, (err, data) => {
					callback(err, data);
				})
			}
			else {
				callback(err, data)
			}
		})
	}
	else {
		callback(null, {})
	}
}


module.exports = {GetUsers, PostUser, GetUserFromToken, DeleteUser, UpdateUser, RemoveSpotUsers};