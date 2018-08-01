'use strict';

export default class {

    constructor(data) {
        this._data = data;
    }

    /***
     * @ Load Climate Variables
     * @ Loads the climate normal variables from a json and appends them to the page
     **/
    loadClimateVariables() {
        return $.getJSON("data/climate-variables-master/climate-variables-list.json", (data) => {
            let dropdownMenu = this.createClimateVariablesDropdown(data);

            $("#X-Variable-Dropdown").append(dropdownMenu);
            $("#Y-Variable-Dropdown").append(dropdownMenu);
        }).fail(() => {
            console.log("no climate-variables-list found")
        });

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


    /***
     * @ Load timescales
     * @ Loads the timescale units from a json and appends them to the page
     * @ */
    loadTimescales() {
        this.testtest("bla");
        return $.getJSON("data/timescale-list/timescale-list.json", function(data) {
            let dropdownMenu = this.createTimescaleDropdown(data);

            $("#X-Time-Dropdown").append(dropdownMenu);
            $("#Y-Time-Dropdown").append(dropdownMenu);
        }).fail(() => {
            console.log("no timescale-list found");
        });
    }

    testtest(bla) {
        console.log(bla);
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


    /***
     * @ Load Focal Units
     * @ Loads the focal units from a json and appends them to the page
     */
     loadFocalUnits() {
        return $.getJSON("data/bec-names-list/BGCunits_Ver10_2017.json", (data) => {
            let dropdownMenu = this.createFocalUnitDropdown(data);

            $("#Focal-Unit-A-Selector").append(dropdownMenu);
            $("#Focal-Unit-B-Selector").append(dropdownMenu);
        }).fail(() => {
            console.log("no focal units found")
        });
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
     * @ Get all the selectors
     * @ #Controller, #Charts
     * @
     */
    loadSelectors() {
        let ControllerSelectors, ChartSelectors;
        // Get DOM elements
        ControllerSelectors = $("#Controller")
        ChartSelectors = $("#Charts")

        // focal unit selectors
        this._data.selectors.focalUnitA = ControllerSelectors.find("#Focal-Unit-A-Selector select")
        this._data.selectors.focalUnitB = ControllerSelectors.find("#Focal-Unit-B-Selector select")
        // time component selectors
        this._data.selectors.xTimescale = ControllerSelectors.find("#X-Time-Dropdown select")
        this._data.selectors.yTimescale = ControllerSelectors.find("#Y-Time-Dropdown select")
        // variable selectors
        this._data.selectors.xVariable = ControllerSelectors.find("#X-Variable-Dropdown select")
        this._data.selectors.yVariable = ControllerSelectors.find("#Y-Variable-Dropdown select")

        // geo controllers
        this._data.selectors.geoZone = ChartSelectors.find("#Geo-Zone-Button")
        this._data.selectors.geoUnit = ChartSelectors.find("#Geo-Unit-Button")
        this._data.selectors.geoX = ChartSelectors.find("#Geo-X-Button")
        this._data.selectors.geoY = ChartSelectors.find("#Geo-Y-Button")
        this._data.selectors.basemap = ChartSelectors.find(".map-basemap-switcher")
        this._data.selectors.geoMenu = ChartSelectors.find("#Geo-Menu")

        // geopopup
        // this._data.selectors.geoPopup = $("#geo-popup")
        this._data.selectors.geoPopupSelectA = null;
        this._data.selectors.geoPopupSelectB = null;

        // return a promise in order to use chaining
        return new Promise((resolve, reject) => {
            resolve(true)
        })

    }

    initChosen() {
        $(".chosen-select").chosen();
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }

    toggleAbout() {
        $("#About-button, #About-close").click(function () {
            console.log("about clicked!")
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
        // Load up all the components
        return this.loadTimescales()
            //TODO in here no class functions can be called
            // because the scope of the promise will be taken
            .then(this.loadClimateVariables)
            .then(this.loadFocalUnits)
            .then(this.loadSelectors)
            .then(this.initChosen)
    };

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    // TODO: Return a promise
    // to make sure everything
    // is loaded, then continue
    // runnning everything else
    // return {
    //     init: init
    // }
}