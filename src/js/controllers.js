var app = app || {};

app.controllers = (function(){
	console.log("hello from controllers")
	let el = null;
	let formatClimateName = null;


	function bindEvents(){
		el.selectors.focalUnitA.on("change", updateFocalUnitA)
		el.selectors.focalUnitB.on("change", updateFocalUnitB)

		el.selectors.xTimescale.on("change", updateXTimescale)
		el.selectors.yTimescale.on("change", updateYTimescale)

		el.selectors.xVariable.on("change", updateXVariable)
		el.selectors.yVariable.on("change", updateYVariable)

		el.selectors.xVariable.on("change", loadClimateNormalData)
		el.selectors.yVariable.on("change", loadClimateNormalData)

	}

	/***
	@ updateFocalUnitA
	*/
	function updateFocalUnitA(){
		el.focalUnitA = $(this).find("option:selected").val();
		PubSub.publish("focalUnitAChanged", {data: el.focalUnitA})
	}
	/***
	@ updateFocalUnitB
	*/
	function updateFocalUnitB(){
		el.focalUnitB = $(this).find("option:selected").val();
		PubSub.publish("focalUnitBChanged", {data: el.focalUnitB})
	}
	/***
	@ updateXTimescale
	*/
	function updateXTimescale(){
		el.x.timescale = $(this).find("option:selected").val();
		PubSub.publish("xTimescaleChanged", {data: el.x.timescale})
	}
	/***
	@ updateYTimescale
	*/
	function updateYTimescale(){
		el.y.timescale = $(this).find("option:selected").val();
		PubSub.publish("yTimescaleChanged", {data: el.y.timescale})
	}
	/***
	@ updateXVariable
	*/
	function updateXVariable(){
		el.x.variable = $(this).find("option:selected").val();
		PubSub.publish("xVariableChanged", {data: el.x.variable})
	}
	/***
	@ updateYVariable
	*/
	function updateYVariable(){
		el.y.variable = $(this).find("option:selected").val();
		PubSub.publish("yVariableChanged", {data: el.y.variable})
	}

	/***
	@
	@*/


	/*
	@ setInitialControllerState
	@ set the values of the initial data
	*/
	function setInitialControllerState(){
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
	}

	/***
	@ Get Scatterplot data
	@*/
	async function loadClimateNormalData(){
		let xSelection = formatClimateName(el.x.variable, el.x.timescale)
		let ySelection = formatClimateName(el.y.variable, el.y.timescale)

		let query = `https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, ${xSelection}, ${ySelection} FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label IS NOT NULL AND '${xSelection}' IS NOT NULL AND '${ySelection}' IS NOT NULL`
		let data = await $.getJSON(encodeURI(query))

		// let maplabel = data.rows.map(obj => { return obj.map_label})
		el.x.scatterplot.data = data.rows.map(obj => { return obj[xSelection] })
		el.x.scatterplot.zones = data.rows.map(obj => { return obj.map_label })
		
		el.y.scatterplot.data = data.rows.map(obj => { return obj[ySelection] })
		el.y.scatterplot.zones = data.rows.map(obj => { return obj.map_label })

		PubSub.publish("scatterDataLoaded", {x: el.x.scatterplot, y: el.y.scatterplot})
		console.log(el)
	}


	var init = function() {
	  el = app.main.el;
	  formatClimateName = app.main.formatClimateName;
	  console.log(el);
	  bindEvents();
	  setInitialControllerState();

	  loadClimateNormalData();
	};


	return {
	  init: init
	}
})();

