'use strict';

var locationsController = require('../../../../src/modules/panels/locations/locationsController');
var pubsub = require('../../../../src/pubsub');

describe('LocationsController', function() {
  describe('Event binding', function() {
    it('should add btnTestClicked event to pubsub', function() {
      locationsController.bindEvents();
      expect(pubsub.events.btnTestClicked).not.toBeUndefined();
    });
  });
});
