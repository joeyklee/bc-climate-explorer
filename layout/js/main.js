$(document).ready(function() {
  let mymap;
  const d3 = Plotly.d3;
  const WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 100;


  let appState = {
    zone1: 'SBSdw3',
    zone2: 'BGxh2',
    xTime: 'Annual',
    xVar: 'MAT',
    xDataScatterPlot: [],
    xDataTimeseries: [],
    yTime: 'Annual',
    yVar: 'MAP',
    yDataScatterPlot: [],
    yDataTimeseries: []
  }


  const appControllers = (function(){

    function init(){
      loadListeners()
    }

    function loadListeners(){
      // getInputState();
      setInputState();
      filterDropdownTemporally();
      changeMapButtons();
      monitorControlBar();
    }

    function setInputState(){

      // xVar
      let $zone1,
          $zone2,
          $xVarSelect,
          $xTimeSelect,
          $yVarSelect,
          $yTimeSelect;

      $zone1Select = $("#zone1 select");
      $zone2Select = $("#zone2 select");
      $xVarSelect = $("#xVar select");
      $yVarSelect = $("#yVar select");
      $xTimeSelect = $("#xTime select");
      $yTimeSelect = $("#yTime select");

      $zone1Select.val(appState.zone1).trigger("chosen:updated"); 
      $zone2Select.val(appState.zone2).trigger("chosen:updated");

      $xVarSelect.val(appState.xVar).trigger("chosen:updated"); 
      $xTimeSelect.val(appState.xTime).trigger("chosen:updated"); 

      $yVarSelect.val(appState.yVar).trigger("chosen:updated"); 
      $yTimeSelect.val(appState.yTime).trigger("chosen:updated"); 

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
      // console.log(appState)
    }

    function monitorControlBar(){
      // listen for changes in the controller menu
      $( "select" ).change(function () {
          // get input state
          getInputState();

          // filter options based on time
          filterDropdownTemporally();

          // update map buttons:
          changeMapButtons();

          // update charts
          updateCharts()

        })
    }

    function updateCharts(){
      // update all the charts:
      // getInputState();
      console.log(appState)
      Timeseries1.init();
      Timeseries2.init();
      Scatterplot1.init();
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
      // finally get the input state to make sure we're synced
      getInputState();
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
        fetch(encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT * FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label='${e.features[0].properties.MAP_LABEL}'`))
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

  var months = [
    {"month":"January", "number":"01"},
    {"month":"February", "number":"02"},
    {"month":"March", "number":"03"},
    {"month":"April", "number":"04"},
    {"month":"May", "number":"05"},
    {"month":"June", "number":"06"},
    {"month":"July", "number":"07"},
    {"month":"August", "number":"08"},
    {"month":"September", "number":"09"},
    {"month":"October", "number":"10"},
    {"month":"November", "number":"11"},
    {"month":"December", "number":"12"}
  ]

  var seasons = [
    {"season":"Winter", "abbv":"wt"},
    {"season":"Fall", "abbv":"at"},
    {"season":"Spring", "abbv":"sp"},
    {"season":"Summer", "abbv":"sm"}
  ]

  function formatReqVariable(climateVar,stateTime){
    var climate_selected = null;
    let timevar;

    if (stateTime.toLowerCase() == 'annual'){
         climate_selected = climateVar;
    } else if ( seasons.filter( i => ( i.season === stateTime)).length > 0 ) {
        timevar = seasons.filter( i => ( i.season === stateTime))[0].abbv
        console.log(timevar)
        climate_selected = climateVar + '_' + timevar; // for seasonal variables
    } else{
        timevar = months.filter( i => ( i.month === stateTime))[0].number
        console.log(timevar)
        
        if(climateVar.startsWith("dd_0")){
          climate_selected = climateVar + "_" + timevar; // for jan - dec  
        } else{
          climate_selected = climateVar + timevar; // for jan - dec  
        }
        
    }
    return climate_selected.toLowerCase()
    
  }


  let chartLayout = {
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
          ticks: "inside",
          color: "#ffffff",
          // zerolinewidth: 1,
          // showline: true,
          autotick: true,
        },
        yaxis: {
          showticklabels: true,
          autotick: true,
          showgrid: false,
          ticks: "inside",
          color: "#ffffff",
          zerolinewidth: 1,
          zeroline: true
          // showline: true
        }
      };


  // var trace1 = {
  //   x: [1, 2, 3, 4],
  //   y: [10, 15, 13, 17],
  //   type: 'scatter'
  // };

  // var trace2 = {
  //   x: [1, 2, 3, 4],
  //   y: [16, 5, 11, 9],
  //   type: 'scatter'
  // };

  function buildTimeSeries(containerId, resizeId, trace1, trace2, childId){
    d3.select(`#${childId}`).remove();
    let gd3 = d3.select(containerId).append('div')
                .attr('id', childId)
                .style("width", "100%")
                .style("height", "100%")
    let gd = gd3.node();   

    Plotly.plot(gd, [trace1, trace2], chartLayout, { displayModeBar: true });

    d3.select(window).on(resizeId, function() {
      Plotly.Plots.resize(gd)
    });
  }


  // timeseries charts
  const Timeseries1 = (function(containerId, resizeId) {

    const init = function() {
      buildChart();
    };

    
    // encodeURI(`SELECT DISTINCT id2, year, mat FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = SBSdw3 OR id2 = SBSdw3) AND year >= 1901 AND year <=2014`)
    // `https://becexplorer.cartodb.com/api/v2/sql?q=${encodeURI(`SELECT DISTINCT id2, year, mat FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = 'SBSdw3' OR id2 = 'SBSdw3') AND year >= 1901 AND year <=2014`)}`
    var buildChart = function() {
      let xSelection = formatReqVariable(appState.xVar, appState.xTime)
      var query = encodeURI(`SELECT DISTINCT id2, year, ${xSelection} FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = '${appState.zone1}' OR id2 = '${appState.zone2}') AND year >= 1901 AND year <=2014`)
      $.getJSON(`https://becexplorer.cartodb.com/api/v2/sql?q=${query}`)
        .done(data => {
          console.log("Timeseries1", xSelection)
          console.log("Timeseries1", data);
          let series1 = {
            x: data.rows.map(obj => (obj.year)),
            y:data.rows.map(obj => { if(obj.id2 == appState.zone1) return obj[xSelection] }),
            type: 'scatter'
          }
          let series2 = {
            x:data.rows.map(obj => (obj.year)),
            y:data.rows.map(obj => { if(obj.id2 == appState.zone2) return obj[xSelection] }),
            type: 'scatter'
          }

          buildTimeSeries(containerId, resizeId, series1, series2, "ts1-child")  
        })
      
    }

    return {
      init: init
    }
  })("#timeseries-1", "resize.timeseries1");

  // timeseries charts
  const Timeseries2 = (function(containerId, resizeId) {

    const init = function() {
      buildChart();
    };


    

    var buildChart = function() {
      let ySelection = formatReqVariable(appState.yVar, appState.yTime)
      var query = encodeURI(`SELECT DISTINCT id2, year, ${ySelection} FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = '${appState.zone1}' OR id2 = '${appState.zone2}') AND year >= 1901 AND year <=2014`)
      $.getJSON(`https://becexplorer.cartodb.com/api/v2/sql?q=${query}`)
        .done(data => {
          console.log("Timeseries2", ySelection)
          console.log("Timeseries2", data);
          let series1 = {
            x: data.rows.map(obj => (obj.year)),
            y:data.rows.map(obj => { if(obj.id2 == appState.zone1) return obj[ySelection] }),
            type: 'scatter'
          }
          let series2 = {
            x:data.rows.map(obj => (obj.year)),
            y:data.rows.map(obj => { if(obj.id2 == appState.zone2) return obj[ySelection] }),
            type: 'scatter'
          }

          buildTimeSeries(containerId, resizeId, series1, series2, "ts2-child")  
        })
      
    }
    return {
      init: init
    }
  })("#timeseries-2", "resize.timeseries2");


  const Scatterplot1 = (function() {

    const init = function() {
      buildChart();
    };

    

    var buildChart = function() {
      d3.select("#scatter-child").remove();
      let gd3 = d3.select('#scatterplot-1').append('div')
                .attr('id', 'scatter-child')
                .style("width", "100%")
                .style("height", "100%")

      let gd = gd3.node();

      // "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
      // "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
      let xSelection = formatReqVariable(appState.xVar, appState.xTime)
      let ySelection = formatReqVariable(appState.yVar, appState.yTime)
      var query = `https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, ${xSelection}, ${ySelection} FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label IS NOT NULL AND '${xSelection}' IS NOT NULL AND '${ySelection}' IS NOT NULL`
      $.getJSON(encodeURI(query))
        .done(data => {

          let series1 = {
            x: data.rows.map(obj => {  return obj[xSelection] }),
            y: data.rows.map(obj => {  return obj[ySelection] }),
            type: 'scatter',
            mode: 'markers'
          }
          // let series2 = {
          //   x:data.rows.map(obj => (obj.year)),
          //   y:data.rows.map(obj => { if(obj.map_label == appState.zone2) return obj[appState.yVar.toLowerCase()] }),
          //   type: 'scatter',
          //   mode: 'markers'
          // }

          Plotly.plot(gd, [series1], chartLayout, { displayModeBar: true });

          d3.select(window).on('resize.scatterplot1', function() {
            Plotly.Plots.resize(gd)
          });

        })


      
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