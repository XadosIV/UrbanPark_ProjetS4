const {dbConnection} = require('../database');
const Errors = require('../errors');

/**
* GetUsers
* Get all users matching parameters
* 
* @param {function(*,*)} callback (err, data)
* @param {object} infos {first_name, last_name, email, password, id_spot}
*/
function GetUsers(callback, infos){
	sql = `SELECT id, first_name, last_name, email, id_spot, id_spot_temp, role FROM User WHERE id LIKE :id AND email LIKE :email AND role LIKE :role AND last_name LIKE :last_name AND first_name LIKE :first_name AND (id_spot LIKE :id_spot OR '%' = :id_spot) AND (id_spot_temp LIKE :id_spot_temp OR '%' = :id_spot_temp);`;
	//console.log("SQL at GetUsers : " + sql + " with " + JSON.stringify(infos));
	dbConnection.query(sql, {
		id:infos.id||'%',
		email:infos.email||'%',
		role:infos.role||'%',
		last_name:infos.last_name||'%',
		first_name:infos.first_name||'%',
		id_spot:infos.id_spot||'%',
		id_spot_temp:infos.id_spot_temp||'%'
	}, callback);
}

/**
* DeleteUser
* Delete user by id
* 
* @param {function(*,*)} callback (err, data)
* @param {int} id
*/
function DeleteUser(callback, id){
	sql = `DELETE FROM User WHERE id=:id;`;
	console.log("SQL at DeleteUser : " + sql + " with id=" + id);
	dbConnection.query(sql, {
		id:id
	}, callback);
}

/**
* isMySelf
* check if the token and the id point to the same user
* 
* @param {function(*,*)} callback (err, data)
* @param {object} infos {id*, token*}
* <>* -> required
*/
function isMySelf(callback, infos){
	// console.log("info Myself", infos);
	//Verification param required
	if(!(infos.id) || !(infos.token)){
		return Errors.SendError(Errors.E_MISSING_PARAMETER, "Champs obligatoires : id, token", callback);
	}
	//Verification format params
	if(isNaN(parseInt(infos.id))){
		return Errors.SendError(Errors.E_WRONG_PARAMETER, "id doit être un entier", callback);
	}
	GetUserFromToken((err, data) => {
		// console.log("data", data);
		// console.log("infos", infos);
		if (err){ 
			callback(err, {});
			return;
		}else{
			if(data.length != 1){
				return Errors.SendError(Errors.E_UNDEFINED_USER, "cet utilisateur n'existe pas", callback);
			}else{
				// console.log("res", parseInt(infos.id) == data[0].id);
				callback(null, parseInt(infos.id) == data[0].id);
			}
		}
	}, {token: infos.token})
}

/**
* UpdateUser
* Update user's information matching parameters
* 
* @param {function(*,*)} callback (err, data)
* @param {object} infos {id*, token*, first_name, last_name, email, password, role, id_spot, id_spot_temp}
* <>* -> required
*/
function UpdateUser(callback, infos){
	
	//Verification param required
	if(!(infos.id) || !(infos.token)){
		return Errors.SendError(Errors.E_MISSING_PARAMETER, "Champs obligatoires : id, token", callback);
	}
	
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
			
			console.log("SQL at UpdateUser : " + sql + " with " + JSON.stringify(placeholders));
			dbConnection.query(sql, placeholders, callback);
		}

		const updateUser = () => {
			if 	(infos.email || infos.password){ // if a new token is needed
				const {GenerateNewToken} = require('./auth');
				GenerateNewToken(sqlRequest)
			}else{
				sqlRequest(null, null)
			}
		}

		// fonction check if autorisé
		isMySelf((err, data) => {
			if (err){ 
				callback(err, {});
				return;
			}else{
				if(data){
					updateUser();
				}else{
					const { HasPermission } = require("./auth");
					HasPermission(infos.token, "modify_other_users", (err, data) => {
						if(err){
							callback(err, {});
						}else{
							if(data){
								updateUser();
							}else{
								return Errors.SendError(Errors.E_FORBIDDEN, "manipulation interdite", callback);
							}
						}
					})
				}
			}
		}, infos)
	}
		
	//Verification doublon
	if (infos.email){
		GetUsers( (err, data) => {
			if (err) { // Not generated by us
				callback(err,data);
			}else if (data.length != 0){ // Email already used
				return Errors.SendError(Errors.E_EMAIL_ALREADY_USED, "Email déjà utilisé.", callback);
			}else{
				checkNewTokenNeeded();
			}
		}, {email:infos.email})
	}else{
		checkNewTokenNeeded();
	}
}

/**
* GetUserFromToken
* Get all users matching parameters
* 
* @param {function(*,*)} callback (err, data)
* @param {object} infos {token}
*/
function GetUserFromToken(callback, infos){
	sql = `SELECT id, first_name, last_name, email, role, id_spot, id_spot_temp FROM User WHERE  token=:token;`;
	console.log("SQL at GetUserFromToken : " + sql + " with " + JSON.stringify(infos));
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
	return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
}

/**
* PostUser
* Create a new user with "Abonné" role
* 
* @param {function(*,*)} callback (err, data)
* @param {object} infos {first_name, last_name, email, password}
*/
function PostUser(callback, infos){
	const {GenerateNewToken} = require('./auth');
	
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
		GetUsers((err, data) => {
			if (err) { // Not generated by us
				callback(err,data);
			}else if (data.length != 0){ // Email already used
				return Errors.SendError(Errors.E_EMAIL_ALREADY_USED, "Email déjà utilisé", callback);
			}else{
				GenerateNewToken((err, token) => {
					if (err){ // Not generated by us
						callback(err,data);
					}else{
						let sql=`INSERT INTO User (first_name, last_name, email, password, role, token) VALUES (:first_name,:last_name,:email,:password,:role,:token);`;
						infos.role="Abonné";
						infos.token = token;
						console.log("SQL at PostUser : " + sql + " with " + JSON.stringify(infos));
						dbConnection.query(sql, infos, callback);
					}
				});
			}
		}, {email:infos.email});
	}
}

/**
 * RemoveSpotUsers
 * Remove the place of a user by id
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {int} id
 */
function RemoveSpotUsers(callback, id){
	sql = `SELECT id FROM ${dbName}.User WHERE id_spot=:id`;
	dbConnection.query(sql, {
		id:id
	}, (err, data) => {
		if (err){
			callback(err, {})
		}
		else{
			RemoveSpotUserPrinc((err, data) => {
				sql = `SELECT id FROM ${dbName}.User WHERE id_spot_temp=:id`;
				dbConnection.query(sql, {
					id:id
				}, (err, data) => {
					if (err){
						callback(err, {})
					}
					else{
						RemoveSpotUserTemp((err, data) => {
							callback(err, data);
						}, data)
					}
				});
			}, data)
		}
	});
}

/**
 * RemoveSpotUserPrinc
 * Remove the place place of a user by id
 * 
 * @param {function(*,*)} callback (err, data)
 * @param {Array} infos {id}
 */
function RemoveSpotUserPrinc(callback, infos){
	if (infos.length > 0){
		sql = `UPDATE ${dbName}.User SET id_spot=NULL WHERE id=:id`;
		dbConnection.query(sql, {
			id:infos.shift().id
		}, (err, data) => {
			if (err){
				callback(err, data);
			}
			else if (infos.length > 0){
				RemoveSpotUser((err, data) => {
					callback(err, data);
				}, {
					liste:infos
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
 * @param {function(*,*)} callback (err, data)
 * @param {Array} infos {id}
 */
function RemoveSpotUserTemp(callback, infos){
	if (infos.length > 0){
		sql = `UPDATE ${dbName}.User SET id_spot_temp=NULL WHERE id=:id`;
		dbConnection.query(sql, {
			id:infos.shift().id
		}, (err, data) => {
			if (err){
				callback(err, data);
			}
			else if (infos.length > 0){
				RemoveSpotUser((err, data) => {
					callback(err, data);
				}, {
					liste:infos
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