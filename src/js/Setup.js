'use strict';

import Controller from "./Controller";
import 'chosen-js';

export default class {

    constructor(data) {
        console.log('Setup');
        this._data = data;
    }

    createClimateVariablesDropdown(json) {
        let dropdownOptionsList = [];

        json.forEach(function (d) {
            let dropdownOption = `<option label="${d.timeScale}" data-timescale="${d.timeScale}" data-logtransform="${d.logTransform}" value="${d.variable}">${d.variable} - ${d.description}</option>`
            dropdownOptionsList.push(dropdownOption)
        });


        let dropdown =
            `<select data-placeholder="Climate Variable" class="chosen-select dropdown" tabindex="2">
                  <option value=""></option>
                  ${dropdownOptionsList.join("\n")}
                </select>`;

        return dropdown;
    }

    createTimescaleDropdown(json) {
        let dropdownOptionsList = [];

        json.forEach(function (d) {
            let dropdownOption = `<option value="${d.timeUnit}" data-timescale="${d.timeScale}">${d.timeUnit}</option>`
            dropdownOptionsList.push(dropdownOption)
        });


        let dropdown = `
                <select data-placeholder="Time" class="chosen-select dropdown" tabindex="2">
                  <option value=""></option>
                  ${dropdownOptionsList.join("\n")}
                </select>
        `;

        $("#X-Time-Dropdown").append(dropdown);
        $("#Y-Time-Dropdown").append(dropdown);
    }


    createFocalUnitDropdown(json) {
        let dropdownOptionsList = [];

        json.forEach(function (d) {
            let dropdownOption = `<option value="${d.BGC_NoSpace}">${d.BGC_NoSpace} - ${d.SubzVarPh_Description}</option>`
            dropdownOptionsList.push(dropdownOption)
        })

        let dropdown = `
                <select data-placeholder="BEC Zone" class="chosen-select dropdown" tabindex="2">
                  <option value=""></option>
                  ${dropdownOptionsList.join("\n")}
                </select>
        `
        return dropdown;
    }


    /**
     * @ Get all the _selectors
     * @ #Controller, #Charts
     * @
     */
    loadSelectors() {
        let ControllerSelectors, ChartSelectors;
        // Get DOM elements
        ControllerSelectors = $("#Controller");
        ChartSelectors = $("#Charts");

        // focal unit _selectors
        this._data._selectors.focalUnitA = ControllerSelectors.find("#Focal-Unit-A-Selector select")
        this._data._selectors.focalUnitB = ControllerSelectors.find("#Focal-Unit-B-Selector select")
        // time component _selectors
        this._data._selectors.xTimescale = ControllerSelectors.find("#X-Time-Dropdown select")
        this._data._selectors.yTimescale = ControllerSelectors.find("#Y-Time-Dropdown select")
        // variable _selectors
        this._data._selectors.xVariable = ControllerSelectors.find("#X-Variable-Dropdown select")
        this._data._selectors.yVariable = ControllerSelectors.find("#Y-Variable-Dropdown select")

        // geo controllers
        this._data._selectors.geoZone = ChartSelectors.find("#Geo-Zone-Button")
        this._data._selectors.geoUnit = ChartSelectors.find("#Geo-Unit-Button")
        this._data._selectors.geoX = ChartSelectors.find("#Geo-X-Button")
        this._data._selectors.geoY = ChartSelectors.find("#Geo-Y-Button")
        this._data._selectors.basemap = ChartSelectors.find(".map-basemap-switcher")
        this._data._selectors.geoMenu = ChartSelectors.find("#Geo-Menu")

        // geopopup
        // this._data._selectors.geoPopup = $("#geo-popup")
        this._data._selectors.geoPopupSelectA = null;
        this._data._selectors.geoPopupSelectB = null;

        // return a promise in order to use chaining
        return new Promise((resolve, reject) => {
            resolve(true)
        })

    }

    loadData() {
        $.when(
            $.getJSON("data/timescale-list/timescale-list.json"),
            $.getJSON("data/climate-variables-master/climate-variables-list.json"),
            $.getJSON("data/bec-names-list/BGCunits_Ver10_2017.json")
        ).then((timescaleList, climateVariablesList, bgUnits) => {
            this.createTimescaleDropdown(timescaleList[0]);
            this.createClimateVariablesDropdown(climateVariablesList[0]);
            this.createFocalUnitDropdown(bgUnits[0]);
            this.loadSelectors();
            this.initChosen();
            this.initController();
        }, error => {
            console.error(error);
        });
    }

    initController() {
        new Controller(this._data);
    }

    initChosen() {
        $(".chosen-select").chosen();
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }

    toggleAbout() {
        $("#About-button, #About-close").click(function () {
            console.log("about clicked!");
            $("#About").toggleClass("active")
        })
    };

    toggleHelp() {
        $("#Help-button").click(function () {
            $("#Help").toggleClass("active")
        })
    };

    init() {
        this.toggleAbout();
        this.toggleHelp();
        this.loadData();
    };

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
}