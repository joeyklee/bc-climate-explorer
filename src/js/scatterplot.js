var app = app || {};

app.scatterplot = (function(){
	console.log("hello from scatterplot")
	let el = null;



	// function buildChart(){
	// 	let gd3, gd;

	// 	d3.select("#scatter-child").remove();
    
 //    gd3 = d3.select('#Scatterplot').append('div')
 //      .attr('id', 'scatter-child')
 //      .style("width", "100%")
 //      .style("height", "100%")

 //    gd = gd3.node();

	// }

	var init = function() {
	  el = app.main.el;
	  
	};


	return {
	  init: init
	}
})();



// // TODO: Add map highlight on hover
// const Scatterplot1 = (function() {

//   const init = function() {
//     buildChart();
//   };

//   var buildChart = function() {
//     d3.select("#scatter-child").remove();
//     let gd3 = d3.select('#scatterplot-1').append('div')
//       .attr('id', 'scatter-child')
//       .style("width", "100%")
//       .style("height", "100%")

//     let gd = gd3.node();

//     // "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
//     // "SELECT DISTINCT map_label, " + el.xSelector + ", + " + el.ySelector + " FROM  " + el.dataset_selected + " WHERE map_label IS NOT NULL AND " + el.xSelector + " IS NOT NULL AND " + el.ySelector + " IS NOT NULL";
//     let xSelection = formatReqVariable(appState.xVar, appState.xTime)
//     let ySelection = formatReqVariable(appState.yVar, appState.yTime)
//     var query = `https://becexplorer.cartodb.com/api/v2/sql?q=SELECT DISTINCT map_label, ${xSelection}, ${ySelection} FROM bgcv10beta_200m_wgs84_merge_normal_1981_2010msy WHERE map_label IS NOT NULL AND '${xSelection}' IS NOT NULL AND '${ySelection}' IS NOT NULL`
//     $.getJSON(encodeURI(query))
//       .done(data => {

//         let maplabel = data.rows.map(obj => { return obj.map_label})
//         console.log(maplabel)
//         appState.xDataScatterPlot = data.rows.map(obj => { return obj[xSelection] })
//         appState.xDataScatterPlotZones = data.rows.map(obj => { return obj.map_label })
        
//         appState.yDataScatterPlot = data.rows.map(obj => { return obj[ySelection] })
//         appState.yDataScatterPlotZones = data.rows.map(obj => { return obj.map_label })

//         let series1 = {
//           x: appState.xDataScatterPlot,
//           y: appState.yDataScatterPlot,
//           label: maplabel,
//           type: 'scatter',
//           mode: 'markers'
//         }

//         Plotly.plot(gd, [series1], chartLayout, { displayModeBar: true });

//         d3.select(window).on('resize.scatterplot1', function() {
//           Plotly.Plots.resize(gd)
//         });

//         gd.on('plotly_click', function(selectedPoint){
//             // alert('You clicked this Plotly chart!');
            
//             let idx = selectedPoint.points[0].pointIndex
//             let selectedLabel = selectedPoint.points[0].data.label[idx]
//             let features = mymap.querySourceFeatures('bec-layer', { 
//               sourceLayer: 'BGCv10beta_100m', 
//               filter: ["in", "MAP_LABEL", selectedLabel] });

//             let centroid = getCentroid(features).geometry.coordinates

//               mymap.flyTo({
//                      center: centroid,
//                      zoom: 6
//                  });

//               // TODO: persist filtering on click
//               // create array of last 2 clicked items
//               // for now, just open popup
//               // mymap.setFilter('bec-layer-clicked', ['in', 'MAP_LABEL', selectedLabel]);
//               console.log(centroid)
//                mymap.fire('click', {lngLat: [centroid[0], centroid[1] - 0.3] } );
//         });


//         function getCentroid(featureArray){
//           let jsons = [];
//           featureArray.forEach(feat => {
//             jsons.push(feat.toJSON())
//           })

//           let collection = turf.featureCollection(jsons);
//           return turf.centerOfMass(collection)

//         }


//         /*hover items*/
//         gd.on('plotly_hover', function(selectedPoint){
//             // alert('You clicked this Plotly chart!');
            
//             let idx = selectedPoint.points[0].pointIndex
//             let selectedLabel = selectedPoint.points[0].data.label[idx]

//             console.log(selectedLabel)
//             mymap.setFilter('bec-layer', ['in', 'MAP_LABEL', selectedLabel]);
            
//         });

//         gd.on('plotly_unhover', function(){
//           mymap.setFilter('bec-layer', ['!in', 'MAP_LABEL', '']);
//         })

//       }) // end get request


//   }
//   return {
//     init: init
//   }
// })();