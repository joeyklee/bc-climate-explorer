'use strict';

var interactiveMap = require('./modules/maps/interactiveMap');
var locationsController = require('./modules/panels/locations/locationsController');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

locationsController.init();
interactiveMap.init();
