/**
 * This is a simple application that can be installed in a Raspberry Pi to remotely control the relays in Relay Channel.
 * 
 * The application provides a RESTFul API to display the available devices (for instance light bulbs in a house) and allows the user
 * to toggle the devices.
 *
 * It also provides a very simple webpage to do the same controls you can do through the API.
 *
 * API URLs:
 * - http://<pi_address>:8080/api/devices - See all the devices amd theirs current status 
 * - http://<pi_address>:8080/api/devices/:device_id - Toggle a device
 *
 * Web Application URL:
 * - http://<pi_address>:8080/ 
 */

'use strict';

// Loading imports
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var devices = require('./controllers/devices');

// Configuring express
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

var port = 8080;

// Setting routes

app.get('/api/devices', function(req, res) {
	devices.list(req, res);
});

app.post('/api/devices/:id', function(req, res) {
	devices.toggle(req, res);
});

app.get('/', function(req, res) {
	res.render('index', {
		devices: devices.devices
	});
});

// Setting up the pins in the relay channel
devices.setup();

/**
 * Gracefully shutdown the application
 */
const gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  devices.tearDown();
  process.exit();
}

// Listen for TERM signal .e.g. kill 
process.on('SIGTERM', gracefulShutdown);

// Listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

// Starting express server
var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening at http://%s:%s', host, port);
});