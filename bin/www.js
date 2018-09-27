#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require('../app');
var path = require('path');
var app_name = require('../package.json').name;
var debug = require('debug')(app_name+':server');
var debug_db = require('debug')(app_name+':db');
var http = require('http');
var mongoose = require('mongoose');
var mongo_url = (process.env.MONGO_DB_URI || 'mongodb://localhost:27017/wireframe');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val)
{
  var port = parseInt(val, 10);

  if (isNaN(port))
  {
    // named pipe
    return val;
  }

  if (port >= 0)
  {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error)
{
  if (error.syscall !== 'listen')
  {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code)
  {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(req, res)
{
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe: '+addr : 'port: '+addr.port;
  debug('application ' + bind);
  debug('application path: '+path.join(__dirname, '../'));
  debug('application env: '+app.get('env'));
}

/**
 * db
 */
 mongoose.connect(mongo_url, {useNewUrlParser: true}).then(
   () => { 
     debug_db('ready to use the db connection.');
     debug_db('mongo uri: '+mongo_url);
   },
   err => { debug_db('there was an error connecting to the db'); }  
 );
