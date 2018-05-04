$(document).ready( function(){
var mymap;

  function initMap() {

    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiY2pncmFuZGlkMDd2aDJ6cnQydHZ6ZXV4YSJ9.rgxCsa4n54D2nNH13dNs1A';
    var mymap = new mapboxgl.Map({
        center:[-123.1, 52.2],
        zoom:3,
        minZoom:3,
        maxZoom:10,
        container: 'map-container',
        style: 'mapbox://styles/mapbox/satellite-streets-v10'
    });


    mymap.on('load', function(){
      mymap.addSource('bec-layer', {
          "type": "vector",
          "tiles": [
              "http://tiles.jk-lee.com/BGCv10beta_100m/{z}/{x}/{y}.pbf"
          ]
      });

      var becStyle = {
        "id": "bec-layer",
        "source": "bec-layer",
        "source-layer": "BGCv10beta_100m",
        "paint": {
            "fill-color": [
                'match',
                ['get', 'ZONE'],
                'CMA', '#136400',
                'ESSF', '#229A00',
                'BAFA', '#B81609',
                'MH', '#D6301D',
                'SBS', '#D6301D',
                'CWH', '#F84F40',
                'MS', '#41006D',
                'IDF', '#7B00B4',
                'IMA', '#A53ED5',
                'ICH', '#2E5387',
                'PP', '#3E7BB6',
                'BG', '#FF6600',
                'SBPS', '#FF9900',
                'SWB', '#FFCC00',
                'BWBS', '#FF5C00',
                'CDF', '#FFA300',
                /* other */ '#ccc'
            ]
            // "fill-outline-color":"#FFFFFF"
            },
        "type": "fill"
      }
      mymap.addLayer(becStyle);

    })

    var datafill = function(obj){

      return (
        `
        <h3>${obj.features[0].properties.MAP_LABEL}</h3>
        <small>set as</small>
        <div>
        <button class="btn btn-success">Var 1</button> <button class="btn btn-warning">Var 2</button>
        </div>
        `
        )
      
    }

    // highlight
    // https://www.mapbox.com/mapbox-gl-js/example/query-similar-features/
    mymap.on('click', 'bec-layer', function (e) {
        console.log(e.features[0].properties.MAP_LABEL)
        // 
        fetch(encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, dd5_09 FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy`))
            .then(function(response) {
              return response.json();
            })
            .then(function(myJson) {
              console.log(myJson);
            })

                       new mapboxgl.Popup()
                           .setLngLat(e.lngLat)
                           .setHTML(datafill(e))
                           .addTo(mymap);
                   });

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
        plot_bgcolor: '#45475E',
        paper_bgcolor: '#45475E',
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

      d3.select(window).on('resize.timeseries1', function() {
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
        plot_bgcolor: '#45475E',
        paper_bgcolor: '#45475E',
        margin: {
          l: 50,
          r: 40,
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

      d3.select(window).on('resize.timeseries2', function() {
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
        plot_bgcolor: '#45475E',
        paper_bgcolor: '#45475E',
        margin: {
          l: 50,
          r: 40,
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

      d3.select(window).on('resize.scatterplot1', function() {
        Plotly.Plots.resize(gd)
      });
    }
    return {
      init: init
    }
  })();

  $(".chosen-select").chosen()

  Timeseries1.init();
  Timeseries2.init();
  Scatterplot1.init();
});