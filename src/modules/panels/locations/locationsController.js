'use strict';

var model = require('./locationsModel');

module.exports = {
  init: function() {
    var locationCodes = [];
    var locationsResponse = model.getLocationCodes();
    locationsResponse.then(function(v) {
      console.log("succ", v);
    }, function(e) {
      console.log("err", e);
    });
  }
};