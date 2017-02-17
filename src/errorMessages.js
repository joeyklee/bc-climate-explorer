'use strict';

var addModule = function(moduleName) {
  if(typeof moduleName !== 'string') {
    return "";
  }

  return "Module \""+moduleName+"\" can't be added. " +
    "ID \""+moduleName+"\" is missing in HTML main file"
};

module.exports.addModule = addModule;
