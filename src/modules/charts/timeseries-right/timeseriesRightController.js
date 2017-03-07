'use strict';

var $ = require('jquery');
var moduleBase = require('../../../moduleBase');

module.exports = moduleBase.create({
  init: function() {
    this.htmlIndexId = 'timeseries-right-index';
    this.htmlModuleId = 'timeseries-right-module';
    this.htmlModulePath = './timeseriesRight.html';
    this.htmlChartModuleId = 'timeseries-right-module-chart';

    var timeseriesRightController = this;
    this.loadViews(this.htmlIndexId, this.htmlModuleId, this.htmlModulePath)
      .then(function(success) {
        timeseriesRightController.initChart();
      })
      .catch(function(errorMsg) {
        console.error(errorMsg);
      });
  },

  initChart: function() {
    var chartCtx = $('#' + this.htmlChartModuleId);
    var data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40],
          spanGaps: false,
        }
      ]
    };
    var myLineChart = new Chart(chartCtx, {
      type: 'line',
      data: data,
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
