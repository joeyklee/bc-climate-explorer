var app = app || {};

app.timeseries = (function() {
  console.log("hello from timeseries")
  var el = null;

  const WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 100;

  function buildTimeSeries(containerId, resizeId, dataArr, childId, selectedVariableName) {
    d3.select(`#${childId}`).remove();
    let gd3 = d3.select(containerId).append('div')
      .attr('id', childId)
      .style("width", "100%")
      .style("height", "100%")
    let gd = gd3.node();

    // get a copy of the default chart layout
    let timeseriesPlotLayout = Object.assign({}, el.helpers.chartLayout)
    // add in your axis titles
    timeseriesPlotLayout.xaxis.title = 'years'
    timeseriesPlotLayout.yaxis.title = selectedVariableName

    Plotly.plot(gd, dataArr, timeseriesPlotLayout, { displayModeBar: true });

    d3.select(window).on(resizeId, function() {
      Plotly.Plots.resize(gd)
    });
  }

  function makeChart(select){
    // let select = 'y'
    let selectedTimeseries = el[select].timeseries
    let series1 = {
      x: selectedTimeseries.years,
      y: selectedTimeseries.a,
      mode: 'lines',
        line: {
          color: '#FE7452',
          width: 1
        },
        name: el.focalUnitA
    }
    let series2 = {
      x: selectedTimeseries.years,
      y: selectedTimeseries.b,
      mode: 'lines',
        line: {
          color: '#7BCBB4',
          width: 1
        },
        name: el.focalUnitB
    }

    let a_rcp45 = {
      x: selectedTimeseries.years_projected,
      y: selectedTimeseries.a_rcp45,
      mode: 'lines',
      line: {
        color: '#FE7452',
        width: 2
      },
      name: `RCP4.5`
    }

    let a_rcp85 = {
      x: selectedTimeseries.years_projected,
      y: selectedTimeseries.a_rcp85,
      mode: 'lines',
      line: {
        color: '#FE7452',
        width: 2
      },
      name: `RCP8.5`
    }

    let b_rcp45 = {
      x: selectedTimeseries.years_projected,
      y: selectedTimeseries.b_rcp45,
      mode: 'lines',
      line: {
        color: '#7BCBB4',
        width: 2
      },
      name: `RCP4.5`
    }

    let b_rcp85 = {
      x: selectedTimeseries.years_projected,
      y: selectedTimeseries.b_rcp85,
      mode: 'lines',
      line: {
        color: '#7BCBB4',
        width: 2
      },
      name: `RCP8.5`
    }

    let letter = select.toUpperCase();
    buildTimeSeries(`#Timeseries${letter}`, `resize.timeseries${letter}`, [series1, a_rcp45, a_rcp85, series2, b_rcp45, b_rcp85], `ts${letter}Child`, el[select].variable)
  };


  var init = function() {
    el = app.main.el;

    ['timeseriesXLoaded',
    'xTimescaleChanged',
    'focalUnitAChanged',
    'focalUnitBChanged',
    'xVariableChanged'].forEach( (msg) => {
      PubSub.subscribe(msg, makeChart.bind(this, 'x'))
    });

    ['timeseriesYLoaded',
    'yTimescaleChanged',
    'focalUnitAChanged',
    'focalUnitBChanged',
    'yVariableChanged'].forEach( (msg) => {
      PubSub.subscribe(msg, makeChart.bind(this, 'y'))
    });

  };


  return {
    init: init
  }

})();