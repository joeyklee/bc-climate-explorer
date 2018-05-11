var app = app || {};

app.timeseries = (function() {
  console.log("hello from timeseries")
  var el = null;

  const WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 100;

  function buildTimeSeries(containerId, resizeId, trace1, trace2, childId, selectedVariableName) {
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

    Plotly.plot(gd, [trace1, trace2], timeseriesPlotLayout, { displayModeBar: true });

    d3.select(window).on(resizeId, function() {
      Plotly.Plots.resize(gd)
    });
  }

  // timeseries charts
  function timeseriesX() {
    // el.x.timeseries.a
    // el.x.timeseries.b

    let series1 = {
      x: el.x.timeseries.years,
      y: el.x.timeseries.a,
      type: 'scatter'
    }
    let series2 = {
      x: el.x.timeseries.years,
      y: el.x.timeseries.b,
      type: 'scatter'
    }

    buildTimeSeries("#TimeseriesX", "resize.timeseriesX", series1, series2, "tsX-child", el.x.variable)
    console.log(el.x.variable)
  };

  // timeseries charts
  function timeseriesY() {
    // el.x.timeseries.a
    // el.x.timeseries.b

    let series1 = {
      x: el.y.timeseries.years,
      y: el.y.timeseries.a,
      type: 'scatter'
    }
    let series2 = {
      x: el.y.timeseries.years,
      y: el.y.timeseries.b,
      type: 'scatter'
    }

    buildTimeSeries("#TimeseriesY", "resize.timeseriesY", series1, series2, "tsY-child", el.y.variable)
    console.log(el.y.variable)
  };




  var init = function() {
    el = app.main.el;

    PubSub.subscribe("timeseriesXLoaded", timeseriesX)
    PubSub.subscribe("xTimescaleChanged", timeseriesX)
    PubSub.subscribe("focalUnitAChanged", timeseriesX)
    PubSub.subscribe("focalUnitBChanged", timeseriesX)
    PubSub.subscribe("xVariableChanged", timeseriesX)

    PubSub.subscribe("timeseriesYLoaded", timeseriesY)
    PubSub.subscribe("yTimescaleChanged", timeseriesY)
    PubSub.subscribe("focalUnitAChanged", timeseriesY)
    PubSub.subscribe("focalUnitBChanged", timeseriesY)
    PubSub.subscribe("yVariableChanged", timeseriesY)

  };


  return {
    init: init
  }

})();