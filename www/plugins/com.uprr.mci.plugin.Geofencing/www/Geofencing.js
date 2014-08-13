cordova.define("com.uprr.mci.plugin.Geofencing.Geofencing", function(require, exports, module) {/**
 * Geofencing.js
 *
 * Phonegap Geofencing Plugin
 * Copyright (c) Dov Goldberg 2012
 * http://www.ogonium.com
 * dov.goldberg@ogonium.com
 *
 */

/**
 * Plugin to provide push notification functionality
 * @class Geofencing
 */
var Geofencing = function() {};

/**
 * Get information on available services
 * @param {Function(result)} success function called request for available services is successful. <code>result</code> contains JSON object with the following:
 * @param {boolean} success.locationServicesEnabled <code>true</code> if location services are enabled for the device, <code>false</code> otherwise
 * @param {boolean} success.isAuthorized <code>true</code> if user has authorized location services for this app or has not made decision, <code>false</code> otherwise
 * @param {String} success.authorizationStatus Authorization status for location services: <code>unknown</code> if user has not made decision, <code>restricted</code> if not authorized and user cannot chnage (for example parental/corporate settings), <code>denied</code> if user has refused access to location services, <code>authorized</code> if user has authorized location services for application
 * @param {boolean} success.significantChange <code>true</code> if significant change APIs are available for the device, <code>false</code> otherwise
 * @param {boolean} success.backgroundRefresh <code>true</code> background refresh is enabled for this application, <code>false</code> otherwise. No background refresh means app can only receive location events in the foreground
 * @param {Function(error)} fail function called when request for available services is unsuccessful (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.availableServices = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "availableServices", []);
};

/**
 * Set the destination for location tracking. Value will be saved to application's user storage
 * @param {Function(result)} success function called when destination is successfully set. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to update destination because latitude or longitude not specified. <code>error</code> contains error message
 * @param {JSONObject} options object containing destination options
 * @param {double} options.latitude latitude for new destination
 * @param {double} options.longitude longitude for new destination
 * @param {String} options.id identifier for new destination (this can be used to store name, order number, or other such identifier)
 * @memberOf Geofencing
 */
Geofencing.prototype.setDestination = function(success, fail, options) {
    return Cordova.exec(success, fail, "Geofencing", "setDestination", [options]);
};

/**
 * Get current destination
 * @param {Function(result)} success function called when destination is successfully retrieved. <code>result</code> contains JSON object with the following:
 * @param {double} success.latitude latitude for current destination. <code>null</code> if not set
 * @param {double} success.longitude longitude for current destination. <code>null</code> if not set
 * @param {double} success.id identifier for current destination. <code>null</code> if not set
 * @param {Function(error)} fail function called when plugin fails to retrieve destination (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.getDestination = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "getDestination", []);
};

/**
 * Clears destination from user preferences. No destination means that location monitoring will run with minimum time/distance intervals
 * @param {Function(result)} success function called when destination is successfully clear. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to clear destination (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.clearDestination = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "clearDestination", []);
};

/**
 * Get last reported location. Will *not* get a new location fix. All values <code>null</code> if no location has been reported
 * @param {Function(result)} success function called when last location successfully retrieved. <code>result</code> contains JSON object with the following:
 * @param {double} success.timestamp timestamp for last location with number of seconds since epoch (Jan 1, 1970)
 * @param {double} success.speed estimated speed in meters/second at last location update (information only). Negative value indicates invalid speed
 * @param {double} success.course direction device traveling at last update in degrees. <code>0</code> is north, <code>90</code> is east, etc. Negative value indicates invalid direction
 * @param {double} success.verticalAccuracy vertical accuracy at last update in meters. Negative value indicates invalid altitude
 * @param {double} success.horizontalAccuracy horiztonal accuracy at last update in meters. Negative value indicates invalid latitude/longitude
 * @param {double} success.altitude altitude at last update measured in meters. Negative value indicates altitude below sea level
 * @param {double} success.latitude latitude for last location in degrees
 * @param {double} success.longitude longitude for last location in degrees
 * @param {Function(error)} fail function called when plugin fails get last location (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.getLastLocation = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "getLastLocation", []);
};

/**
 * Attempt to get current location. This will turn on hardware to get new location fix. This is an asynchronous call
 * @param {Function(result)} success function called when current location is retrieved. <code>result</code> contains JSON object with the following:
 * @param {double} success.timestamp timestamp for current with number of seconds since epoch (Jan 1, 1970)
 * @param {double} success.speed estimated speed in meters/second at current location update (information only). Negative value indicates invalid speed
 * @param {double} success.course direction device traveling in degrees. <code>0</code> is north, <code>90</code> is east, etc. Negative value indicates invalid direction
 * @param {double} success.verticalAccuracy vertical accuracy in meters. Negative value indicates invalid altitude
 * @param {double} success.horizontalAccuracy horiztonal accuracy in meters. Negative value indicates invalid latitude/longitude
 * @param {double} success.altitude altitude measured in meters. Negative value indicates altitude below sea level
 * @param {double} success.latitude latitude for current location in degrees
 * @param {double} success.longitude longitude for current location in degrees
 * @param {Function(error)} fail function called when plugin fails get current location (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.getCurrentLocation = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "getCurrentLocation", []);
};

/**
 * Configure location updates for the application. Specify any or all options. Unspecified values will remain default. Setting option to 0 will ignore that configuration option when calculating location updates. Updates are sent with *either* required distance has been covered or required time has elapsed
 * @param {Function(result)} success function called when updates successfully configured. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to configure location updates (currently not used)
 * @param {JSONObject} options object containing configuration options
 * @param {double} [options.distanceChange=0.1] position change required before reporting new location to application. Specified as a percentage of distance to destination. Valid values: 0-1
 * @param {double} [options.timeChange=0.1] time change required before reporting new location to application. Specified as percentage of miles, whose value in minutes will be minimum time (e.g. at 100 miles from destination, and timeChange value of 0.1, update would be sent after 100 * 0.1 = 10 minutes). Valid values: 0-?
 * @param {double} [options.minDistance=250] minimum distance in meters required before reporting new location
 * @param {double} [options.minTime=0.5] minimum time in minutes required before reporting new location
 * @param {double} [options.maxDistance=5000] maximum distance in meters required before reporting new location
 * @param {double} [options.maxTime=5] maximum time in minutes required before reporting new location
 * @param {double} [options.switchDistance=50000] distance to switch from significant location change to standard location service updates if automatic switching method called (iOS only)
 * @param {double} [options.tenMeterAccuracyMax=1000] distance from target in meters to switch to 10-meter accuracy when using standard location service (iOS only)
 * @param {double} [options.hundredMeterAccuracyMax=10000] distance from target in meters to switch to 100-meter accuracy when using standard location service (iOS only)
 * @param {double} [options.kmAccuracyMax=50000] distance from target in meters to switch to 1-kilometer accuracy when using standard location service. Greater distances will use 3-kilometer accuracy (iOS only)
 * @param {boolean} [options.backgroundProcessing=false] <code>true</code> will cause plugin to request additional processing time from application to act on location update. Must call <code>geofencing.stopBackgroundTask</code> when processing is complete if this value is set to <code>true</code>
 * @memberOf Geofencing
 */
Geofencing.prototype.configureLocationUpdates = function(success, fail, options) {
    return Cordova.exec(success, fail, "Geofencing", "configureLocationUpdates", [options]);
};

/**
 * Restores default values for all location update configuration options. Does *not* clear destination. Use <code>clearDestination</code> instead
 * @param {Function(result)} success function called when location update configuration defaults restored. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to restore location update configuration defaults (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.restoreDefaults = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "restoreDefaults", []);
};

/**
 * Start monitoring for location updates with the standard location service. This uses various hardware based on required accuracy and required time/distance. Will stop significant location change monitoring if it is already running
 * @param {Function(result)} success function called when standard location updates have been started. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to start standard location updates (currently not used)
 * @param {JSONObject} options object containing method parameters
 * @param {String} options.loccb name of JavaScript function to use for callback. See <code>locationUpdate</code> prototype for callback information
 * @memberOf Geofencing
 */
Geofencing.prototype.startUpdatingLocation = function(success, fail, options) {
    return Cordova.exec(success, fail, "Geofencing", "startUpdatingLocation", [options]);
};

/**
 * Start monitoring for location updates with the significant location changes API. This uses cell tower and WiFi locations to get approximate location. Frequency of updates depends on availability of towers. Generally 500m-20km update intervals
 * @param {Function(result)} success function called when significant change updates have been started. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to start significant change updates because standard location service is already started (would be redundant). <code>error</code> contains error message
 * @param {JSONObject} options object containing method parameters
 * @param {String} options.loccb name of JavaScript function to use for callback. See <code>locationUpdate</code> prototype for callback information
 * @memberOf Geofencing
 */
Geofencing.prototype.startMonitoringSignificantLocationChanges = function(success, fail, options) {
    return Cordova.exec(success, fail, "Geofencing", "startMonitoringSignificantLocationChanges", [options]);
};

/**
 * Start monitoring for location updates. Starts with standard location service to get fix, then switches to significant change service automatically if distance to destination is over <code>switchDistance</code> threshold. Switches back to standard location service automatically when threshold is crossed. Will stay with standard location service if significant change not available.
 * @param {Function(result)} success function called when location updates have been started. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to start location updates (currently not used)
 * @param {JSONObject} options object containing method parameters
 * @param {String} options.loccb name of JavaScript function to use for callback. See <code>locationUpdate</code> prototype for callback information
 * @memberOf Geofencing
 */
Geofencing.prototype.startMonitoringLocation = function(success, fail, options) {
    return Cordova.exec(success, fail, "Geofencing", "startMonitoringLocation", [options]);
};

/**
 * Stop all forms of location update monitoring (standard service, significant change, or automatic switching mode)
 * @param {Function(result)} success function called when location updates have been stopped. <code>result</code> contains success message
 * @param {Function(error)} fail function called when plugin fails to stop location updates (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.stopMonitoringLocation = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "stopMonitoringLocation", []);
};

/**
 * Stop an extended background task that was started for processing location updates. Only necessary if <code>backgroundProcessing</code> option set to <code>true</code>. Failure to call in this case may result in application being terminated by OS
 * @param {Function(result)} success function called when background task ended (currently not used)
 * @param {Function(error)} fail function called when plugin fails to end background task (currently not used)
 * @memberOf Geofencing
 */
Geofencing.prototype.stopBackgroundTask = function(success, fail) {
    return Cordova.exec(success, fail, "Geofencing", "stopBackgroundTask", []);
};

/**
 * Callback method when a location update has been received by the plugin
 * @param {JSONObject} result object containing information on location update
 * @param {double} result.timestamp timestamp for current with number of seconds since epoch (Jan 1, 1970)
 * @param {double} result.speed estimated speed in meters/second at current location update (information only). Negative value indicates invalid speed
 * @param {double} result.course direction device traveling in degrees. <code>0</code> is north, <code>90</code> is east, etc. Negative value indicates invalid direction
 * @param {double} result.verticalAccuracy vertical accuracy in meters. Negative value indicates invalid altitude
 * @param {double} result.horizontalAccuracy horiztonal accuracy in meters. Negative value indicates invalid latitude/longitude
 * @param {double} result.altitude altitude measured in meters. Negative value indicates altitude below sea level
 * @param {double} result.latitude latitude for current location in degrees
 * @param {double} result.longitude longitude for current location in degrees
 * @param {double} result.targetDistance remaining distance to target in meters
 * @param {double} result.distanceSinceUpdate distance travelled since last update in meters
 * @param {double} result.minutesSinceUpdate minutes elapsed since last location update
 * @memberOf Geofencing
 */
Geofencing.prototype.locationUpdate = function(result) {};

var geofence = new Geofencing();
module.exports = geofence;});
