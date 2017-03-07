'use strict';

var errorMessages = require('../../errorMessages');
var pubsub = require('../../pubsub');
var moduleBase = require('../../moduleBase');

module.exports = moduleBase.create({
  btnInteractiveMapId: '#interactive-map-btn-test',

  init: function() {
    this.htmlIndexId = 'interactive-map-index';
    this.htmlModuleId = 'interactive-map-module';
    this.htmlModulePath = './interactiveMap.html';

    var interactiveMapController = this;
    this.loadViews(this.htmlIndexId, this.htmlModuleId, this.htmlModulePath)
      .then(function($indexInteractiveDiv) {
        interactiveMapController.$indexInteractiveDiv = $indexInteractiveDiv;
        interactiveMapController.bindClickListener();
      })
      .catch(function(errorMsg) {
        console.error(errorMsg);
      });
  },

  bindClickListener: function() {
    var btnInteractiveMap = this.$indexInteractiveDiv.find(this.btnInteractiveMapId);
    if(btnInteractiveMap.length === 0) {
      console.error(errorMessages.idNotFound(this.btnInteractiveMapId));
    } else {
      btnInteractiveMap.on('click', {eventKey: pubsub.keys.btnTestClicked},this.firePubSubEvent);
    }
  },

  firePubSubEvent: function(event) {
    pubsub.emit(event.data.eventKey);
  }
});
