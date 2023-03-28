const http = require('http');
const app = require('./app');
const mysql = require('mysql');

/**
 * NormalizePort  
 * Convert inputPort in usable number type port
 * @param {number | String} inputPort
 * @returns {number}
 */
function NormalizePort(inputPort){
	let port = parseInt(inputPort, 10);
	
	if (isNaN(port)) {
		return inputPort;
	}
	if (port >= 0) {
		return port;
	}
	return false;
}

/**
 * ErrorHandler  
 * Handle some errors for an Event Emitter  
 * 
 * @param {Error} error  
 * 
 * To add to your event emitter :  
 * ```
 * let ee = new EventEmitter();
 * ee.on('error', ErrorHandler);
 * ee.emit('error'); 
 * ```
 */
function ErrorHandler(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * StartDatabase  
 * Start the database and verify the config
 * 
 * @param {mysql.Connection} dbConnection
 * @param {string | mysql.Query} query
 */
function StartDatabase(dbConnection, query="CREATE DATABASE IF NOT EXISTS `"+process.env.DATABASE+"`; CREATE TABLE IF NOT EXISTS `"+process.env.DATABASE+"`.`Parking` (\
	id CHAR NOT NULL,\
	name VARCHAR(45) NOT NULL,\
	floors INT NOT NULL DEFAULT 1,\
	address VARCHAR(100) NOT NULL,\
	CONSTRAINT pk_parking PRIMARY KEY (id)\
);") {
	dbConnection.connect((err, results) => {if (err) throw err});
	dbConnection.query(query, (err, results) => {
		if (err) throw err;
		else console.log(results);
	});
	dbConnection.query("INSERT INTO `"+process.env.DATABASE+"`.`Parking` (id,name,floors,address) VALUES ('t', 'test', 4, '123 rue des bugs')", (err, results) => {
		if (err) throw err;
		else console.log(results);
	});
	dbConnection.query("SELECT * FROM `"+process.env.DATABASE+"`.`Parking`", (err, results) => {
		if (err) throw err;
		else console.log(results);
	});
}

// ==============================
// Initiate connection to database
let dbConnection = mysql.createConnection({
	multipleStatements: true,
	host     : process.env.HOST,
	user     : process.env.USER,
	password : process.env.PASSWORD
});

StartDatabase(dbConnection);

// ==============================
// Start server
let port = NormalizePort(process.env.PORT || '3001');
app.set('port', port);

let server = http.createServer(app);

server.on('error', ErrorHandler);
server.on('listening', () => {
	let address = server.address();
	let bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port);
