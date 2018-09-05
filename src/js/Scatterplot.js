'use strict';
import Timeseries from './Timeseries';

export default class {

    constructor(data) {
        console.log('---Scatterplot');

        this._data = data;

        PubSub.subscribe("scatterDataLoaded", this.buildChart.bind(this));
        PubSub.subscribe("temporalSelectionChanged", this.buildChart.bind(this));
        PubSub.subscribe("focalUnitAChanged", this.buildChart.bind(this));
        PubSub.subscribe("focalUnitBChanged", this.buildChart.bind(this));
        PubSub.subscribe("yTimescaleChanged", this.buildChart.bind(this));
        PubSub.subscribe("xTimescaleChanged", this.buildChart.bind(this));
        PubSub.subscribe("projectedDataLoaded", this.buildChart.bind(this));

        this.initTimeseries();
    }

    initTimeseries() {
        new Timeseries(this._data);
    }

    buildChart(){
        let gd3, gd, series1,
            projectedA45, projectedA85,
            projectedB45, projectedB85;

        d3.select("#scatter-child").remove();

        gd3 = d3.select('#Scatterplot').append('div')
            .attr('id', 'scatter-child')
            .style("width", "100%")
            .style("height", "100%");

        gd = gd3.node();

        series1 = {
            x: this._data._x.scatterplot.data,
            y: this._data._y.scatterplot.data,
            label: this._data._x.scatterplot.zones,
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: '#F1BD53',
                size: 4,
                line: {
                    color: '#f7ab13',
                    width: 1
                }
            },
            name:""
        };

        projectedA45 = {
            x: this.rollingAverage(this._data._x.timeseries.a_rcp45),
            y: this.rollingAverage(this._data._y.timeseries.a_rcp45),
            type: 'scatter',
            mode: 'markers+lines',
            marker: {
                color:'#FE7452',
                size:6,
                line:{
                    color:"#ffffff",
                    width:0.5
                }
            },
            line:{
                width:1
            },
            name:"RCP4.5"
        };

        projectedA85 = {
            x: this.rollingAverage(this._data._x.timeseries.a_rcp85),
            y: this.rollingAverage(this._data._y.timeseries.a_rcp85),
            type: 'scatter',
            mode: 'markers+lines',
            marker: {
                color:'#FE7452',
                size:6,
                line:{
                    color:"#ffffff",
                    width:0.5
                }
            },
            line:{
                width:2
            },
            name:"RCP8.5"
        };

        projectedB45 = {
            x: this.rollingAverage(this._data._x.timeseries.b_rcp45),
            y: this.rollingAverage(this._data._y.timeseries.b_rcp45),
            type: 'scatter',
            mode: 'markers+lines',
            marker: {
                color:'#7BCBB4',
                size:6,
                line:{
                    color:"#ffffff",
                    width:0.5
                }
            },
            line:{
                width:1
            },
            name:"RCP4.5"
        };

        projectedB85 = {
            x: this.rollingAverage(this._data._x.timeseries.b_rcp85),
            y: this.rollingAverage(this._data._y.timeseries.b_rcp85),
            type: 'scatter',
            mode: 'markers+lines',
            marker: {
                color:'#7BCBB4',
                size:6,
                line:{
                    color:"#ffffff",
                    width:0.5
                }
            },
            line:{
                width:2
            },
            name:"RCP8.5"
        };

        // get a copy of the default chart layout
        let scatterplotLayout = Object.assign({}, this._data._helpers.chartLayout);
        // add in your axis titles
        scatterplotLayout.xaxis.title = `${this._data._x.variable}`;
        scatterplotLayout.yaxis.title = `${this._data._y.variable}`;

        Plotly.plot(gd, [series1, projectedA45,projectedA85, projectedB45,projectedB85], scatterplotLayout, { displayModeBar: true });

        d3.select(window).on('resize.scatterplot1', function() {
            Plotly.Plots.resize(gd)
        });

        // click events - light up map:
        gd.on('plotly_click', function(selectedPoint){
            // alert('You clicked this Plotly chart!');

            let idx = selectedPoint.points[0].pointIndex;
            let selectedLabel = selectedPoint.points[0].data.label[idx];
            let features = this._data._geo.querySourceFeatures('bec-layer', {
                sourceLayer: 'BGCv10beta_100m',
                filter: ["in", "MAP_LABEL", selectedLabel] });

            let centroid = getCentroid(features).geometry.coordinates;

            this._data._geo.flyTo({
                center: centroid,
                zoom: 6
            });

            // TODO: persist filtering on click
            // create array of last 2 clicked items
            // for now, just open popup
            // mymap.setFilter('bec-layer-clicked', ['in', 'MAP_LABEL', selectedLabel]);
            // console.log(centroid)
            this._data._geo.fire('click', {lngLat: [centroid[0], centroid[1] - 0.3] } );
        });

    }

    getCentroid(featureArray){
        let jsons = [];
        featureArray.forEach(feat => {
            jsons.push(feat.toJSON())
        });

        let collection = turf.featureCollection(jsons);
        return turf.centerOfMass(collection);

    }

    rollingAverage(myArr){
        let chunkyArray = this.createGroupedArray(myArr, 10);

        return chunkyArray.map(arr => (d3.mean(arr)) );
    }

    createGroupedArray(arr, chunkSize) {
        let groups = [], i;
        for (i = 0; i < arr.length; i += chunkSize) {
            groups.push(arr.slice(i, i + chunkSize));
        }
        return groups;
    }
}