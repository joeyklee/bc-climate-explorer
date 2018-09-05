'use strict';

import Scatterplot from './Scatterplot';

export default class {
    constructor(data) {
        console.log("---Geo");
        this._data = data;
        this.myPopUp = new mapboxgl.Popup();
        this.colorPalettes = {
            precip: ['brown', 'steelblue'],
            temp: ['steelblue', 'brown']
        };

        // TODO map variables in this._geo won't be initialized
        this.initMap();

        PubSub.subscribe("mapStyleChanged", this.changeLegend.bind(this));
        PubSub.subscribe("xTimescaleChanged", this.updateXTimescaleButton.bind(this));
        PubSub.subscribe("xVariableChanged", this.updateXVariableButton.bind(this));
        PubSub.subscribe("yTimescaleChanged", this.updateYTimescaleButton.bind(this));
        PubSub.subscribe("yVariableChanged", this.updateYVariableButton.bind(this));

        PubSub.subscribe("mapXButtonClicked", this.changeLegend.bind(this));
        PubSub.subscribe("mapYButtonClicked", this.changeLegend.bind(this));

        PubSub.subscribe("focalUnitAChanged", this.changeFocalUnitHighlight.bind(this, 'A'));
        PubSub.subscribe("focalUnitBChanged", this.changeFocalUnitHighlight.bind(this, 'B'));

        this.loadStyles();
        this.initScatterplot();
    }

    initScatterplot() {
        new Scatterplot(this._data);
    }

    initMap() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiY2pncmFuZGlkMDd2aDJ6cnQydHZ6ZXV4YSJ9.rgxCsa4n54D2nNH13dNs1A';

        this._data._geo = new mapboxgl.Map({
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
    addSources() {
        // load in bec-layer source
        this._data._geo.on('load', () => {
            // add sources
            this._data._geo.addSource('bec-layer', {
                "type": "vector",
                "tiles": [
                    "https://tiles.jk-lee.com/BGCv10beta_100m/{z}/{x}/{y}.pbf"
                ]
            });

            // add the layer to be worked on with the default zone style
            this._data._geo.addLayer(this._data._colors.zoneStyles);
            this.renderMapStyleChange(this._data._colors.zoneStyles.paint, 'zones');

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
                "filter": ["in", "MAP_LABEL", this._data._focalUnitA]
            };

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
                "filter": ["in", "MAP_LABEL", this._data._focalUnitB]
            };

            this._data._geo.addLayer(highlightStyleA);
            this._data._geo.addLayer(highlightStyleB);


            // add map click events
            this._data._geo.on('click', 'bec-layer', (e) => {

                // Remove existing popup on click since we need to update which
                // focal unit is binded to each click event
                this.myPopUp.remove();
                this.myPopUp = new mapboxgl.Popup();

                this.myPopUp
                    .setLngLat(e.lngLat)
                    .setHTML(this.datafill(e))
                    .addTo(this._data._geo);

                this._data._selectors.geoPopupSelectA = $("#geo-focal-button-a");
                this._data._selectors.geoPopupSelectB = $("#geo-focal-button-b");

                this._data._selectors.geoPopupSelectA.on('click', this.updateFocalUnitA.bind(this, e.features[0].properties.MAP_LABEL));
                this._data._selectors.geoPopupSelectB.on('click', this.updateFocalUnitB.bind(this, e.features[0].properties.MAP_LABEL));

            });

        })
    }

    datafill(obj) {
        return `
      <div id="geo-popup">
        <h4>${obj.features[0].properties.MAP_LABEL}</h4>
        <small>set as</small>
        <div id="geo-popup-row">
          <div class="btn" id="geo-focal-button-a">Focal Unit A</div>
          <div class="btn" id="geo-focal-button-b">Focal Unit B</div>
        </div>
      </div>
      `;
    }

    /***
     @ updateFocalUnitA
     */
    updateFocalUnitA(val) {
        console.log("focal a clicked!");
        this._data._focalUnitA = val;
        this._data._selectors.focalUnitA.val(this._data._focalUnitA).trigger("chosen:updated");
        PubSub.publish("focalUnitAChanged", {data: this._data._focalUnitA});
    }

    /***
     @ updateFocalUnitB
     */
    updateFocalUnitB(val) {
        console.log("focal B clicked!");
        this._data._focalUnitB = val;
        this._data._selectors.focalUnitB.val(this._data._focalUnitB).trigger("chosen:updated");
        PubSub.publish("focalUnitBChanged", {data: this._data._focalUnitB});
    }

    /***
     @ LoadStyles
     @
     */
    loadStyles() {
        $.when(
            $.getJSON("data/bec-colors/bec-zone-colors.json"),
            $.getJSON("data/bec-colors/bec-unit-colors.json")
        ).then((zoneStyles, unitStyles) => {
            this._data._colors.zoneStyles = zoneStyles;
            this._data._colors.unitStyles = unitStyles;
            this.addSources();
            this.bindEvents();
            this.changeLegend(this._data._colors.zoneStyles.paint);
            this.renderMapStyleChange.bind(this._data._colors.zoneStyles.paint, 'zones');
            this.changeFocalUnitHighlight();
        }, error => {
            console.error(error + ": no bec styles");
        });
    }

    /***
     @
     @ Param: style should be el.colors.zoneStyles
     @
     */
    changeMapZone(style, zoneLevel) {
        this._data._geo.setPaintProperty('bec-layer', 'fill-color', style['fill-color']);
        // publish changes
        this.renderMapStyleChange(style, zoneLevel)
    }

    /**
     @ make/change legend
     @
     */
    changeLegend(msg, switched) {
        console.log('legend changed');
        let $mapLegend = $(".map-legend");
        let legendItems = '';

        // clear the dom
        $mapLegend.html('');

        // loop through
        switched.style['fill-color'].forEach((item, idx, arr) => {
            if (idx > 1 && idx < arr.length - 1 && item.startsWith("#")) {
                legendItems += `<div class="tooltip" style="width:12px;height:12px;background-color:${item}"><span class="tooltiptext">${arr[idx - 1]}</span></div>\n`
            }
        });

        $mapLegend.html(legendItems);
    }

    /**
     @ toggle aerial/light basemap
     @ TODO: issues here // https://github.com/mapbox/mapbox-gl-js/issues/2267
     @ DISABLED FOR NOW
     */
    /*toggleBaseMap(msg, data) {
        let current = this._data._geo.getStyle().metadata["mapbox:origin"];
        if (current === "light-v9") {
            this._data._geo.setStyle('mapbox://styles/mapbox/satellite-streets-v10')
        } else {
            this._data._geo.setStyle('mapbox://styles/mapbox/light-v9')
        }
    }*/

    /***
     @ Bind Module events
     */
    bindEvents() {
        this._data._selectors.geoZone.on('click', this.changeMapZone.bind(this, this._data._colors.zoneStyles.paint, 'zones'));
        this._data._selectors.geoUnit.on('click', this.changeMapZone.bind(this, this._data._colors.unitStyles.paint, 'units'));

        this._data._selectors.geoX.on('click', this.changeMapX.bind(this));
        this._data._selectors.geoY.on('click', this.changeMapY.bind(this));

        // @ DISABLED FOR NOW
        // el.selectors.basemap.on('click', toggleBaseMap)

    }

    renderMapStyleChange(style, zoneLevel) {
        PubSub.publish("mapStyleChanged", {style: style, feature: zoneLevel});
    }

    /***
     @ update climate map buttons
     */
    updateXTimescaleButton(msg, data) {
        this._data._selectors.geoX.find(".x-timescale-title").html(data.data)
    }

    updateXVariableButton(msg, data) {
        this._data._selectors.geoX.find(".x-variable-title").html(data.data)
    }

    updateYTimescaleButton(msg, data) {
        this._data._selectors.geoY.find(".y-timescale-title").html(data.data)
    }

    updateYVariableButton(msg, data) {
        this._data._selectors.geoY.find(".y-variable-title").html(data.data)
    }

    /***
     @ Update map with climate variables on button click
     @ TODO: sort legend descending
     @ TODO: get min, med, max & style accordingly
     @*/

    selectPalette(climateVariable/*, colorPalettes*/) {
        let precipVariables = ["MAP", "MSP", "AHM", "SHM", "FFP", "PPT", "NFFD", "PAS", "Eref", "CMD", "RH"];

        if (precipVariables.includes(climateVariable)) {
            return this.colorPalettes.precip;
        } else {
            return this.colorPalettes.temp;
        }
    }

    changeMapX() {
        let selected = Object.assign({colorsObject: ['match', ['get', 'MAP_LABEL']]}, {
            data: this._data._x.scatterplot.data,
            zone: this._data._x.scatterplot.zones,
            sel: this._data._x.variable
        });

        let extent = d3.extent(selected.data);

        // TODO: on variable change, call change map x or y
        let color = d3.scaleLinear()
            .domain(extent)
            .range(this.selectPalette(selected.sel, this.colorPalettes));

        selected.data.forEach((item, i) => {
            selected.colorsObject.push(selected.zone[i], d3.color(color(item)).hex())
        });
        selected.colorsObject.push("#ccc");

        this._data._geo.setPaintProperty('bec-layer', 'fill-color', selected.colorsObject);

        let currentStyle = {"fill-color": selected.colorsObject};
        PubSub.publish("mapXButtonClicked", {style: currentStyle, feature: 'units'});
    }

    changeMapY() {
        let selected = Object.assign({colorsObject: ['match', ['get', 'MAP_LABEL']]}, {
            data: this._data._y.scatterplot.data,
            zone: this._data._y.scatterplot.zones,
            sel: this._data._y.variable
        });

        let extent = d3.extent(selected.data);

        // TODO: on variable change, call change map x or y
        let color = d3.scaleLinear()
            .domain(extent)
            .range(this.selectPalette(selected.sel, this.colorPalettes));

        selected.data.forEach((item, i) => {
            selected.colorsObject.push(selected.zone[i], d3.color(color(item)).hex())
        });
        selected.colorsObject.push("#ccc");

        this._data._geo.setPaintProperty('bec-layer', 'fill-color', selected.colorsObject);

        let currentStyle = {"fill-color": selected.colorsObject};
        PubSub.publish("mapYButtonClicked", {style: currentStyle, feature: 'units'});
    }

    /*
    @ change focal unit highlight
    @*/
    changeFocalUnitHighlight() {
        this._data._geo.setFilter('bec-layer-highlight-a', ['in', 'MAP_LABEL', this._data._focalUnitA]);
        this._data._geo.setFilter('bec-layer-highlight-b', ['in', 'MAP_LABEL', this._data._focalUnitB]);
    }
}