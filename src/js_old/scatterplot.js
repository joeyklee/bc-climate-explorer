var app = app || {};

app.scatterplot = (function(){
	console.log("hello from scatterplot")
	let el = null;

	const WIDTH_IN_PERCENT_OF_PARENT = 100,
	  HEIGHT_IN_PERCENT_OF_PARENT = 100;

	function buildChart(){
		let gd3, gd, series1, projectedA, projectedB;

		d3.select("#scatter-child").remove();
    
    gd3 = d3.select('#Scatterplot').append('div')
      .attr('id', 'scatter-child')
      .style("width", "100%")
      .style("height", "100%")

    gd = gd3.node();

    series1 = {
      x: el.x.scatterplot.data,
      y: el.y.scatterplot.data,
      label: el.x.scatterplot.zones,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: '#F1BD53',
        size: 4,
        line: {
            color: '#f7ab13',
            width: 1
        }
      },
      name:""
    }

    projectedA45 = {
      x: rollingAverage(el.x.timeseries.a_rcp45),
      y: rollingAverage(el.y.timeseries.a_rcp45),
      type: 'scatter',
      mode: 'markers+lines',
      marker: {
        color:'#FE7452',
        size:6,
        line:{
          color:"#ffffff",
          width:0.5
        }
      },
      line:{
        width:1
      },
      name:"RCP4.5"
    }

    projectedA85 = {
      x: rollingAverage(el.x.timeseries.a_rcp85),
      y: rollingAverage(el.y.timeseries.a_rcp85),
      type: 'scatter',
      mode: 'markers+lines',
      marker: {
        color:'#FE7452',
        size:6,
        line:{
          color:"#ffffff",
          width:0.5
        }
      },
      line:{
        width:2
      },
      name:"RCP8.5"
    }

    projectedB45 = {
      x: rollingAverage(el.x.timeseries.b_rcp45),
      y: rollingAverage(el.y.timeseries.b_rcp45),
      type: 'scatter',
      mode: 'markers+lines',
      marker: {
        color:'#7BCBB4',
        size:6,
        line:{
          color:"#ffffff",
          width:0.5
        }
      },
      line:{
        width:1
      },
      name:"RCP4.5"
    }
    projectedB85 = {
      x: rollingAverage(el.x.timeseries.b_rcp85),
      y: rollingAverage(el.y.timeseries.b_rcp85),
      type: 'scatter',
      mode: 'markers+lines',
      marker: {
        color:'#7BCBB4',
        size:6,
        line:{
          color:"#ffffff",
          width:0.5
        }
      },
      line:{
        width:2
      },
      name:"RCP8.5"
    }


    // get a copy of the default chart layout
    let scatterplotLayout = Object.assign({}, el.helpers.chartLayout)
    // add in your axis titles
    scatterplotLayout.xaxis.title = `${el.x.variable}`
		scatterplotLayout.yaxis.title = `${el.y.variable}`

    Plotly.plot(gd, [series1, projectedA45,projectedA85, projectedB45,projectedB85], scatterplotLayout, { displayModeBar: true });

    d3.select(window).on('resize.scatterplot1', function() {
      Plotly.Plots.resize(gd)
    });

    // click events - light up map:
    gd.on('plotly_click', function(selectedPoint){
        // alert('You clicked this Plotly chart!');
        
        let idx = selectedPoint.points[0].pointIndex
        let selectedLabel = selectedPoint.points[0].data.label[idx]
        let features = el.geo.querySourceFeatures('bec-layer', { 
          sourceLayer: 'BGCv10beta_100m', 
          filter: ["in", "MAP_LABEL", selectedLabel] });

        let centroid = getCentroid(features).geometry.coordinates

          el.geo.flyTo({
                 center: centroid,
                 zoom: 6
             });

          // TODO: persist filtering on click
          // create array of last 2 clicked items
          // for now, just open popup
          // mymap.setFilter('bec-layer-clicked', ['in', 'MAP_LABEL', selectedLabel]);
          // console.log(centroid)
           el.geo.fire('click', {lngLat: [centroid[0], centroid[1] - 0.3] } );
    });

	}

  function getCentroid(featureArray){
    let jsons = [];
    featureArray.forEach(feat => {
      jsons.push(feat.toJSON())
    })

    let collection = turf.featureCollection(jsons);
    return turf.centerOfMass(collection)

  }


  function rollingAverage(myArr){
    let chunkyArray = createGroupedArray(myArr, 10);

    let output = chunkyArray.map(arr => (d3.mean(arr)) );
    return output;
  }

  function createGroupedArray(arr, chunkSize) {
      var groups = [], i;
      for (i = 0; i < arr.length; i += chunkSize) {
          groups.push(arr.slice(i, i + chunkSize));
      }
      return groups;
  }



	var init = function() {
	  el = app.main.el;
	  PubSub.subscribe("scatterDataLoaded", buildChart)
	  PubSub.subscribe("temporalSelectionChanged", buildChart)
    PubSub.subscribe("focalUnitAChanged", buildChart)
    PubSub.subscribe("focalUnitBChanged", buildChart)
    PubSub.subscribe("yTimescaleChanged", buildChart)
    PubSub.subscribe("xTimescaleChanged", buildChart)
    PubSub.subscribe("projectedDataLoaded", buildChart)
	};


	return {
	  init: init
	}
})();