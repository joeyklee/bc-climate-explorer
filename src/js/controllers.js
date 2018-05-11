var app = app || {};

app.controllers = (function() {
  console.log("hello from controllers")
  let el = null;
  let formatClimateName = null;


  function bindEvents() {
    el.selectors.focalUnitA.on("change", updateFocalUnitA)
    el.selectors.focalUnitB.on("change", updateFocalUnitB)

    // timescale changes
    el.selectors.xTimescale.on("change", updateXTimescale)
    el.selectors.yTimescale.on("change", updateYTimescale)
    el.selectors.xTimescale.on("change", filterDropdownTemporally.bind(this, el.selectors.xVariable, "x"))
    el.selectors.yTimescale.on("change", filterDropdownTemporally.bind(this, el.selectors.yVariable, "y"))
    el.selectors.xTimescale.on("change", loadClimateNormalData)
    el.selectors.yTimescale.on("change", loadClimateNormalData)

    // loadTimeSeriesX
		// loadTimeSeriesY

    // x & y variable changes
    el.selectors.xVariable.on("change", updateXVariable)
    el.selectors.yVariable.on("change", updateYVariable)
    el.selectors.xVariable.on("change", loadClimateNormalData)
    el.selectors.yVariable.on("change", loadClimateNormalData)

  }

  /***
  @ updateFocalUnitA
  */
  function updateFocalUnitA() {
    el.focalUnitA = $(this).find("option:selected").val();
    PubSub.publish("focalUnitAChanged", { data: el.focalUnitA })
  }
  /***
  @ updateFocalUnitB
  */
  function updateFocalUnitB() {
    el.focalUnitB = $(this).find("option:selected").val();
    PubSub.publish("focalUnitBChanged", { data: el.focalUnitB })
  }
  /***
  @ updateXTimescale
  */
  function updateXTimescale() {
    el.x.timescale = $(this).find("option:selected").val();
    PubSub.publish("xTimescaleChanged", { data: el.x.timescale })
  }
  /***
  @ updateYTimescale
  */
  function updateYTimescale() {
    el.y.timescale = $(this).find("option:selected").val();
    PubSub.publish("yTimescaleChanged", { data: el.y.timescale })
  }
  /***
  @ updateXVariable
  */
  function updateXVariable() {
    el.x.variable = $(this).find("option:selected").val();
    PubSub.publish("xVariableChanged", { data: el.x.variable })
  }
  /***
  @ updateYVariable
  */
  function updateYVariable() {
    el.y.variable = $(this).find("option:selected").val();
    PubSub.publish("yVariableChanged", { data: el.y.variable })
  }

  /***
  @
  @*/


  /*
  @ setInitialControllerState
  @ set the values of the initial data
  */
  function setInitialControllerState() {
    el.selectors.focalUnitA.val(el.focalUnitA).trigger("chosen:updated")
    el.selectors.focalUnitB.val(el.focalUnitB).trigger("chosen:updated")
    el.selectors.xTimescale.val(el.x.timescale).trigger("chosen:updated")
    el.selectors.yTimescale.val(el.y.timescale).trigger("chosen:updated")
    el.selectors.xVariable.val(el.x.variable).trigger("chosen:updated")
    el.selectors.yVariable.val(el.y.variable).trigger("chosen:updated")

    // TODO: not a great solution, but for now fill in the geo map climate buttons
    el.selectors.geoX.find(".x-timescale-title").html(el.x.timescale)
    el.selectors.geoX.find(".x-variable-title").html(el.x.variable)
    el.selectors.geoY.find(".y-timescale-title").html(el.y.timescale)
    el.selectors.geoY.find(".y-variable-title").html(el.y.variable)

    // TODO: not a great solution but for now adjust varaibles here
    filterDropdownTemporally(el.selectors.xVariable)
    filterDropdownTemporally(el.selectors.yVariable)
  }

  /***
  @ Get Scatterplot data
  @*/
  async function loadClimateNormalData() {

    let xSelection = formatClimateName(el.x.variable, el.x.timescale)
    let ySelection = formatClimateName(el.y.variable, el.y.timescale)

    let query = `https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, ${xSelection}, ${ySelection} FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label IS NOT NULL AND '${xSelection}' IS NOT NULL AND '${ySelection}' IS NOT NULL`
    // console.log(encodeURI(query))
    let data = await $.getJSON(encodeURI(query))


    el.x.scatterplot.data = data.rows.map(obj => { return obj[xSelection] })
    el.x.scatterplot.zones = data.rows.map(obj => { return obj.map_label })

    el.y.scatterplot.data = data.rows.map(obj => { return obj[ySelection] })
    el.y.scatterplot.zones = data.rows.map(obj => { return obj.map_label })

    PubSub.publish("scatterDataLoaded", { x: el.x.scatterplot, y: el.y.scatterplot })
  }

  /***
  @get timeseries data
  @*/
  async function loadTimeSeriesX() {
    let xSelection = formatClimateName(el.x.variable, el.x.timescale)

    try{
    	var query = encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT id2, year, ${xSelection} FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = '${el.focalUnitA}' OR id2 = '${el.focalUnitB}') AND year >= 1901 AND year <=2014`)
    	let data = await $.getJSON(query)

    	el.x.timeseries.years = data.rows.map(obj => (obj.year))
    	el.x.timeseries.a = data.rows.map(obj => { if (obj.id2 == el.focalUnitA) return obj[xSelection] })
    	el.x.timeseries.b = data.rows.map(obj => { if (obj.id2 == el.focalUnitB) return obj[xSelection] })

    	PubSub.publish("timeseriesXLoaded", el.x.timeseries)
    } catch {
    	console.log("timeseriesX: nothing loaded yet)")
    }
    
  }

  async function loadTimeSeriesY() {
    let ySelection = formatClimateName(el.y.variable, el.y.timescale)

    try{
    	var query = encodeURI(`https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT id2, year, ${ySelection} FROM bec10centroid_1901_2014msyt WHERE id2 IS NOT NULL AND (id2 = '${el.focalUnitA}' OR id2 = '${el.focalUnitB}') AND year >= 1901 AND year <=2014`)
    	let data = await $.getJSON(query)

    	el.y.timeseries.years = data.rows.map(obj => (obj.year))
    	el.y.timeseries.a = data.rows.map(obj => { if (obj.id2 == el.focalUnitA) return obj[ySelection] })
    	el.y.timeseries.b = data.rows.map(obj => { if (obj.id2 == el.focalUnitB) return obj[ySelection] })

    	PubSub.publish("timeseriesYLoaded", el.y.timeseries)

    } catch {
    	console.log("timeseriesY: nothing loaded yet)")
    }
    
    // console.log(el.y.timeseries)
  }


  /***
  @ filterDropdownTemporally
  @*/
  function filterDropdownTemporally($varSelector, sel) {
    // x
    if (sel === "x") {
      if (el.x.timescale === "Annual") {
        $varSelector.find("option[label=nonannual]").prop("disabled", true)
        $varSelector.find("option[label=annual]").prop("disabled", false)
        if ($varSelector.find("option:selected").length) {
          if ($varSelector.find("option:selected")[0].label !== 'annual') {
            el.x.variable = "MAT";
            $varSelector.val(el.x.variable).trigger("chosen:updated");

          }
        }
      } else {
        $varSelector.find("option[label=nonannual]").prop("disabled", false)
        $varSelector.find("option[label=annual]").prop("disabled", true)
        if ($varSelector.find("option:selected").length) {
          if ($varSelector.find("option:selected")[0].label !== 'nonannual') {
            el.x.variable = "Tave";
            $varSelector.val(el.x.variable).trigger("chosen:updated");
          }
        }
      }
    } else {
      // y
      if (el.y.timescale === "Annual") {
        $varSelector.find("option[label=nonannual]").prop("disabled", true)
        $varSelector.find("option[label=annual]").prop("disabled", false)
        if ($varSelector.find("option:selected").length) {
          if ($varSelector.find("option:selected")[0].label !== 'annual') {
            el.y.variable = "MAT";
            $varSelector.val(el.y.variable).trigger("chosen:updated");
          }
        }
      } else {
        $varSelector.find("option[label=nonannual]").prop("disabled", false)
        $varSelector.find("option[label=annual]").prop("disabled", true)
        if ($varSelector.find("option:selected").length) {
          if ($varSelector.find("option:selected")[0].label !== 'nonannual') {
            el.y.variable = "Tave";
            $varSelector.val(el.y.variable).trigger("chosen:updated");
          }
        }
      }
    }

    $varSelector.trigger("chosen:updated");
    PubSub.publish("temporalSelectionChanged", { x: el.x.timescale, y: el.y.timescale })
  }



  var init = function() {
    el = app.main.el;
    PubSub.subscribe("temporalSelectionChanged", loadClimateNormalData)
    PubSub.subscribe("focalUnitAChanged", loadTimeSeriesX)
    PubSub.subscribe("focalUnitAChanged", loadTimeSeriesY)
    PubSub.subscribe("focalUnitBChanged", loadTimeSeriesX)
    PubSub.subscribe("focalUnitBChanged", loadTimeSeriesY)

    PubSub.subscribe("xTimescaleChanged", loadTimeSeriesX)
    PubSub.subscribe("xVariableChanged", loadTimeSeriesX)
    
    PubSub.subscribe("yTimescaleChanged", loadTimeSeriesY)
    PubSub.subscribe("yVariableChanged", loadTimeSeriesY)


    formatClimateName = app.main.formatClimateName;
    bindEvents();
    setInitialControllerState();

    loadClimateNormalData();
    loadTimeSeriesX();
    loadTimeSeriesY();
  };


  return {
    init: init
  }
})();