'use strict';

var idNotFound = function(id) {
  if(typeof id === 'string') {
    return "Didn't found id: '"+ id +"'" ;
  }
  return "Didn't found id";
};

var fileNotFound = function(filePath) {
  if(typeof filePath === 'string') {
    return "File not found: '" + filePath + "'";
  }
  return "File not found";
};

module.exports.idNotFound = idNotFound;
module.exports.fileNotFound = fileNotFound;
