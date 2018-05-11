var app = app || {};

app.setup = (function() {
  console.log("hello from setup")
  var el = null;

  /***
  * @ Load Climate Variables
  * @ Loads the climate normal variables from a json and appends them to the page
  **/
  async function loadClimateVariables() {
    try{
      let data = await $.getJSON("data/climate-variables-master/climate-variables-list.json")
      let dropdownMenu = createClimateVariablesDropdown(data);

      $("#X-Variable-Dropdown").append(dropdownMenu);
      $("#Y-Variable-Dropdown").append(dropdownMenu);
    } catch {
      console.log("no climate-variables-list found")
    }
    
  }

  function createClimateVariablesDropdown(json) {
    let dropdownOptionsList = [];

    json.forEach(function(d) {
      let dropdownOption = `<option label="${d.timeScale}" data-timescale="${d.timeScale}" data-logtransform="${d.logTransform}" value="${d.variable}">${d.variable} - ${d.description}</option>`
      dropdownOptionsList.push(dropdownOption)
    })


    let dropdown = `
                <select data-placeholder="Climate Variable" class="chosen-select dropdown" tabindex="2">
                  <option value=""></option>
                  ${dropdownOptionsList.join("\n")}
                </select>
        `
    return dropdown;
  }



  /***
  * @ Load timescales
  * @ Loads the timescale units from a json and appends them to the page
  * @ */
  async function loadTimescales() {
    try{
      let data = await $.getJSON("data/timescale-list/timescale-list.json")
      let dropdownMenu = createTimescaleDropdown(data);
      
      $("#X-Time-Dropdown").append(dropdownMenu);
      $("#Y-Time-Dropdown").append(dropdownMenu);
    } catch {
      console.log("no timescale-list found")
    }
    
  }

  function createTimescaleDropdown(json) {
    let dropdownOptionsList = [];

    json.forEach(function(d) {
      let dropdownOption = `<option value="${d.timeUnit}" data-timescale="${d.timeScale}">${d.timeUnit}</option>`
      dropdownOptionsList.push(dropdownOption)
    })


    let dropdown = `
                <select data-placeholder="Time" class="chosen-select dropdown" tabindex="2">
                  <option value=""></option>
                  ${dropdownOptionsList.join("\n")}
                </select>
        `
    return dropdown;
  }


  /***
  * @ Load Focal Units
  * @ Loads the focal units from a json and appends them to the page
  */
  async function loadFocalUnits() {
    
    try{
      let data = await $.getJSON("data/bec-names-list/BGCunits_Ver10_2017.json")
      let dropdownMenu = createFocalUnitDropdown(data);
      $("#Focal-Unit-A-Selector").append(dropdownMenu);
      $("#Focal-Unit-B-Selector").append(dropdownMenu);
    } catch{
      console.log("no focal units found")
    }
    
  }

  function createFocalUnitDropdown(json) {
    let dropdownOptionsList = [];

    json.forEach(function(d) {
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
  function loadSelectors(){
    let ControllerSelectors, ChartSelectors;
    // Get DOM elements
    ControllerSelectors = $("#Controller")
    ChartSelectors = $("#Charts")

    // focal unit selectors
    el.selectors.focalUnitA = ControllerSelectors.find("#Focal-Unit-A-Selector select")
    el.selectors.focalUnitB = ControllerSelectors.find("#Focal-Unit-B-Selector select")
    // time component selectors
    el.selectors.xTimescale = ControllerSelectors.find("#X-Time-Dropdown select")
    el.selectors.yTimescale = ControllerSelectors.find("#Y-Time-Dropdown select")
    // variable selectors
    el.selectors.xVariable = ControllerSelectors.find("#X-Variable-Dropdown select")
    el.selectors.yVariable = ControllerSelectors.find("#Y-Variable-Dropdown select")

    // geo controllers
    el.selectors.geoZone = ChartSelectors.find("#Geo-Zone-Button")
    el.selectors.geoUnit = ChartSelectors.find("#Geo-Unit-Button")
    el.selectors.geoX = ChartSelectors.find("#Geo-X-Button")
    el.selectors.geoY = ChartSelectors.find("#Geo-Y-Button")
    el.selectors.basemap = ChartSelectors.find(".map-basemap-switcher")
    el.selectors.geoMenu = ChartSelectors.find("#Geo-Menu")

    // return a promise in order to use chaining
    return new Promise( (resolve, reject) => {
      resolve(true)
    })

  }

  function initChosen(){
    $(".chosen-select").chosen()
    return new Promise( (resolve, reject) => {
      resolve(true)
    })
  }


  var init = function() {
    el = app.main.el;
    // Load up all the components
    return loadTimescales()
      .then(loadClimateVariables)
        .then(loadFocalUnits)
        .then(loadSelectors)
        .then(initChosen)
  };

  // TODO: Return a promise
  // to make sure everything
  // is loaded, then continue
  // runnning everything else
  return {
    init: init
  }



})();