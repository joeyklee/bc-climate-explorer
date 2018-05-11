var app = app || {};

app.main = (function() {
		console.log("hello from index")
    // store variables in el and expose them to other js files
    let el = {
    	focalUnitA:'SBSdw3',
    	focalUnitB:'BGxh2',
    	x:{
    		timescale:'Annual',
    		variable:'MAT',
    		scatterplot:{
    			zones:[],
    			data:[]
    		},
    		timeseries:{
    			a:[],
    			b:[]
    		}
    	},
    	y:{
    		timescale:'Annual',
    		variable:'MAP',
    		scatterplot:{
    			zones:[],
    			data:[]
    		},
    		timeseries:{
    			a:[],
    			b:[]
    		}
    	},
    	geo: {
    		basemap:{
    			satellite:"satellite-streets-v10",
    			light:"light-v9"
    		}
    	},
    	selectors:{},
    	colors:{}
    };

    return {
        el: el
    };


})();

// call app.map.init() once the DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    // app.<modulename>.init();
    app.setup.init()
    	.then(function(){
    		app.controllers.init();
    		app.geo.init();	 	
    		app.scatterplot.init();		
    	});
    
    
});