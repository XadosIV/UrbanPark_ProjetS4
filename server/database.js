const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();

let startDefaultQuery = fs.readFileSync("../database.sql", 'utf8', (err, data) => {
	if (err)
		throw err;
}).toString().replaceAll("`DATABASE`", process.env.DATABASE);

/**
 * StartDatabase  
 * Start the database and verify the config
 * 
 * @param {mysql.Connection} dbConnection
 * @param {string | mysql.Query} query
 */
function StartDatabase(dbConnection, query=startDefaultQuery) {
	dbConnection.connect();
	dbConnection.query(query);
}

// ==============================
// Initiate connection to database
let dbConnection = mysql.createConnection({
	multipleStatements: true,
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASSWORD
});

module.exports = {dbConnection, StartDatabase};