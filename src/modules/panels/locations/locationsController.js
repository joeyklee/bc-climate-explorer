'use strict';

var model = require('./locationsModel');
var errorMessages = require('../../../errorMessages');
var moduleBase = require('../../../moduleBase');
var handlebars = require('handlebars');
var pubsub = require('../../../pubsub');
var $ = require('jquery');

module.exports = moduleBase.create({
  htmlMainId: 'panel-locations-index',
  viewId: 'panel-locations-module',
  htmlFilePath: './locations.html',


  init: function() {
    var locationsController = this;
    this.loadViews(this.htmlMainId, this.viewId, this.htmlFilePath)
      .then(function(success) {
        locationsController.$indexInteractiveDiv = success;
        locationsController.getDropdownData();
        locationsController.bindEvents();
      })
      .catch(function(errorMsg) {
        console.error(errorMsg);
      });
  },

  bindEvents: function() {
    pubsub.on(pubsub.keys.btnTestClicked, this.showText);
  },

  showText: function() {
    var $panel = $('#panel-locations-test');
    if($panel.is(':visible')) {
      $panel.hide();
    } else {
      $panel.show();
    }
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
    // var $indexLocationsDiv = $('#panel-locations-index');
    var html = this.$indexInteractiveDiv.html();
    var template = handlebars.compile(html);
    var result = template(context);
    this.$indexInteractiveDiv.html(result);
    this.$indexInteractiveDiv.find('#panel-locations-test').hide();
  }
});