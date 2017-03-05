'use strict';

var model = require('./locationsModel');
var errorMessages = require('../../../errorMessages');
var moduleBase = require('../../../moduleBase');
var handlebars = require('handlebars');
var events = require('../../../pubsub');
var $ = require('jquery');

module.exports = moduleBase.create({
  htmlMainId: 'panel-locations-index',
  viewId: 'panel-locations-module',
  htmlFilePath: './locations.html',


  init: function() {
    var locationsController = this;
    this.loadViews(this.htmlMainId, this.viewId, this.htmlFilePath).then(function(success) {
      locationsController.getDropdownData();
      locationsController.$indexLocationsDiv = $('#' + locationsController.htmlMainId);
    }).catch(function(errorMsg) {
      console.error(errorMsg);
    });
  },

  getDropdownData: function() {
    var locationsController = this;
    var locationCodes = [];
    var locationsResponse = model.getLocationCodes();
    locationsResponse.then(function(data) {
      data.rows.forEach(function(obj) {
        locationCodes.push({value: obj.id2});
      });
      locationsController.renderDropdownData(locationCodes);
    }, function(e) {
      console.log("error", e);
    });
  },

  renderDropdownData: function(locationCodes) {
    var context = {
      locationCodes: locationCodes
    };
    handlebars.registerHelper('list', function(items, options) {
      var out = "";

      for(var i=0, l=items.length; i<l; i++) {
        out = out + "<li><a href=\"#\">" + options.fn(items[i]) + "</li>";
      }

      return out;
    });
    var template = handlebars.compile(this.$indexLocationsDiv.html());
    var result = template(context);
    this.$indexLocationsDiv.html(result);
    //Bind events
    // events.on('btnTestClicked', this.showTestText());
  }
});