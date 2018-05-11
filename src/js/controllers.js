var app = app || {};

app.controllers = (function(){
	console.log("hello from controllers")
	let el = null;


	function bindEvents(){
		el.selectors.focalUnitA.on("change", updateFocalUnitA)
		el.selectors.focalUnitB.on("change", updateFocalUnitB)

		el.selectors.xTimescale.on("change", updateXTimescale)
		el.selectors.yTimescale.on("change", updateYTimescale)

		el.selectors.xVariable.on("change", updateXVariable)
		el.selectors.yVariable.on("change", updateYVariable)
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

	/*
	@ setInitialControllerState
	@ get the 
	*/
	function setInitialControllerState(){
		el.selectors.focalUnitA.val(el.focalUnitA).trigger("chosen:updated")
		el.selectors.focalUnitB.val(el.focalUnitB).trigger("chosen:updated")
		el.selectors.xTimescale.val(el.x.timescale).trigger("chosen:updated")
		el.selectors.yTimescale.val(el.y.timescale).trigger("chosen:updated")
		el.selectors.xVariable.val(el.x.variable).trigger("chosen:updated")
		el.selectors.yVariable.val(el.y.variable).trigger("chosen:updated")

	}


	var init = function() {
	  el = app.main.el;
	  console.log(el);
	  bindEvents();
	  setInitialControllerState();
	};


	return {
	  init: init
	}
})();

