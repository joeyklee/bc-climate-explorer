'use strict';

var errorMessages = require('../src/errorMessages');

describe('Error messages', function() {
  describe('idNotFound Message', function() {
    it('should return an id not found string', function() {
      expect(errorMessages.idNotFound("#interactiveMap")).toBe(
        "Didn't found id: '#interactiveMap'"
      );
      expect(errorMessages.idNotFound(123)).toBe("Didn't found id");
      expect(errorMessages.idNotFound(-123.333)).toBe("Didn't found id");
      expect(errorMessages.idNotFound({})).toBe("Didn't found id");
    });
  });

  describe('fileNotFound Message', function() {
    it('should return an file not found string', function() {
      expect(errorMessages.fileNotFound("./index.html")).toBe(
        "File not found: './index.html'"
      );
      expect(errorMessages.fileNotFound(123)).toBe("File not found");
      expect(errorMessages.fileNotFound(-123.333)).toBe("File not found");
      expect(errorMessages.fileNotFound({})).toBe("File not found");
    });
  });
});
