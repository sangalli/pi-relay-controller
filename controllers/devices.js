/**
 * Controller for the relay channel.
 */
'use strict';

// Loading imports
var gpio = require('rpi-gpio');

// Declaring devices. In the future this will be loaded from a config file.
// The GPIO attribute is using the BOARD pin numbers.
const devices = [{
	id: 1,
	name: "Luz 1",
	gpioId: 21,
	active: false,
	writeMode: false
}, {
	id: 2,
	name: "Luz 2",
	gpioId: 19,
	active: false,
	writeMode: false
}];

/**
 * Init pins when server is initializing. 
 * This function will set the pins to INPUT mode to make sure they are all off, 
 * just in case there was some pin turned on before the application was initialized.
 */
const initPins = function() {
	console.log("Preparing pins");
	devices.forEach(function(device) {
		gpio.setup(device.gpioId, gpio.DIR_IN, function(err) {
			if (err) {
				throw err;
			}
		});
	}, this);
}

/**
 * Reads a pin value. Note that the value will be true if it is NOT active and false if it is active. 
 * This happens because the current is enabled when the pin is in LOW mode and not the opposite.
 * 
 * @param  {Object}   The device to get the pin value.
 * @param  {Function} The callback that has the err as the first parameter (in case an error occurs) and the pin value as the second.
 */
const getPinValue = function(device, callback) {
	gpio.read(device.gpioId, callback);
}

/**
 * Toggle a pin: if the was enabled it will be disabled and vice-versa.
 * 
 * @param  {Object}   The device to get the pin value.
 * @param  {Function}
 * @return {Function} The callback that has the err as the first parameter (in case an error occurs).
 */
const toggleDevice = function(device, callback) {
	if (!device.writeMode) {
		// When the application is initialized, all the pins are set to INPUT mode just to make sure they are off.
		// So, this condition will be reached only when it is the first time that the device is being turned on.
		gpio.setup(device.gpioId, gpio.DIR_OUT, function(err) {
			if (err) {
				callback(err);
			} else {
				// Configuring variables properly.
				device.writeMode = true;
				device.active = true;
				callback();
			}

		});
	} else {
		// Toggle the device. Note that the value to be passed it true to disable the relay and false to enable it.
		gpio.write(device.gpioId, device.active, function(err) {
			if (err) {
				callback(err);
			} else {
				// Configuring variables properly.
				device.active = !device.active;
				callback();
			}
		});
	}
}

/**
 * Unexport pins opened by the module when finished.
 */
const closePins = function() {
	console.log("Closing pins");
	gpio.destroy();
}

exports.devices = devices;

/**
 * Setup pins when application is started.
 */
exports.setup = function() {
	initPins();
}

/**
 * Tear down changes made by this controller when application is shut down.
 */
exports.tearDown = function() {
	closePins();
}

/**
 * List all available devices and their status. The response will be in json format.
 * 
 * @param  The request
 * @param  The response
 * @param  The next callback in chain
 */
exports.list = function(req, res, next) {
	res.json(devices);
}

/**
 * Given an id param in the request, toggles a device.
 * 
 * @param  The request
 * @param  The response
 * @param  The next callback in chain
 */
exports.toggle = function(req, res, next) {
	if (req.params.id) {
		let id = Number(req.params.id);
		let device = devices.find(dev => dev.id === id);
		toggleDevice(device, function(err) {
			res.json(device);
		});
	} else {
		res.json({
			message: "Invalid device id"
		}, 401);
	}
}