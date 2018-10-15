'use strict';
import '../stylesheets/scss/main.scss';
import Data from './Data';
import Setup from './Setup';

function main() {
    console.log('index');
    let dataHandler = new Data();

    new Setup(dataHandler);
}

main();


// Styles
// import "../stylesheets/scss/main.scss"

// Bc-climate-explorer files
// import "./setup";
// import "./controllers";
// import "./geo";
// import "./scatterplot";
// import "./timeseries";

// NPM dependencies;
// import "chosen-js";
// import "mapbox-gl";
// import "d3";

// var app = app || {};

/*app.main = (function () {
    console.log("hello from index");
    // store variables in el and expose them to other js files
    let el = {

    };


    let formatClimateName = function (climateVar, stateTime) {
        let climate_selected = null;
        let timevar;
        let specials = ["DD_0", "DD0", "DD_18", "DD18", "DD5", "DD_18"];

        if (stateTime.toLowerCase() == 'annual') {
            climate_selected = climateVar;
        } else if (el.helpers.seasons.filter(i => (i.season === stateTime)).length > 0) {
            timevar = el.helpers.seasons.filter(i => (i.season === stateTime))[0].abbv
            climate_selected = climateVar + '_' + timevar; // for seasonal variables
        } else {
            timevar = el.helpers.months.filter(i => (i.month === stateTime))[0].number

            // climateVar.startsWith("DD_0") || climateVar.startsWith("DD_18")
            if (specials.includes(climateVar) === true) {
                climate_selected = climateVar + "_" + timevar; // for jan - dec
            } else {
                climate_selected = climateVar + timevar; // for jan - dec
            }

        }

        return climate_selected.toLowerCase()
    }

    return {
        el: el,
        formatClimateName: formatClimateName
    };


})();

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function () {
    // app.<modulename>.init();
    app.setup.init()
        .then((data) => {
            console.log(data);
            app.controllers.init();
            app.geo.init();
            app.scatterplot.init();
            app.timeseries.init();
        });


});*/