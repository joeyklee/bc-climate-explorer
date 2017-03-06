'use strict';

var idNotFound = function(id) {
  return "Didn't found id: '"+ id +"'" ;
};

var fileNotFound = function(filePath) {
  return "File not found: '" + filePath + "'";
};

module.exports.idNotFound = idNotFound;
module.exports.fileNotFound = fileNotFound;
