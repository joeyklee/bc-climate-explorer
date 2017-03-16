'use strict';

var interactiveMapController = require('../../../src/modules/maps/interactiveMapController');
var $ = require('jquery');

describe('Interactive Map Module', function() {
  beforeAll(function() {
    // fixture.setBase('test');
    // fixture.load('index.html');
    // interactiveMapController.setHtmlFilePath('../../../src/modules/maps/interactiveMap.html');
    // interactiveMapController.init();

    // var $indexDiv = $('#' + 'interactive-map-index');
    // if($indexDiv.length === 0) {
    //   console.log("errorid");
    // } else {
    //   $indexDiv.load('modules/maps/interactiveMap.html', function(response, status, jqxhr) {
    //     if(status == 'error') {
    //       console.log("errorfile");
    //     }
    //     console.log("success");
    //   });
    // }
    // console.log($indexDiv);
  });

  describe('after initialization', function() {
    it('html module should be loaded in index.html', function() {
      // Get content of module html
      // var htmlIndexHtml = $('#' + interactiveMapController.getViewId()).html();
      // $.get('../../../src/modules/maps/interactiveMap.html', function(data) {
      //   console.log(htmlIndexHtml);
      //   expect(htmlIndexHtml).toBe(data);
      // });
    });
  });
});