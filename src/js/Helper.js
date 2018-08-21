'use strict';

export default function formatClimateName(climateVar, stateTime, seasons, months) {
    let climate_selected = null;
    let timevar;
    let specials = ["DD_0", "DD0", "DD_18", "DD18", "DD5", "DD_18"];

    if (stateTime.toLowerCase() === 'annual') {
        climate_selected = climateVar;
    } else if (seasons.filter(i => (i.season === stateTime)).length > 0) {
        timevar = seasons.filter(i => (i.season === stateTime))[0].abbv;
        climate_selected = climateVar + '_' + timevar; // for seasonal variables
    } else {
        timevar = months.filter(i => (i.month === stateTime))[0].number;

        // climateVar.startsWith("DD_0") || climateVar.startsWith("DD_18")
        if (specials.includes(climateVar) === true) {
            climate_selected = climateVar + "_" + timevar; // for jan - dec
        } else {
            climate_selected = climateVar + timevar; // for jan - dec
        }

    }

    return climate_selected.toLowerCase()
}