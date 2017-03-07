'use strict';

var moduleBase = require('../../../moduleBase');
var errorMsg = require('../../../errorMessages');
var chartJs = require('chart.js');
var $ = require('jquery');

module.exports = moduleBase.create({
  init: function() {
    this.htmlIndexId = 'scatterplot-index';
    this.htmlModuleId = 'scatterplot-module';
    this.htmlModulePath = './scatterplot.html';
    this.htmlChartModuleId = 'scatterplot-module-chart';

    var scatterplotController = this;
    this.loadViews(this.htmlIndexId, this.htmlModuleId, this.htmlModulePath)
      .then(function(success) {
        scatterplotController.initChart();
      })
      .catch(function(errorMsg) {
        console.error(errorMsg);
      });
  },

  initChart: function() {
    var chartCtx = $('#' + this.htmlChartModuleId);
    var myChart = new Chart(chartCtx, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'First Dataset',
            data: [
              {
                x: 20,
                y: 30,
                r: 5
              },
              {
                x: 40,
                y: 10,
                r: 5
              },
              {
                x: 23,
                y: 12,
                r: 5
              },
              {
                x: 33,
                y: 21,
                r: 5
              },
              {
                x: 13,
                y: 31,
                r: 5
              },
              {
                x: 25,
                y: 25,
                r: 5
              },
              {
                x: 11,
                y: 11,
                r: 5
              }
            ],
            backgroundColor:"#FF4000",
            hoverBackgroundColor: "#FF4000",
          }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }
});