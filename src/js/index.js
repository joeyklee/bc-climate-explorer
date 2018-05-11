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
    	colors:{},
    	helpers:{
    		months: [
    		  { "month": "January", "number": "01" },
    		  { "month": "February", "number": "02" },
    		  { "month": "March", "number": "03" },
    		  { "month": "April", "number": "04" },
    		  { "month": "May", "number": "05" },
    		  { "month": "June", "number": "06" },
    		  { "month": "July", "number": "07" },
    		  { "month": "August", "number": "08" },
    		  { "month": "September", "number": "09" },
    		  { "month": "October", "number": "10" },
    		  { "month": "November", "number": "11" },
    		  { "month": "December", "number": "12" }
    		],
    		seasons:[
    		  { "season": "Winter", "abbv": "wt" },
    		  { "season": "Fall", "abbv": "at" },
    		  { "season": "Spring", "abbv": "sp" },
    		  { "season": "Summer", "abbv": "sm" }
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
    		      // zerolinewidth: 1,
    		      // showline: true,
    		      autotick: true,
    		    },
    		    yaxis: {
    		      showticklabels: true,
    		      autotick: true,
    		      showgrid: false,
    		      ticks: "inside",
    		      color: "#000000",
    		      zerolinewidth: 1,
    		      zeroline: true
    		      // showline: true
    		    }
    		  }
    	}
    };



    let formatClimateName = function(climateVar, stateTime) {
      let climate_selected = null;
      let timevar;

      if (stateTime.toLowerCase() == 'annual') {
        climate_selected = climateVar;
      } else if (el.helpers.seasons.filter(i => (i.season === stateTime)).length > 0) {
        timevar = el.helpers.seasons.filter(i => (i.season === stateTime))[0].abbv
        climate_selected = climateVar + '_' + timevar; // for seasonal variables
      } else {
        timevar = el.helpers.months.filter(i => (i.month === stateTime))[0].number

        if (climateVar.startsWith("dd_0" || climateVar.startsWith("dd_18"))) {
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
window.addEventListener('DOMContentLoaded', function() {
    // app.<modulename>.init();
    app.setup.init()
    	.then(function(){
    		app.controllers.init();
    		app.geo.init();	 	
    		app.scatterplot.init();		
    	});
    
    
});
