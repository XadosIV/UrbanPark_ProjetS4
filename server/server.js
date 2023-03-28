const http = require('http');
const {app, mysql, database} = require('./app');

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
