'use strict';

var interactiveMapController = require('./modules/maps/interactiveMapController');
var locationsController = require('./modules/panels/locations/locationsController');
var scatterplotController = require('./modules/charts/scatterplot/scatterplotController');
var timeseriesLeftController = require('./modules/charts/timeseries-left/timeseriesLeftController');
var timeseriesRightController = require('./modules/charts/timeseries-right/timeseriesRightController');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

locationsController.init();
interactiveMapController.init();
scatterplotController.init();
timeseriesLeftController.init();
timeseriesRightController.init();
