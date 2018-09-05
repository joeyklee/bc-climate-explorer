'use strict';

import formatClimateName from './Helper';
import Geo from './Geo';

export default class {
    constructor(data) {
        console.log('---Controller');
        this._data = data;

        PubSub.subscribe("temporalSelectionChanged", this.loadClimateNormalData.bind(this));

        //TODO: get projections with var changes
        let subscriptionMessages = [
            'focalUnitAChanged',
            'focalUnitBChanged',
            'xTimescaleChanged',
            'xVariableChanged',
            'yTimescaleChanged',
            'yVariableChanged'
        ];

        subscriptionMessages.forEach(msg => {
            PubSub.subscribe(msg, this.loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp45_2011_2100msyt', 'rcp45'));
            PubSub.subscribe(msg, this.loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp85_2011_2100msyt', 'rcp85'));
            PubSub.subscribe(msg, this.loadTimeSeries.bind(this, 'x'));
            PubSub.subscribe(msg, this.loadTimeSeries.bind(this, 'y'));
        });

        this.bindEvents();
        this.setInitialControllerState();

        this.loadClimateNormalData();
        this.loadClimateProjections('bec10centroid_ensemblemean_rcp45_2011_2100msyt', 'rcp45');
        this.loadClimateProjections('bec10centroid_ensemblemean_rcp85_2011_2100msyt', 'rcp85');
        this.loadTimeSeries('x');
        this.loadTimeSeries('y');

        this.initGeo();
    }

    initGeo() {
        new Geo(this._data);
    }

    bindEvents() {
        this._data._selectors.focalUnitA.on("change", this.updateFocalUnitA);
        this._data._selectors.focalUnitB.on("change", this.updateFocalUnitB);

        // timescale changes
        this._data._selectors.xTimescale.on("change", this.updateXTimescale);
        this._data._selectors.yTimescale.on("change", this.updateYTimescale);
        this._data._selectors.xTimescale.on("change", this.filterDropdownTemporally.bind(this, this._data._selectors.xVariable, "x"));
        this._data._selectors.yTimescale.on("change", this.filterDropdownTemporally.bind(this, this._data._selectors.yVariable, "y"));
        // this._data._selectors.xTimescale.on("change", this.loadClimateNormalData);
        // this._data._selectors.yTimescale.on("change", this.loadClimateNormalData);

        // x & y variable changes
        this._data._selectors.xVariable.on("change", this.updateXVariable);
        this._data._selectors.yVariable.on("change", this.updateYVariable);
        // this._data._selectors.xVariable.on("change", this.loadClimateNormalData);
        // this._data._selectors.yVariable.on("change", this.loadClimateNormalData);
        this._data._selectors.xVariable.on("change", this.loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp85_2011_2100msyt', 'rcp85'));
        this._data._selectors.xVariable.on("change", this.loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp45_2011_2100msyt', 'rcp45'));
        this._data._selectors.yVariable.on("change", this.loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp45_2011_2100msyt', 'rcp45'));
        this._data._selectors.yVariable.on("change", this.loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp85_2011_2100msyt', 'rcp85'));


        // geo menu clicked
        this._data._selectors.geoMenu.on("click", this.toggleGeoMenu);

        // hamburger
        // $('.icon').click(function(){
        //   console.log("clicked")
        //   $('.controller-container').toggleClass("responsive");
        // })

    };

    /*
    @ setInitialControllerState
    @ set the values of the initial data
    */
    setInitialControllerState() {
        this._data._selectors.focalUnitB.val(this._data._focalUnitB).trigger("chosen:updated");
        this._data._selectors.focalUnitA.val(this._data._focalUnitA).trigger("chosen:updated");
        this._data._selectors.xTimescale.val(this._data._x.timescale).trigger("chosen:updated");
        this._data._selectors.yTimescale.val(this._data._y.timescale).trigger("chosen:updated");
        this._data._selectors.xVariable.val(this._data._x.variable).trigger("chosen:updated");
        this._data._selectors.yVariable.val(this._data._y.variable).trigger("chosen:updated");

        // TODO: not a great solution, but for now fill in the geo map climate buttons
        this._data._selectors.geoX.find(".x-timescale-title").html(this._data._x.timescale);
        this._data._selectors.geoX.find(".x-variable-title").html(this._data._x.variable);
        this._data._selectors.geoY.find(".y-timescale-title").html(this._data._y.timescale);
        this._data._selectors.geoY.find(".y-variable-title").html(this._data._y.variable);

        // TODO: not a great solution but for now adjust variables here
        this.filterDropdownTemporally(this._data._selectors.xVariable);
        this.filterDropdownTemporally(this._data._selectors.yVariable);
    };

    /***
     @ Toggle Geo Menu
     @*/
    toggleGeoMenu() {
        this._data._selectors.geoMenu.toggleClass("active");
    }

    /***
     @ updateFocalUnitA
     */
    updateFocalUnitA() {
        this._data._focalUnitA = $(this).find("option:selected").val();
        PubSub.publish("focalUnitAChanged", {data: this._data._focalUnitA})
    }

    /***
     @ updateFocalUnitB
     */
    updateFocalUnitB() {
        this._data._focalUnitB = $(this).find("option:selected").val();
        PubSub.publish("focalUnitBChanged", {data: this._data._focalUnitB})
    }

    /***
     @ updateXTimescale
     */
    updateXTimescale() {
        this._data._x.timescale = $(this).find("option:selected").val();
        PubSub.publish("xTimescaleChanged", {data: this._data._x.timescale})
    }

    /***
     @ updateYTimescale
     */
    updateYTimescale() {
        this._data._y.timescale = $(this).find("option:selected").val();
        PubSub.publish("yTimescaleChanged", {data: this._data._y.timescale})
    }

    /***
     @ updateXVariable
     */
    updateXVariable() {
        this._data._x.variable = $(this).find("option:selected").val();
        PubSub.publish("xVariableChanged", {data: this._data._x.variable})
    }

    /***
     @ updateYVariable
     */
    updateYVariable() {
        this._data._y.variable = $(this).find("option:selected").val();
        PubSub.publish("yVariableChanged", {data: this._data._y.variable})
    }

    /***
     @ filterDropdownTemporally
     @*/
    filterDropdownTemporally($varSelector, sel) {
        // x
        if (sel === "x") {
            if (this._data._x.timescale === "Annual") {
                $varSelector.find("option[label=nonannual]").prop("disabled", true);
                $varSelector.find("option[label=annual]").prop("disabled", false);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'annual') {
                        this._data._x.variable = "MAT";
                        $varSelector.val(this._data._x.variable).trigger("chosen:updated");

                    }
                }
            } else {
                $varSelector.find("option[label=nonannual]").prop("disabled", false);
                $varSelector.find("option[label=annual]").prop("disabled", true);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'nonannual') {
                        this._data._x.variable = "Tave";
                        $varSelector.val(this._data._x.variable).trigger("chosen:updated");
                    }
                }
            }
        } else {
            // y
            if (this._data._y.timescale === "Annual") {
                $varSelector.find("option[label=nonannual]").prop("disabled", true);
                $varSelector.find("option[label=annual]").prop("disabled", false);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'annual') {
                        this._data._y.variable = "MAT";
                        $varSelector.val(this._data._y.variable).trigger("chosen:updated");
                    }
                }
            } else {
                $varSelector.find("option[label=nonannual]").prop("disabled", false);
                $varSelector.find("option[label=annual]").prop("disabled", true);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'nonannual') {
                        this._data._y.variable = "Tave";
                        $varSelector.val(this._data._y.variable).trigger("chosen:updated");
                    }
                }
            }
        }

        $varSelector.trigger("chosen:updated");
        PubSub.publish("temporalSelectionChanged", {x: this._data._x.timescale, y: this._data._y.timescale})
    }

    /***
     @ load timeSeries
     @*/
    loadTimeSeries(selected) {
        let selection = formatClimateName(this._data[selected].variable, this._data[selected].timescale);
        let query = encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT id2, year, ${selection} FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = '${this._data._focalUnitA}' OR id2 = '${this._data._focalUnitB}') AND year >= 1901 AND year <=2014`);
        $.getJSON(query, (data) => {
            let dataA, dataB;
            dataA = data.rows.filter(obj => {
                return obj.id2 === this._data._focalUnitA
            });
            dataB = data.rows.filter(obj => {
                return obj.id2 === this._data._focalUnitB
            });

            this._data[selected].timeseries.years = [...new Set(data.rows.map(item => item.year))];
            this._data[selected].timeseries.a = dataA.map(obj => {
                if (obj.id2 === this._data._focalUnitA) return obj[selection]
            });
            this._data[selected].timeseries.b = dataB.map(obj => {
                if (obj.id2 === this._data._focalUnitB) return obj[selection]
            });

            PubSub.publish(`timeseries${selected.toUpperCase()}Loaded`, this._data[selected].timeseries)
        }).fail(() => {
            console.log("timeseriesY: nothing loaded yet)");
        });
    }

    /*
    @ Load Projections Data
    @ var query_45 = "SELECT DISTINCT id2, year," + this._data.xSelector + ", + " + this._data.ySelector + " FROM " + 'bec10centroid_ensemblemean_rcp45_2011_2100msyt' + " WHERE id2 IS NOT NULL AND (id2 = '" + this._data.focal_name + "' OR id2 = '" + this._data.comparison_name + "') AND (year > " + 2070 + " AND year <=2100)";
    @ var query_85 = "SELECT DISTINCT id2, year," + this._data.xSelector + ", + " + this._data.ySelector + " FROM " + 'bec10centroid_ensemblemean_rcp85_2011_2100msyt' + " WHERE id2 IS NOT NULL AND (id2 = '" + this._data.focal_name + "' OR id2 = '" + this._data.comparison_name + "') AND (year > " + 2070 + " AND year <=2100)";
    @ */

    loadClimateProjections(dataSrc, rcpArr) {
        let xSelection = formatClimateName(this._data._x.variable, this._data._x.timescale);
        let ySelection = formatClimateName(this._data._y.variable, this._data._y.timescale);
        let query = encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT id2, year, ${xSelection}, ${ySelection} FROM ${dataSrc} WHERE id2 IS NOT NULL AND (id2='${this._data.focalUnitA}' OR id2='${this._data.focalUnitB}') AND (year > 2010 AND year <=2100)`);

        $.getJSON(query, (data) => {
            // console.log(data);
            let dataA, dataB;
            dataA = data.rows.filter(obj => {
                return obj.id2 === this._data._focalUnitA
            });
            dataB = data.rows.filter(obj => {
                return obj.id2 === this._data._focalUnitB
            });
            // years
            this._data._x.timeseries.years_projected = dataA.map(obj => (obj.year));
            this._data._y.timeseries.years_projected = dataB.map(obj => (obj.year));
            // fill projected arrays
            this._data._x.timeseries[`a_${rcpArr}`] = dataA.map(obj => (obj[xSelection]));
            this._data._x.timeseries[`b_${rcpArr}`] = dataB.map(obj => (obj[xSelection]));
            this._data._y.timeseries[`a_${rcpArr}`] = dataA.map(obj => (obj[ySelection]));
            this._data._y.timeseries[`b_${rcpArr}`] = dataB.map(obj => (obj[ySelection]));

            PubSub.publish("projectedDataLoaded", {x: this._data._x.timeseries, y: this._data._y.timeseries})
        }).fail(() => {
            console.log("climate Projections data not loaded yet")
        });
    };

    /***
     @ Get Scatterplot data
     @*/
    loadClimateNormalData() {
        let xSelection = formatClimateName(this._data._x.variable, this._data._x.timescale);
        let ySelection = formatClimateName(this._data._y.variable, this._data._y.timescale);

        let query = `https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, ${xSelection}, ${ySelection} FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label IS NOT NULL AND '${xSelection}' IS NOT NULL AND '${ySelection}' IS NOT NULL`;

        // console.log(encodeURI(query))
        $.getJSON(encodeURI(query), (data) => {
            this._data._x.scatterplot.data = data.rows.map(obj => {
                return obj[xSelection]
            });
            this._data._x.scatterplot.zones = data.rows.map(obj => {
                return obj.map_label
            });

            this._data._y.scatterplot.data = data.rows.map(obj => {
                return obj[ySelection]
            });
            this._data._y.scatterplot.zones = data.rows.map(obj => {
                return obj.map_label
            });

            PubSub.publish("scatterDataLoaded", {x: this._data._x.scatterplot, y: this._data._y.scatterplot});
        }).fail(() => {
            console.log("no cliamte data loaded")
        });
    }
}