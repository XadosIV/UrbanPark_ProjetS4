const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

let startDefaultQuery = fs.readFileSync("../database.sql", 'utf8', (err, data) => {
	if (err){
		throw err;
	}
}).toString();

process.env.ADDITIONAL_SQL.split(" ").forEach(file => {
	startDefaultQuery += fs.readFileSync(`../${file}`, 'utf8', (err, data) => {
		if (err){
			throw err;
		}
	}).toString();
});

startDefaultQuery.replaceAll("`DATABASE`", process.env.DATABASE);

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

let dbName = process.env.DATABASE;

// ==============================
// Initiate connection to database
let dbConnection = mysql.createConnection({
	multipleStatements: true,
	namedPlaceholders : true,
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASSWORD
});

module.exports = {dbConnection, StartDatabase, dbName};