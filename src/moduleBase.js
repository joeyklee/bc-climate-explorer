'use strict';

var $ = require('jquery');

module.exports = {
  loadViews: function(htmlMainId, viewId, htmlFilePath) {
    return new Promise(function(resolve, reject) {
      var $indexDiv = $('#' + htmlMainId);
      if($indexDiv.length === 0) {
        reject('error');
      } else {
        $indexDiv.load(htmlFilePath, function(response, status, jqxhr) {
          if(status == 'error') {
            reject('error file not found');
          }
          resolve('success');
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
