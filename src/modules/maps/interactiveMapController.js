'use strict';

var $ = require('jquery');
var errorMessages = require('../../errorMessages');
var pubsub = require('../../pubsub');
var moduleBase = require('../../moduleBase');

module.exports = moduleBase.create({
  htmlMainId: 'interactive-map-index',
  viewId: 'interactive-map-module',
  htmlFilePath: './interactiveMap.html',
  btnInteractiveMapId: '#interactive-map-btn-test',

  init: function() {
    var interactiveMapController = this;
    this.loadViews(this.htmlMainId, this.viewId, this.htmlFilePath)
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
