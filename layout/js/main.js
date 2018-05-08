$(document).ready(function() {
  let mymap;
  // no longer needed since we load d3 anyways
  // const d3 = Plotly.d3;  
  const WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 100;


  let appState = {
    zone1: 'SBSdw3',
    zone2: 'BGxh2',
    xTime: 'Annual',
    xVar: 'MAT',
    xDataScatterPlot: [],
    xDataScatterPlotZones: [],
    xDataTimeseriesZone1: [],
    xDataTimeseriesZone2: [],
    yTime: 'Annual',
    yVar: 'MAP',
    yDataScatterPlot: [],
    yDataScatterPlotZones: [],
    yDataTimeseriesZone1: [],
    yDataTimeseriesZone2: []
  }


  const appControllers = (function() {

    function init() {
      loadListeners()
    }

    function loadListeners() {
      // getInputState();
      setInputState();
      filterDropdownTemporally();
      changeMapButtons();
      monitorControlBar();
      clickMapButtonOfChanged()
    }

    function setInputState() {

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

    function getInputState() {
      // TODO: be more specific here since using array index can change
      let changed = [];
      $("select option:selected").each(function() {
        changed.push($(this).val())
      });

      appState.zone1 = changed[0]
      appState.zone2 = changed[1]
      appState.xTime = changed[2]
      appState.xVar = changed[3]
      appState.yTime = changed[4]
      appState.yVar = changed[5]
    }

    function monitorControlBar() {
      // listen for changes in the controller menu
      $("select").change(function() {
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

    function updateCharts() {
      // update all the charts:
      // getInputState();
      console.log(appState)
      Timeseries1.init();
      Timeseries2.init();
      Scatterplot1.init();
    }

    // filter options of variables based on selected time
    function filterDropdownTemporally() {
      // xVar
      let $xVarSelect,
        $yVarSelect;

      $xVarSelect = $("#xVar select");
      $yVarSelect = $("#yVar select");

      if (appState.xTime === "Annual") {
        // make all the nonannual disabled
        $xVarSelect.find("option[label=nonannual]").prop("disabled", true)
        $xVarSelect.find("option[label=annual]").prop("disabled", false)
        $xVarSelect.trigger("chosen:updated");
        if ($xVarSelect.find("option:selected").length) {
          if ($xVarSelect.find("option:selected")[0].label !== 'annual') {
            $xVarSelect.val("MAT").trigger("chosen:updated");
          }
        }

      } else {
        // switch
        $xVarSelect.find("option[label=nonannual]").prop("disabled", false)
        $xVarSelect.find("option[label=annual]").prop("disabled", true)
        $xVarSelect.trigger("chosen:updated");
        if ($xVarSelect.find("option:selected").length) {
          if ($xVarSelect.find("option:selected")[0].label !== 'nonannual') {
            $xVarSelect.val("Tave").trigger("chosen:updated");
          }
        }

      }
      // yVar
      if (appState.yTime === "Annual") {
        // make all the nonannual disabled
        $yVarSelect.find("option[label=nonannual]").prop("disabled", true)
        $yVarSelect.find("option[label=annual]").prop("disabled", false)
        $yVarSelect.trigger("chosen:updated");
        if ($yVarSelect.find("option:selected").length) {
          if ($yVarSelect.find("option:selected")[0].label !== 'annual') {
            $yVarSelect.val("MAT").trigger("chosen:updated");
          }
        }

      } else {
        // switch
        $yVarSelect.find("option[label=nonannual]").prop("disabled", false)
        $yVarSelect.find("option[label=annual]").prop("disabled", true)
        $yVarSelect.trigger("chosen:updated");
        if ($yVarSelect.find("option:selected").length) {
          if ($yVarSelect.find("option:selected")[0].label !== 'nonannual') {
            $yVarSelect.val("Tave").trigger("chosen:updated");
          }
        }
      }
      // finally get the input state to make sure we're synced
      getInputState();
    }

    function changeMapButtons() {
      $("#map-xTime").text(appState.xTime)
      $("#map-xVar").text(appState.xVar)
      $("#map-yTime").text(appState.yTime)
      $("#map-yVar").text(appState.yVar)
    }

    function clickMapButtonOfChanged(){
      // when a controller button is changed, 
      // update the map according to what was changed
      // TODO: update button clicked
      $(".bec-selector-dropdown").change(function() {
        // console.log(this);
        let sel = $(this).attr("id")
        if ( sel === "yVar"){
          console.log("yVar changed")
          $("#map-yVar-button").click()
        } else {
          console.log("xVar changed")
          $("#map-xVar-button").click()
        }
      })
    }



    return {
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
      // change map overlay to variables
      changeMapBecZone()
      changeMapBecUnit()
      changeMapX();
      changeMapY();
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
              'CMA', '#C1CCC2',
              'ESSF', '#005F56',
              'BAFA', '#C1CCC2',
              'MH', '#72C286',
              'SBS', '#857669',
              'CWH', '#97C3A2',
              'MS', '#7AC276',
              'IDF', '#65562A',
              'IMA', '#C1CCC2',
              'ICH', '#5E6737',
              'PP', '#C1CCC2',
              'BG', '#DBD590',
              'SBPS', '#59706E',
              'SWB', '#AF8971',
              'BWBS', '#9FC39D',
              'CDF', '#397262',
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


    /* map data controls */
    function changeMapBecZone(){
      $('#map-bec-zone').click(function(){
        mymap.setPaintProperty('bec-layer', 'fill-color', [
              'match', ['get', 'ZONE'],
              'CMA', '#C1CCC2',
              'ESSF', '#005F56',
              'BAFA', '#C1CCC2',
              'MH', '#72C286',
              'SBS', '#857669',
              'CWH', '#97C3A2',
              'MS', '#7AC276',
              'IDF', '#65562A',
              'IMA', '#C1CCC2',
              'ICH', '#5E6737',
              'PP', '#C1CCC2',
              'BG', '#DBD590',
              'SBPS', '#59706E',
              'SWB', '#AF8971',
              'BWBS', '#9FC39D',
              'CDF', '#397262',
              /* other */
              '#ccc'
            ])
      })
    }

    function changeMapBecUnit(){
      $('#map-bec-unit').click(function(){
        mymap.setPaintProperty('bec-layer', 'fill-color', [
                              'match', ['get', 'MAP_LABEL'],
        'BAFAun','#c1cdc2',
        'BAFAunp','#c1cdc2',
        'BGxh1','#d6d29a',
        'BGxh2','#d6d29a',
        'BGxh3','#d6d29a',
        'BGxw1','#dddaac',
        'BGxw2','#dddaac',
        'BWBSdk','#96b894',
        'BWBSmk','#92bc8f',
        'BWBSmw','#b1cfaf',
        'BWBSvk','#8ac587',
        'BWBSwk1','#8ec18b',
        'BWBSwk2','#8ec18b',
        'BWBSwk3','#8ec18b',
        'CDFmm','#397464',
        'CMAun','#c1cdc2',
        'CMAunp','#c1cdc2',
        'CMAwh','#becfc0',
        'CWHdm','#9bbfa4',
        'CWHds1','#aNaNaN',
        'CWHds2','#aNaNaN',
        'CWHmm1','#97c3a2',
        'CWHmm2','#97c3a2',
        'CWHms1','#aNaNaN',
        'CWHms2','#aNaNaN',
        'CWHvh1','#8fcc9e',
        'CWHvh2','#8fcc9e',
        'CWHvh3','#8fcc9e',
        'CWHvm1n','#8fcc9e',
        'CWHvm1s','#8fcc9e',
        'CWHvm1w','#8fcc9e',
        'CWHvm2n','#8fcc9e',
        'CWHvm2s','#8fcc9e',
        'CWHvm2w','#8fcc9e',
        'CWHwh1','#93c8a0',
        'CWHwh2','#93c8a0',
        'CWHwm','#93c8a0',
        'CWHws1','#aNaNaN',
        'CWHws2','#aNaNaN',
        'CWHxm1','#a0bba6',
        'CWHxm2','#a0bba6',
        'ESSFdc1','#012d29',
        'ESSFdc2','#012d29',
        'ESSFdc3','#012d29',
        'ESSFdcp','#012d29',
        'ESSFdcw','#012d29',
        'ESSFdk1','#024640',
        'ESSFdk2','#024640',
        'ESSFdkp','#024640',
        'ESSFdkw','#024640',
        'ESSFdv1','#011412',
        'ESSFdv2','#011412',
        'ESSFdvp','#011412',
        'ESSFdvw','#011412',
        'ESSFmc','#002e2a',
        'ESSFmcp','#002e2a',
        'ESSFmh','#006159',
        'ESSFmk','#004741',
        'ESSFmkp','#004741',
        'ESSFmm1','#006159',
        'ESSFmm2','#006159',
        'ESSFmm3','#006159',
        'ESSFmmp','#006159',
        'ESSFmmw','#006159',
        'ESSFmv1','#001413',
        'ESSFmv2','#001413',
        'ESSFmv3','#001413',
        'ESSFmv4','#001413',
        'ESSFmvp','#001413',
        'ESSFmw','#007a70',
        'ESSFmw1','#007a70',
        'ESSFmw2','#007a70',
        'ESSFmwp','#007a70',
        'ESSFmww','#007a70',
        'ESSFun','#006159',
        'ESSFunp','#006159',
        'ESSFvc','#002e2a',
        'ESSFvcp','#002e2a',
        'ESSFvcw','#002e2a',
        'ESSFvk','#004741',
        'ESSFvm','#006159',
        'ESSFvmp','#006159',
        'ESSFvmw','#006159',
        'ESSFwc2','#002e2a',
        'ESSFwc2w','#002e2a',
        'ESSFwc3','#002e2a',
        'ESSFwc4','#002e2a',
        'ESSFwcp','#002e2a',
        'ESSFwcw','#002e2a',
        'ESSFwh1','#006159',
        'ESSFwh2','#006159',
        'ESSFwh3','#006159',
        'ESSFwk1','#004741',
        'ESSFwk2','#004741',
        'ESSFwm1','#006159',
        'ESSFwm2','#006159',
        'ESSFwm3','#006159',
        'ESSFwm4','#006159',
        'ESSFwmp','#006159',
        'ESSFwmw','#006159',
        'ESSFwv','#001413',
        'ESSFwvp','#001413',
        'ESSFxc1','#022c28',
        'ESSFxc2','#022c28',
        'ESSFxc3','#022c28',
        'ESSFxcp','#022c28',
        'ESSFxcw','#022c28',
        'ESSFxv1','#011312',
        'ESSFxv2','#011312',
        'ESSFxvp','#011312',
        'ESSFxvw','#011312',
        'ICHdk','#4d5431',
        'ICHdm','#5b643a',
        'ICHdw1','#6a7444',
        'ICHdw3','#6a7444',
        'ICHdw4','#6a7444',
        'ICHmc1','#404625',
        'ICHmc1a','#404625',
        'ICHmc2','#404625',
        'ICHmk1','#4f572e',
        'ICHmk2','#4f572e',
        'ICHmk3','#4f572e',
        'ICHmk4','#4f572e',
        'ICHmk5','#4f572e',
        'ICHmm','#5e6837',
        'ICHmw1','#6d783f',
        'ICHmw2','#6d783f',
        'ICHmw3','#6d783f',
        'ICHmw4','#6d783f',
        'ICHmw5','#6d783f',
        'ICHvc','#434c20',
        'ICHvk1','#535d27',
        'ICHvk1c','#535d27',
        'ICHvk2','#535d27',
        'ICHwc','#414922',
        'ICHwk1','#515a2a',
        'ICHwk1c','#515a2a',
        'ICHwk2','#515a2a',
        'ICHwk3','#515a2a',
        'ICHwk4','#515a2a',
        'ICHxw','#676f49',
        'ICHxwa','#676f49',
        'IDFdc','#42391f',
        'IDFdh','#65582f',
        'IDFdk1','#544927',
        'IDFdk1a','#544927',
        'IDFdk1b','#544927',
        'IDFdk2','#544927',
        'IDFdk3','#544927',
        'IDFdk4','#544927',
        'IDFdk5','#544927',
        'IDFdm1','#65582f',
        'IDFdm2','#65582f',
        'IDFdw','#776737',
        'IDFmw1','#7b6932',
        'IDFmw2','#7b6932',
        'IDFmw2b','#7b6932',
        'IDFww','#7f6b2e',
        'IDFww1','#7f6b2e',
        'IDFxc','#403821',
        'IDFxh1','#625632',
        'IDFxh1a','#625632',
        'IDFxh2','#625632',
        'IDFxh2a','#625632',
        'IDFxk','#51472a',
        'IDFxm','#625632',
        'IDFxw','#72653b',
        'IDFxx1','#aNaNaN',
        'IDFxx2','#aNaNaN',
        'IMAun','#c1cdc2',
        'IMAunp','#c1cdc2',
        'MHmm1n','#74c388',
        'MHmm1s','#74c388',
        'MHmm1w','#74c388',
        'MHmm2n','#74c388',
        'MHmm2s','#74c388',
        'MHmmp','#74c388',
        'MHun','#74c388',
        'MHunp','#74c388',
        'MHwh','#6fc885',
        'MHwh1','#6fc885',
        'MHwhp','#6fc885',
        'MSdc1','#5fae5b',
        'MSdc2','#5fae5b',
        'MSdc3','#5fae5b',
        'MSdk','#70b76c',
        'MSdm1','#80bf7d',
        'MSdm2','#80bf7d',
        'MSdm3','#80bf7d',
        'MSdm3w','#80bf7d',
        'MSdv','#53a14f',
        'MSdw','#91c78e',
        'MSmw1','#8dcc8a',
        'MSmw2','#8dcc8a',
        'MSun','#7cc478',
        'MSxk1','#75b172',
        'MSxk2','#75b172',
        'MSxk3','#75b172',
        'MSxv','#599b55',
        'PPxh1','#c7c7c7',
        'PPxh1a','#c7c7c7',
        'PPxh2','#c7c7c7',
        'PPxh2a','#c7c7c7',
        'SBPSdc','#475251',
        'SBPSmc','#435654',
        'SBPSmk','#4f6462',
        'SBPSxc','#4b4e4e',
        'SBSdh1','#80776f',
        'SBSdh2','#80776f',
        'SBSdk','#736b64',
        'SBSdw1','#8d847c',
        'SBSdw2','#8d847c',
        'SBSdw3','#8d847c',
        'SBSmc1','#6a5e53',
        'SBSmc2','#6a5e53',
        'SBSmc3','#6a5e53',
        'SBSmh','#867769',
        'SBSmk1','#786a5e',
        'SBSmk2','#786a5e',
        'SBSmm','#867769',
        'SBSmw','#938476',
        'SBSun','#867769',
        'SBSvk','#836a54',
        'SBSwk1','#7d6a59',
        'SBSwk2','#7d6a59',
        'SBSwk3','#7d6a59',
        'SBSwk3a','#7d6a59',
        'SWBmk','#a77e62',
        'SWBmks','#a77e62',
        'SWBun','#b08b73',
        'SWBuns','#b08b73',
        'SWBvk','#b37b56',
        'SWBvks','#b37b56',
        '#ccc'])
      })
    }

    let colorPalettes = {
      precip: ['white', 'steelblue'],
      temp: [ 'steelblue', 'brown']
    }

    function selectPalette(climateVariable,colorPalettes){
      let precipVariables = ["MAP","MSP","AHM","SHM","FFP","PPT","NFFD","PAS","Eref","CMD","RH"];

      if(precipVariables.includes(climateVariable)){
        return colorPalettes.precip;
      } else{
        return colorPalettes.temp;
      }
    }

    function changeMapX(){
      $('#map-xVar-button').click(function(){
        let selected = Object.assign({colorsObject:['match', ['get', 'MAP_LABEL']]}, {data: appState.xDataScatterPlot, zone: appState.xDataScatterPlotZones, sel: appState.xVar} )
        console.log("Map X Variable", selected)

        let extent = d3.extent(selected.data)

        // TODO: on variable change, call change map x or y
        let color = d3.scaleLinear()
            .domain(extent)
            .range( selectPalette(selected.sel, colorPalettes) );

        selected.data.forEach((item, i, arr) => {
            selected.colorsObject.push(selected.zone[i] , color(item) )
          })
        selected.colorsObject.push("#ccc")

        mymap.setPaintProperty('bec-layer', 'fill-color', selected.colorsObject)
      })
    }

    function changeMapY(){
      $('#map-yVar-button').click(function(){
        let selected = Object.assign({colorsObject:['match', ['get', 'MAP_LABEL']]}, {data: appState.yDataScatterPlot, zone: appState.yDataScatterPlotZones, sel: appState.yVar} )
        console.log("Map y Variable", selected)

        let extent = d3.extent(selected.data)

        // TODO: on variable change, call change map x or y
        let color = d3.scaleLinear()
            .domain(extent)
            .range( selectPalette(selected.sel, colorPalettes) );

        selected.data.forEach((item, i, arr) => {
            selected.colorsObject.push(selected.zone[i] , color(item) )
          })
        selected.colorsObject.push("#ccc")

        mymap.setPaintProperty('bec-layer', 'fill-color', selected.colorsObject)
      })
    }


    return {
      init: init
    }

  })()

  var months = [
    { "month": "January", "number": "01" },
    { "month": "February", "number": "02" },
    { "month": "March", "number": "03" },
    { "month": "April", "number": "04" },
    { "month": "May", "number": "05" },
    { "month": "June", "number": "06" },
    { "month": "July", "number": "07" },
    { "month": "August", "number": "08" },
    { "month": "September", "number": "09" },
    { "month": "October", "number": "10" },
    { "month": "November", "number": "11" },
    { "month": "December", "number": "12" }
  ]

  var seasons = [
    { "season": "Winter", "abbv": "wt" },
    { "season": "Fall", "abbv": "at" },
    { "season": "Spring", "abbv": "sp" },
    { "season": "Summer", "abbv": "sm" }
  ]

  function formatReqVariable(climateVar, stateTime) {
    var climate_selected = null;
    let timevar;

    if (stateTime.toLowerCase() == 'annual') {
      climate_selected = climateVar;
    } else if (seasons.filter(i => (i.season === stateTime)).length > 0) {
      timevar = seasons.filter(i => (i.season === stateTime))[0].abbv
      console.log(timevar)
      climate_selected = climateVar + '_' + timevar; // for seasonal variables
    } else {
      timevar = months.filter(i => (i.month === stateTime))[0].number
      console.log(timevar)

      if (climateVar.startsWith("dd_0")) {
        climate_selected = climateVar + "_" + timevar; // for jan - dec  
      } else {
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

  function buildTimeSeries(containerId, resizeId, trace1, trace2, childId) {
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

          
          let years = data.rows.map(obj => (obj.year))
          appState.xDataTimeseriesZone1 = data.rows.map(obj => { if (obj.id2 == appState.zone1) return obj[xSelection] })
          appState.xDataTimeseriesZone2 = data.rows.map(obj => { if (obj.id2 == appState.zone2) return obj[xSelection] })

          let series1 = {
            x: years,
            y: appState.xDataTimeseriesZone1,
            type: 'scatter'
          }
          let series2 = {
            x: years,
            y: appState.xDataTimeseriesZone2,
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
          
          let years = data.rows.map(obj => (obj.year))
          appState.yDataTimeseriesZone1 = data.rows.map(obj => { if (obj.id2 == appState.zone1) return obj[ySelection] })
          appState.yDataTimeseriesZone2 = data.rows.map(obj => { if (obj.id2 == appState.zone2) return obj[ySelection] })

          let series1 = {
            x: years,
            y: appState.yDataTimeseriesZone1,
            type: 'scatter'
          }
          let series2 = {
            x: years,
            y: appState.yDataTimeseriesZone2,
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

          appState.xDataScatterPlot = data.rows.map(obj => { return obj[xSelection] })
          appState.xDataScatterPlotZones = data.rows.map(obj => { return obj.map_label })
          
          appState.yDataScatterPlot = data.rows.map(obj => { return obj[ySelection] })
          appState.yDataScatterPlotZones = data.rows.map(obj => { return obj.map_label })

          let series1 = {
            x: appState.xDataScatterPlot,
            y: appState.yDataScatterPlot,
            type: 'scatter',
            mode: 'markers'
          }

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