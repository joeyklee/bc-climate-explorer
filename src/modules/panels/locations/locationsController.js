'use strict';

var model = require('./locationsModel');
var errorMessages = require('../../../errorMessages');
var handlebars = require('handlebars');
var $ = require('jquery');

module.exports = {
  htmlMainId: 'panel-locations-index',
  viewId: 'panel-locations',
  htmlFilePath: './locations.html',

  init: function() {
    var locataionsController = this;
    this.$indexEl = $('#'+this.htmlMainId);
    if(this.$indexEl.length === 0) {
      console.error(errorMessages.addModule(this.htmlMainId));
    }
    else {
      // Check if module html file exists
      this.getModuleHtmlFile().then(function(data) {
        locataionsController.htmlModule = data;
        locataionsController.renderDropdownData();
      }, function(err) {
        console.error("htmlFile", err);
      });
    }
  },

  getDropdownData: function() {
    var locationsController = this;
    var locationCodes = [];
    var locationsResponse = model.getLocationCodes();
    locationsResponse.then(function(data) {
      data.rows.forEach(function(obj) {
        locationCodes.push(obj.id2);
      });
      locationsController.renderDropdownData(locationCodes);
    }, function(e) {
      console.log("error", e);
    });
  },

  getModuleHtmlFile: function() {
    return Promise.resolve($.get(this.htmlFilePath));
  },

  renderDropdownData: function(locationCodes) {
    // var source = this.$viewEl.html();
    var template = handlebars.compile(this.htmlModule);
    var context = {testTitle: "BlaBlub"};
    var html = template(context);
    console.log(html);
  }
};