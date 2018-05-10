var app = app || {};

app.geo = (function() {
  console.log("hello from geo")
  var el = null;


  function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiY2pncmFuZGlkMDd2aDJ6cnQydHZ6ZXV4YSJ9.rgxCsa4n54D2nNH13dNs1A';

    el.geo = new mapboxgl.Map({
      center: [-123.1, 52.2],
      zoom: 3,
      minZoom: 3,
      maxZoom: 10,
      container: 'Geo',
      style: 'mapbox://styles/mapbox/light-v9'
    });
    // satellite-streets-v10
    // streets-v10
    // light-v9


  }


  /***
  We use an async function in the callback
  to get our json files
  */
  function addSources() {
    // load in bec-layer source
    el.geo.on('load', function() {
      // add sources
      el.geo.addSource('bec-layer', {
        "type": "vector",
        "tiles": [
          "http://tiles.jk-lee.com/BGCv10beta_100m/{z}/{x}/{y}.pbf"
        ]
      });      

      // add the layer to be worked on with the default zone style
      el.geo.addLayer(el.colors.zoneStyles)

    })
  }

  /***
  @ LoadStyles
  @ 
  */
  async function loadStyles(){
    el.colors.zoneStyles = await $.getJSON("../../data/bec-colors/bec-zone-colors.json")
    el.colors.unitStyles = await $.getJSON("../../data/bec-colors/bec-unit-colors.json")
  }


  /***
  @ 
  @ Param: style should be el.colors.zoneStyles
  @
  */
  function changeMapZone(style, zoneLevel){
    el.geo.setPaintProperty('bec-layer', 'fill-color', style['fill-color'])
    // publish changes
    renderMapStyleChange(style, zoneLevel)
  }


  /**
  @ make/change legend
  @
  */
  function changeLegend(msg, switched){
    
    let $mapLegend = $(".map-legend")
    let legendItems = '';

    // clear the dom
    $mapLegend.html('')
    // loop through
    switched.style['fill-color'].forEach( (item, idx, arr) => {      
      if( idx > 1 && idx < arr.length - 1 && item.startsWith("#")){
        legendItems += `<div style="width:10px;height:10px;background-color:${item}"><div class="hidden">${arr[idx-1]}</div></div>\n`
      }
    })

    $mapLegend.html(legendItems)

    console.log(el);
  }


  /**
  @ toggle aerial/light basemap
  @ TODO: issues here // https://github.com/mapbox/mapbox-gl-js/issues/2267
  @ DISABLED FOR NOW
  */
  function toggleBaseMap(msg, data){
    let current = el.geo.getStyle().metadata["mapbox:origin"];
    if(current === "light-v9"){
      el.geo.setStyle('mapbox://styles/mapbox/satellite-streets-v10')
    } else{
      el.geo.setStyle('mapbox://styles/mapbox/light-v9')
    }
  }


  /***
  @ Bind Module events
  */
  function bindEvents(){
    el.selectors.geoZone.on('click', changeMapZone.bind(this, el.colors.zoneStyles.paint, 'zones') )
    el.selectors.geoUnit.on('click', changeMapZone.bind(this, el.colors.unitStyles.paint, 'units'))

    // @ DISABLED FOR NOW
    // el.selectors.basemap.on('click', toggleBaseMap)
  }


  function renderMapStyleChange(style, zoneLevel){
    PubSub.publish("mapStyleChanged", {style: style, feature: zoneLevel})
  }



  var init = function() {
    el = app.main.el;
    
    initMap();

    PubSub.subscribe("mapStyleChanged", changeLegend)
    // PubSub.subscribe("mapBasemapChanged", toggleBaseMap)
    loadStyles()
      .then(addSources)
      .then(function() {
        // bind events
        bindEvents()
        changeLegend();
        renderMapStyleChange();

        
      })
  };


  return {
    init: init
  }

})();