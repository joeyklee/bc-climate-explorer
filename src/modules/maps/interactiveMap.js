'use strict';

var $ = require('jquery');
var errorMessages = require('../../errorMessages');

module.exports = {
  name: "interactiveMap",
  htmlPath: "./interactiveMap.html",

  init: function() {
    this.$el = $('#' + this.name);

    // Check if <div id="interactiveMap"> is in index.html
    if(this.$el.length === 0) {
      console.error(errorMessages.addModule(this.name));
    } else {
      this.render(this.$el);
    }
  },

  render: function(el) {
    $.get(this.htmlPath, function(data){
      el.html(data);
    });
  }
};
