$(document).ready( function(){
var mymap;

  function initMap() {
    // initialize map container
    mymap = L.map('map-container', { zoomControl: false, attributionControl: false }).setView([37.799289, -122.266433], 13);

    // get the stamen toner-lite tiles
    var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> — Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });

    // var info = L.control.attribution({position:'bottomleft', collapsed:true});
    // info.addTo(mymap);

    // add the tiles to the map
    Stamen_Toner.addTo(mymap);
    L.control.zoom({ position: "bottomright" })

    //disable scroll wheel zoom 
    // mymap.scrollWheelZoom.disable();
  }
  // call initMap()
  initMap();



  // open and close
  $(".map-controls-switch").click(function() {
    $(".map-controls").toggleClass("active")
  })

  // timeseries charts

  const d3 = Plotly.d3;
  const WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 100;

  const Timeseries1 = (function() {

    const init = function() {
      buildChart();
    };

    var buildChart = function() {

      let gd3 = d3.select('#timeseries-1')
      let gd = gd3.node();

      let layout = {
        plot_bgcolor: 'white',
        paper_bgcolor: 'purple',
        margin: {
          l: 50,
          r: 20,
          b: 40,
          t: 30,
          pad: 0
        },
        xaxis: {
          autotick: true,
          showgrid: false,
          // range: [1, 12],
          ticks: "inside",
          rangemode: 'tozero',
          color: "#ffffff",
          zeroline: true,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 1,
          showline: true,
          autotick: false,
        },
        yaxis: {
          showticklabels: true,
          autotick: true,
          showgrid: false,
          ticks: "inside",
          rangemode: 'tozero',
          color: "#ffffff",
          zeroline: false,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 1,
          showline: true
        }
      };


      var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
      };

      var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter'
      };

      Plotly.plot(gd, [trace1, trace2], layout, { displayModeBar: true });

      d3.select(window).on('resize.about', function() {
        Plotly.Plots.resize(gd)
      });
    }
    return {
      init: init
    }
  })();


  const Timeseries2 = (function() {

    const init = function() {
      buildChart();
    };

    var buildChart = function() {

      let gd3 = d3.select('#timeseries-2')
      let gd = gd3.node();

      let layout = {
        plot_bgcolor: 'white',
        paper_bgcolor: 'purple',
        margin: {
          l: 50,
          r: 20,
          b: 40,
          t: 30,
          pad: 0
        },
        xaxis: {
          autotick: true,
          showgrid: false,
          // range: [1, 12],
          ticks: "inside",
          rangemode: 'tozero',
          color: "#ffffff",
          zeroline: true,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 1,
          showline: true,
          autotick: false,
        },
        yaxis: {
          showticklabels: true,
          autotick: true,
          showgrid: false,
          ticks: "inside",
          rangemode: 'tozero',
          color: "#ffffff",
          zeroline: false,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 1,
          showline: true
        }
      };


      var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
      };

      var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter'
      };

      Plotly.plot(gd, [trace1, trace2], layout, { displayModeBar: true });

      d3.select(window).on('resize.about', function() {
        Plotly.Plots.resize(gd)
      });
    }
    return {
      init: init
    }
  })();


  const Scatterplot1 = (function() {

    const init = function() {
      buildChart();
    };

    var buildChart = function() {

      let gd3 = d3.select('#scatterplot-1')
      let gd = gd3.node();

      let layout = {
        plot_bgcolor: 'white',
        paper_bgcolor: 'purple',
        margin: {
          l: 50,
          r: 20,
          b: 60,
          t: 30,
          pad: 0
        },
        xaxis: {
          autotick: true,
          showgrid: false,
          // range: [1, 12],
          ticks: "inside",
          rangemode: 'tozero',
          color: "#ffffff",
          zeroline: true,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 1,
          showline: true,
          autotick: false,
        },
        yaxis: {
          showticklabels: true,
          autotick: true,
          showgrid: false,
          ticks: "inside",
          rangemode: 'tozero',
          color: "#ffffff",
          zeroline: false,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 1,
          showline: true
        }
      };


      var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
      };

      var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter'
      };

      Plotly.plot(gd, [trace1, trace2], layout, { displayModeBar: true });

      d3.select(window).on('resize.about', function() {
        Plotly.Plots.resize(gd)
      });
    }
    return {
      init: init
    }
  })();

  Timeseries1.init();
  Timeseries2.init();
  Scatterplot1.init();
});