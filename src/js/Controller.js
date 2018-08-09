'use strict';

import 'pubsub-js';
import * as helper from './Helper';

export default class {
    constructor(data) {
        console.log('Controller');
        this._data = data;
        this._formatClimateName = helper.formatClimateName;

        PubSub.subscribe("temporalSelectionChanged", this.loadClimateNormalData);

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
    }

    bindEvents() {
        this._data._selectors.focalUnitA.on("change", updateFocalUnitA);
        this._data._selectors.focalUnitB.on("change", updateFocalUnitB);

        // timescale changes
        this._data._selectors.xTimescale.on("change", updateXTimescale);
        this._data._selectors.yTimescale.on("change", updateYTimescale);
        this._data._selectors.xTimescale.on("change", filterDropdownTemporally.bind(this, this._data._selectors.xVariable, "x"));
        this._data._selectors.yTimescale.on("change", filterDropdownTemporally.bind(this, this._data._selectors.yVariable, "y"));
        this._data._selectors.xTimescale.on("change", loadClimateNormalData);
        this._data._selectors.yTimescale.on("change", loadClimateNormalData);

        // x & y variable changes
        this._data._selectors.xVariable.on("change", updateXVariable);
        this._data._selectors.yVariable.on("change", updateYVariable);
        this._data._selectors.xVariable.on("change", loadClimateNormalData);
        this._data._selectors.yVariable.on("change", loadClimateNormalData);
        this._data._selectors.xVariable.on("change", loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp45_2011_2100msyt', 'rcp45'));
        this._data._selectors.xVariable.on("change", loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp85_2011_2100msyt', 'rcp85'));
        this._data._selectors.yVariable.on("change", loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp45_2011_2100msyt', 'rcp45'));
        this._data._selectors.yVariable.on("change", loadClimateProjections.bind(this, 'bec10centroid_ensemblemean_rcp85_2011_2100msyt', 'rcp85'));


        // geo menu clicked
        this._data._selectors.geoMenu.on("click", toggleGeoMenu);

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
        this._data._selectors.focalUnitB.val(this._data.focalUnitB).trigger("chosen:updated");
        this._data._selectors.focalUnitA.val(this._data.focalUnitA).trigger("chosen:updated");
        this._data._selectors.xTimescale.val(this._data.x.timescale).trigger("chosen:updated");
        this._data._selectors.yTimescale.val(this._data.y.timescale).trigger("chosen:updated");
        this._data._selectors.xVariable.val(this._data.x.variable).trigger("chosen:updated");
        this._data._selectors.yVariable.val(this._data.y.variable).trigger("chosen:updated");

        // TODO: not a great solution, but for now fill in the geo map climate buttons
        this._data._selectors.geoX.find(".x-timescale-title").html(this._data.x.timescale);
        this._data._selectors.geoX.find(".x-variable-title").html(this._data.x.variable);
        this._data._selectors.geoY.find(".y-timescale-title").html(this._data.y.timescale);
        this._data._selectors.geoY.find(".y-variable-title").html(this._data.y.variable);

        // TODO: not a great solution but for now adjust variables here
        this.filterDropdownTemporally(this._data._selectors.xVariable);
        this.filterDropdownTemporally(this._data._selectors.yVariable);
    };

    /***
     @ filterDropdownTemporally
     @*/
    filterDropdownTemporally($varSelector, sel) {
        // x
        if (sel === "x") {
            if (this._data.x.timescale === "Annual") {
                $varSelector.find("option[label=nonannual]").prop("disabled", true);
                $varSelector.find("option[label=annual]").prop("disabled", false);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'annual') {
                        this._data.x.variable = "MAT";
                        $varSelector.val(this._data.x.variable).trigger("chosen:updated");

                    }
                }
            } else {
                $varSelector.find("option[label=nonannual]").prop("disabled", false);
                $varSelector.find("option[label=annual]").prop("disabled", true);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'nonannual') {
                        this._data.x.variable = "Tave";
                        $varSelector.val(this._data.x.variable).trigger("chosen:updated");
                    }
                }
            }
        } else {
            // y
            if (this._data.y.timescale === "Annual") {
                $varSelector.find("option[label=nonannual]").prop("disabled", true);
                $varSelector.find("option[label=annual]").prop("disabled", false);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'annual') {
                        this._data.y.variable = "MAT";
                        $varSelector.val(this._data.y.variable).trigger("chosen:updated");
                    }
                }
            } else {
                $varSelector.find("option[label=nonannual]").prop("disabled", false);
                $varSelector.find("option[label=annual]").prop("disabled", true);
                if ($varSelector.find("option:selected").length) {
                    if ($varSelector.find("option:selected")[0].label !== 'nonannual') {
                        this._data.y.variable = "Tave";
                        $varSelector.val(this._data.y.variable).trigger("chosen:updated");
                    }
                }
            }
        }

        $varSelector.trigger("chosen:updated");
        PubSub.publish("temporalSelectionChanged", {x: this._data.x.timescale, y: this._data.y.timescale})
    }

    /***
     @ load timeSeries
     @*/
    loadTimeSeries(selected) {
        let selection = this._formatClimateName(this._data[selected].variable, this._data[selected].timescale)
        let query = encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT id2, year, ${selection} FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = '${this._data.focalUnitA}' OR id2 = '${this._data.focalUnitB}') AND year >= 1901 AND year <=2014`);
        let data = $.getJSON(query, () => {
            let dataA, dataB;
            dataA = data.rows.filter(obj => {
                return obj.id2 === this._data.focalUnitA
            });
            dataB = data.rows.filter(obj => {
                return obj.id2 === this._data.focalUnitB
            });

            this._data[selected].timeseries.years = [...new Set(data.rows.map(item => item.year))];
            this._data[selected].timeseries.a = dataA.map(obj => {
                if (obj.id2 == this._data.focalUnitA) return obj[selection]
            });
            this._data[selected].timeseries.b = dataB.map(obj => {
                if (obj.id2 == this._data.focalUnitB) return obj[selection]
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
        let xSelection = this._formatClimateName(this._data.x.variable, this._data.x.timescale);
        let ySelection = this._formatClimateName(this._data.y.variable, this._data.y.timescale);
        let query = encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT id2, year, ${xSelection}, ${ySelection} FROM ${dataSrc} WHERE id2 IS NOT NULL AND (id2='${this._data.focalUnitA}' OR id2='${this._data.focalUnitB}') AND (year > 2010 AND year <=2100)`)

        let data = $.getJSON(query, () => {
            // console.log(data);
            let dataA, dataB;
            dataA = data.rows.filter(obj => {
                return obj.id2 === this._data.focalUnitA
            });
            dataB = data.rows.filter(obj => {
                return obj.id2 === this._data.focalUnitB
            });
            // years
            this._data.x.timeseries.years_projected = dataA.map(obj => (obj.year));
            this._data.y.timeseries.years_projected = dataB.map(obj => (obj.year));
            // fill projected arrays
            this._data.x.timeseries[`a_${rcpArr}`] = dataA.map(obj => (obj[xSelection]));
            this._data.x.timeseries[`b_${rcpArr}`] = dataB.map(obj => (obj[xSelection]));
            this._data.y.timeseries[`a_${rcpArr}`] = dataA.map(obj => (obj[ySelection]));
            this._data.y.timeseries[`b_${rcpArr}`] = dataB.map(obj => (obj[ySelection]));

            PubSub.publish("projectedDataLoaded", {x: this._data.x.timeseries, y: this._data.y.timeseries})
        }).fail(() => {
            console.log("climate Projections data not loaded yet")
        });
    };

    /***
     @ Get Scatterplot data
     @*/
    loadClimateNormalData() {
        let xSelection = this._formatClimateName(this._data.x.variable, this._data.x.timescale);
        let ySelection = this._formatClimateName(this._data.y.variable, this._data.y.timescale);

        let query = `https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, ${xSelection}, ${ySelection} FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label IS NOT NULL AND '${xSelection}' IS NOT NULL AND '${ySelection}' IS NOT NULL`
        // console.log(encodeURI(query))

        let data = $.getJSON(encodeURI(query), () => {
            this._data.x.scatterplot.data = data.rows.map(obj => {
                return obj[xSelection]
            });
            this._data.x.scatterplot.zones = data.rows.map(obj => {
                return obj.map_label
            });

            this._data.y.scatterplot.data = data.rows.map(obj => {
                return obj[ySelection]
            });
            this._data.y.scatterplot.zones = data.rows.map(obj => {
                return obj.map_label
            });

            PubSub.publish("scatterDataLoaded", {x: this._data.x.scatterplot, y: this._data.y.scatterplot});
        }).fail(() => {
            console.log("no cliamte data loaded")
        });
    }
}