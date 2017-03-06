'use strict';

var $ = require('jquery');
var errorMsg = require('./errorMessages');

module.exports = {
  loadViews: function(htmlMainId, viewId, htmlFilePath) {
    return new Promise(function(resolve, reject) {
      var $indexDiv = $('#' + htmlMainId);
      if($indexDiv.length === 0) {
        reject(errorMsg.idNotFound('#' + htmlMainId));
      } else {
        $indexDiv.load(htmlFilePath, function(response, status, jqxhr) {
          if(status == 'error') {
            reject(errorMsg.fileNotFound(htmlFilePath));
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
