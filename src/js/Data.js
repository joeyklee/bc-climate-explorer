'use strict';

export default class {

    constructor() {
        this._focalUnitA = 'SBSdw3';
        this._focalUnitB = 'BGxh2';
        this._x = {
            timescale: 'Annual',
            variable: 'MAT',
            scatterplot: {
                zones: [],
                data: []
            },
            timeseries: {
                a: [],
                a_rcp45: [],
                a_rcp85: [],
                b: [],
                b_rcp45: [],
                b_rcp85: [],
                years: [],
                years_projected: []
            }
        };
        this._y = {
            timescale: 'Annual',
            variable: 'MAP',
            scatterplot: {
                zones: [],
                data: []
            },
            timeseries: {
                a: [],
                a_rcp45: [],
                a_rcp85: [],
                b: [],
                b_rcp45: [],
                b_rcp85: [],
                years: [],
                years_projected: []
            }
        };
        this._geo = {
            basemap: {
                satellite: "satellite-streets-v10",
                light: "light-v9"
            }
        };
        this._selectors = {};
        this._colors = {};
        this._helpers = {
            months: [
                {"month": "January", "number": "01"},
                {"month": "February", "number": "02"},
                {"month": "March", "number": "03"},
                {"month": "April", "number": "04"},
                {"month": "May", "number": "05"},
                {"month": "June", "number": "06"},
                {"month": "July", "number": "07"},
                {"month": "August", "number": "08"},
                {"month": "September", "number": "09"},
                {"month": "October", "number": "10"},
                {"month": "November", "number": "11"},
                {"month": "December", "number": "12"}
            ],
            seasons: [
                {"season": "Winter", "abbv": "wt"},
                {"season": "Fall", "abbv": "at"},
                {"season": "Spring", "abbv": "sp"},
                {"season": "Summer", "abbv": "sm"}
            ],
            chartLayout: {
                plot_bgcolor: '#FFFFFF',
                paper_bgcolor: '#FFFFFF',
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
                    color: "#000000",
                },
                yaxis: {
                    showticklabels: true,
                    autotick: true,
                    showgrid: false,
                    ticks: "inside",
                    color: "#000000",
                    zerolinewidth: 1,
                    zeroline: true
                }
            }
        };

    }


    get helpers() {
        return this._helpers;
    }

    set helpers(value) {
        this._helpers = value;
    }

    get colors() {
        return this._colors;
    }

    set colors(value) {
        this._colors = value;
    }

    get selectors() {
        return this._selectors;
    }

    set selectors(value) {
        this._selectors = value;
    }

    get geo() {
        return this._geo;
    }

    set geo(value) {
        this._geo = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get focalUnitB() {
        return this._focalUnitB;
    }

    set focalUnitB(value) {
        this._focalUnitB = value;
    }

    get focalUnitA() {
        return this._focalUnitA;
    }

    set focalUnitA(value) {
        this._focalUnitA = value;
    }
};
