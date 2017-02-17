'use strict';

var errorMessages = require('../src/errorMessages');

describe('Error messages', function() {
  describe('Module add error message', function() {
    it('should return an error string', function() {
      expect(errorMessages.addModule("interactiveMap")).toBe
      (
        "Module \"interactiveMap\" can't be added. " +
        "ID \"interactiveMap\" is missing in HTML main file"
      );
    });

    it('should return empty string when parameter type is not string', function() {
      expect(errorMessages.addModule(-123)).toBe("");
      expect(errorMessages.addModule(1.234)).toBe("");
    });
  });
});
