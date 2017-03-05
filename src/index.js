'use strict';

var interactiveMapController = require('./modules/maps/interactiveMapController');
var locationsController = require('./modules/panels/locations/locationsController');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

locationsController.init();
interactiveMapController.init();
