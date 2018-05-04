$(document).ready(function() {
  let mymap;
  const d3 = Plotly.d3;
  const WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 100;


  const appState = {
    zone1: 'SBSdw3',
    zone2: 'null',
    xTime: 'Annual',
    xVar: 'MAT',
    yTime: 'Annual',
    yVar: 'MAP'
  }


  const appControllers = (function(){

    function init(){
      loadListeners()
    }

    function loadListeners(){
      getInputState();
      filterDropdownTemporally();
      changeMapButtons();
      monitorControlBar();
    }

    function getInputState(){
      let changed = [];
      $( "select option:selected" ).each(function() {
        changed.push($(this).val())
      });

      appState.zone1 = changed[0]
      appState.zone2 = changed[1]
      appState.xTime = changed[2]
      appState.xVar = changed[3]
      appState.yTime = changed[4]
      appState.yVar = changed[5]
      console.log(appState)
    }

    function monitorControlBar(){
      // listen for changes in the controller menu
      $( "select" ).change(function () {
          // get input state
          getInputState();
          filterDropdownTemporally();

          // update map buttons:
          changeMapButtons();
        })
    }

    // filter options of variables based on selected time
    function filterDropdownTemporally(){
      // xVar
      let $xVarSelect,
          $yVarSelect;

      $xVarSelect = $("#xVar select");
      $yVarSelect = $("#yVar select");

      if(appState.xTime === "Annual"){
        // make all the nonannual disabled
        $xVarSelect.find("option[label=nonannual]").prop("disabled", true)
        $xVarSelect.find("option[label=annual]").prop("disabled", false)
        $xVarSelect.trigger("chosen:updated");
        if( $xVarSelect.find("option:selected").length ) {
          if( $xVarSelect.find("option:selected")[0].label !== 'annual') {
              $xVarSelect.val("MAT").trigger("chosen:updated"); 
          }
        }
        
      } else{
        // switch
        $xVarSelect.find("option[label=nonannual]").prop("disabled", false)
        $xVarSelect.find("option[label=annual]").prop("disabled",true)
        $xVarSelect.trigger("chosen:updated");
        if( $xVarSelect.find("option:selected").length ) {
          if( $xVarSelect.find("option:selected")[0].label !== 'nonannual') {
              $xVarSelect.val("Tave").trigger("chosen:updated"); 
          }
        }

      }
      // yVar
      if(appState.yTime === "Annual"){
        // make all the nonannual disabled
        $yVarSelect.find("option[label=nonannual]").prop("disabled", true)
        $yVarSelect.find("option[label=annual]").prop("disabled", false)
        $yVarSelect.trigger("chosen:updated");
        if( $yVarSelect.find("option:selected").length ) {
          if( $yVarSelect.find("option:selected")[0].label !== 'annual') {
              $yVarSelect.val("MAT").trigger("chosen:updated"); 
          }
        }
        
      } else{
        // switch
        $yVarSelect.find("option[label=nonannual]").prop("disabled", false)
        $yVarSelect.find("option[label=annual]").prop("disabled",true)
        $yVarSelect.trigger("chosen:updated");
        if( $yVarSelect.find("option:selected").length ) {
          if( $yVarSelect.find("option:selected")[0].label !== 'nonannual') {
              $yVarSelect.val("Tave").trigger("chosen:updated"); 
          }
        }
      }

    }

    function changeMapButtons(){
      $("#map-xTime").text(appState.xTime)
      $("#map-xVar").text(appState.xVar)
      $("#map-yTime").text(appState.yTime)
      $("#map-yVar").text(appState.yVar)
    }



    return{
      init: init
    }

  })();



  const Geo = (function() {

    function init() {
      initMap();
      loadEvents();
    }

    function loadEvents() {
      toggleMenu();
      mapEvents();

    }


    function initMap() {

      mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiY2pncmFuZGlkMDd2aDJ6cnQydHZ6ZXV4YSJ9.rgxCsa4n54D2nNH13dNs1A';

      mymap = new mapboxgl.Map({
        center: [-123.1, 52.2],
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
        container: 'map-container',
        style: 'mapbox://styles/mapbox/satellite-streets-v10'
      });


      mymap.on('load', function() {

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
              'match', ['get', 'ZONE'],
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
              /* other */
              '#ccc'
            ]
            // "fill-outline-color":"#FFFFFF"
          },
          "type": "fill"
        }
        mymap.addLayer(becStyle);

      })
    }


    let datafill = function(obj) {
      return (
        `
        <h3>${obj.features[0].properties.MAP_LABEL}</h3>
        <small>set as</small>
        <div>
        <button class="btn btn-success">Zone A</button> <button class="btn btn-warning">Zone B</button>
        </div>
        `
      )
    }


    function mapEvents() {
      // highlight
      // https://www.mapbox.com/mapbox-gl-js/example/query-similar-features/
      mymap.on('click', 'bec-layer', function(e) {
        console.log(e.features[0].properties)
        // 
        fetch(encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, dd5_09 FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label='${e.features[0].properties.MAP_LABEL}'`))
            .then(function(response) {
              return response.json();
            })
            .then(function(myJson) {
              console.log(myJson);
            })

        // get features
        // var features = mymap.querySourceFeatures('bec-layer');
        // var features = mymap.queryRenderedFeatures({ layers: ['bec-layer'], filter: ["==", "MAP_LABEL", "SBSdw3"] });
        // console.log("the features", features)


        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(datafill(e))
          .addTo(mymap);
      });
    }


    function toggleMenu() {
      // open and close
      $(".map-controls-switch").click(function() {
        $(".map-controls").toggleClass("active")
      })
    }


    return {
      init: init
    }

  })()



  // timeseries charts
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




  // dropdown menus
  $(".chosen-select").chosen()

  Geo.init();
  Timeseries1.init();
  Timeseries2.init();
  Scatterplot1.init();

  appControllers.init();
});