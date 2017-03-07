'use strict';

var $ = require('jquery');
var errorMsg = require('./errorMessages');

module.exports = {
  htmlIndexId: '',
  htmlModuleId: '',
  htmlModulePath: '',

  loadViews: function(htmlIndexId, htmlModuleId, htmlModulePath) {
    return new Promise(function(resolve, reject) {
      var $indexDiv = $('#' + htmlIndexId);
      if($indexDiv.length === 0) {
        reject(errorMsg.idNotFound('#' + htmlIndexId));
      } else {
        $indexDiv.load(htmlModulePath, function(response, status, jqxhr) {
          if(status == 'error') {
            reject(errorMsg.fileNotFound(htmlModulePath));
          }
          resolve($indexDiv);
        });
      }
    });
  },

  create: function(values) {
    var instance = Object.create(this);
    Object.keys(values).forEach(function(key) {
      instance[key] = values[key];
    });
    return instance;
  }
};
