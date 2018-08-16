var app = app || {};

app.geo = (function () {
    console.log("hello from geo");
    var el = null;
    let myPopUp = new mapboxgl.Popup();

    function initMap() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiY2pncmFuZGlkMDd2aDJ6cnQydHZ6ZXV4YSJ9.rgxCsa4n54D2nNH13dNs1A';

        el.geo = new mapboxgl.Map({
            center: [-125.0, 54.8],
            zoom: 4.3,
            minZoom: 3,
            maxZoom: 10,
            container: 'Geo',
            style: 'mapbox://styles/mapbox/light-v9'
        });

    }


    /***
     We use an async function in the callback
     to get our json files
     */
    function addSources() {
        // load in bec-layer source
        el.geo.on('load', function () {
            // add sources
            el.geo.addSource('bec-layer', {
                "type": "vector",
                "tiles": [
                    "https://tiles.jk-lee.com/BGCv10beta_100m/{z}/{x}/{y}.pbf"
                ]
            });

            // add the layer to be worked on with the default zone style
            el.geo.addLayer(el.colors.zoneStyles)
            renderMapStyleChange(el.colors.zoneStyles.paint, 'zones')

            let highlightStyleA = {
                "id": "bec-layer-highlight-a",
                "source": "bec-layer",
                "source-layer": "BGCv10beta_100m",
                "paint": {
                    "line-width": 4,
                    "line-color": '#FE7452',
                    "line-opacity": 0.75,
                    "line-blur": 0
                },
                "type": "line",
                "filter": ["in", "MAP_LABEL", el.focalUnitA]
            }
            let highlightStyleB = {
                "id": "bec-layer-highlight-b",
                "source": "bec-layer",
                "source-layer": "BGCv10beta_100m",
                "paint": {
                    "line-width": 4,
                    "line-color": '#7BCBB4',
                    "line-opacity": 0.75,
                    "line-blur": 0
                },
                "type": "line",
                "filter": ["in", "MAP_LABEL", el.focalUnitB]
            }

            el.geo.addLayer(highlightStyleA)
            el.geo.addLayer(highlightStyleB)


            // add map click events
            el.geo.on('click', 'bec-layer', function (e) {

                // Remove existing popup on click since we need to update which
                // focal unit is binded to each click event
                myPopUp.remove();
                myPopUp = new mapboxgl.Popup();

                myPopUp
                    .setLngLat(e.lngLat)
                    .setHTML(datafill(e))
                    .addTo(el.geo);

                el.selectors.geoPopupSelectA = $("#geo-focal-button-a")
                el.selectors.geoPopupSelectB = $("#geo-focal-button-b")

                el.selectors.geoPopupSelectA.on('click', updateFocalUnitA.bind(this, e.features[0].properties.MAP_LABEL))
                el.selectors.geoPopupSelectB.on('click', updateFocalUnitB.bind(this, e.features[0].properties.MAP_LABEL))

            });

        })
    }

    let datafill = function (obj) {

        let geoPopup =
            `
      <div id="geo-popup">
        <h4>${obj.features[0].properties.MAP_LABEL}</h4>
        <small>set as</small>
        <div id="geo-popup-row">
          <div class="btn" id="geo-focal-button-a">Focal Unit A</div>
          <div class="btn" id="geo-focal-button-b">Focal Unit B</div>
        </div>
      </div>
      `;
        return geoPopup
    }

    /***
     @ updateFocalUnitA
     */
    function updateFocalUnitA(val) {
        console.log("focal a clicked!")
        el.focalUnitA = val;
        el.selectors.focalUnitA.val(el.focalUnitA).trigger("chosen:updated")
        PubSub.publish("focalUnitAChanged", {data: el.focalUnitA})
    }

    /***
     @ updateFocalUnitB
     */
    function updateFocalUnitB(val) {
        console.log("focal B clicked!")
        el.focalUnitB = val;
        el.selectors.focalUnitB.val(el.focalUnitB).trigger("chosen:updated")
        PubSub.publish("focalUnitBChanged", {data: el.focalUnitB})
    }

    /***
     @ LoadStyles
     @
     */
    async function loadStyles() {
        el.colors.zoneStyles = await $.getJSON("src/data/bec-colors/bec-zone-colors.json").fail(() => {
            console.log('no bec styles')
        });

        el.colors.unitStyles = await $.getJSON("src/data/bec-colors/bec-unit-colors.json").fail(() => {
            console.log('no bec styles')
        });
    }


    /***
     @
     @ Param: style should be el.colors.zoneStyles
     @
     */
    function changeMapZone(style, zoneLevel) {
        el.geo.setPaintProperty('bec-layer', 'fill-color', style['fill-color'])
        // publish changes
        renderMapStyleChange(style, zoneLevel)
    }


    /**
     @ make/change legend
     @
     */
    function changeLegend(msg, switched) {
        console.log('legend changed')
        let $mapLegend = $(".map-legend")
        let legendItems = '';

        // clear the dom
        $mapLegend.html('')
        // loop through
        switched.style['fill-color'].forEach((item, idx, arr) => {
            if (idx > 1 && idx < arr.length - 1 && item.startsWith("#")) {
                legendItems += `<div class="tooltip" style="width:12px;height:12px;background-color:${item}"><span class="tooltiptext">${arr[idx - 1]}</span></div>\n`
            }
        })

        $mapLegend.html(legendItems)
    }


    /**
     @ toggle aerial/light basemap
     @ TODO: issues here // https://github.com/mapbox/mapbox-gl-js/issues/2267
     @ DISABLED FOR NOW
     */
    function toggleBaseMap(msg, data) {
        let current = el.geo.getStyle().metadata["mapbox:origin"];
        if (current === "light-v9") {
            el.geo.setStyle('mapbox://styles/mapbox/satellite-streets-v10')
        } else {
            el.geo.setStyle('mapbox://styles/mapbox/light-v9')
        }
    }


    /***
     @ Bind Module events
     */
    function bindEvents() {
        el.selectors.geoZone.on('click', changeMapZone.bind(this, el.colors.zoneStyles.paint, 'zones'))
        el.selectors.geoUnit.on('click', changeMapZone.bind(this, el.colors.unitStyles.paint, 'units'))

        el.selectors.geoX.on('click', changeMapX)
        el.selectors.geoY.on('click', changeMapY)

        // @ DISABLED FOR NOW
        // el.selectors.basemap.on('click', toggleBaseMap)

    }


    function renderMapStyleChange(style, zoneLevel) {
        PubSub.publish("mapStyleChanged", {style: style, feature: zoneLevel})
    }


    /***
     @ update climate map buttons
     */
    function updateXTimescaleButton(msg, data) {
        el.selectors.geoX.find(".x-timescale-title").html(data.data)
    }

    function updateXVariableButton(msg, data) {
        el.selectors.geoX.find(".x-variable-title").html(data.data)
    }

    function updateYTimescaleButton(msg, data) {
        el.selectors.geoY.find(".y-timescale-title").html(data.data)
    }

    function updateYVariableButton(msg, data) {
        el.selectors.geoY.find(".y-variable-title").html(data.data)
    }


    /***
     @ Update map with climate variables on button click
     @ TODO: sort legend descending
     @ TODO: get min, med, max & style accordingly
     @*/
    let colorPalettes = {
        precip: ['brown', 'steelblue'],
        temp: ['steelblue', 'brown']
    }

    function selectPalette(climateVariable, colorPalettes) {
        let precipVariables = ["MAP", "MSP", "AHM", "SHM", "FFP", "PPT", "NFFD", "PAS", "Eref", "CMD", "RH"];

        if (precipVariables.includes(climateVariable)) {
            return colorPalettes.precip;
        } else {
            return colorPalettes.temp;
        }
    }

    function changeMapX() {
        let selected = Object.assign({colorsObject: ['match', ['get', 'MAP_LABEL']]}, {
            data: el.x.scatterplot.data,
            zone: el.x.scatterplot.zones,
            sel: el.x.variable
        })

        let extent = d3.extent(selected.data)

        // TODO: on variable change, call change map x or y
        let color = d3.scaleLinear()
            .domain(extent)
            .range(selectPalette(selected.sel, colorPalettes));

        selected.data.forEach((item, i, arr) => {
            selected.colorsObject.push(selected.zone[i], d3.color(color(item)).hex())
        })
        selected.colorsObject.push("#ccc")

        el.geo.setPaintProperty('bec-layer', 'fill-color', selected.colorsObject)

        let currentStyle = {"fill-color": selected.colorsObject};
        PubSub.publish("mapXButtonClicked", {style: currentStyle, feature: 'units'})
    }

    function changeMapY() {
        let selected = Object.assign({colorsObject: ['match', ['get', 'MAP_LABEL']]}, {
            data: el.y.scatterplot.data,
            zone: el.y.scatterplot.zones,
            sel: el.y.variable
        })

        let extent = d3.extent(selected.data)

        // TODO: on variable change, call change map x or y
        let color = d3.scaleLinear()
            .domain(extent)
            .range(selectPalette(selected.sel, colorPalettes));

        selected.data.forEach((item, i, arr) => {
            selected.colorsObject.push(selected.zone[i], d3.color(color(item)).hex())
        })
        selected.colorsObject.push("#ccc")

        el.geo.setPaintProperty('bec-layer', 'fill-color', selected.colorsObject)

        let currentStyle = {"fill-color": selected.colorsObject};
        PubSub.publish("mapYButtonClicked", {style: currentStyle, feature: 'units'})
    }

    /*
    @ change focal unit highlight
    @*/
    function changeFocalUnitHighlight() {
        el.geo.setFilter('bec-layer-highlight-a', ['in', 'MAP_LABEL', el.focalUnitA]);
        el.geo.setFilter('bec-layer-highlight-b', ['in', 'MAP_LABEL', el.focalUnitB]);
    }


    var init = function () {
        el = app.main.el;

        initMap();

        PubSub.subscribe("mapStyleChanged", changeLegend)
        PubSub.subscribe("xTimescaleChanged", updateXTimescaleButton)
        PubSub.subscribe("xVariableChanged", updateXVariableButton)

        PubSub.subscribe("yTimescaleChanged", updateYTimescaleButton)
        PubSub.subscribe("yVariableChanged", updateYVariableButton)

        PubSub.subscribe("mapXButtonClicked", changeLegend)
        PubSub.subscribe("mapYButtonClicked", changeLegend)

        PubSub.subscribe("focalUnitAChanged", changeFocalUnitHighlight.bind(this, 'A'))
        PubSub.subscribe("focalUnitBChanged", changeFocalUnitHighlight.bind(this, 'B'))


        // PubSub.subscribe("mapBasemapChanged", toggleBaseMap)
        loadStyles()
            .then(addSources)
            .then(function () {
                // bind events
                bindEvents()
                // changeLegend();

                changeLegend(el.colors.zoneStyles.paint);
                renderMapStyleChange.bind(el.colors.zoneStyles.paint, 'zones');
                changeFocalUnitHighlight();
                // focalUnitPopUp()

                // TODO: publish change to trigger legend on

            })
    };


    return {
        init: init
    }

})();