var app = app || {};

app.scatterplot = (function(){
	console.log("hello from scatterplot")
	let el = null;

	const WIDTH_IN_PERCENT_OF_PARENT = 100,
	  HEIGHT_IN_PERCENT_OF_PARENT = 100;

	function buildChart(){
		let gd3, gd, series1;

		d3.select("#scatter-child").remove();
    
    gd3 = d3.select('#Scatterplot').append('div')
      .attr('id', 'scatter-child')
      .style("width", "100%")
      .style("height", "100%")

    gd = gd3.node();

    series1 = {
      x: el.x.scatterplot.data,
      y: el.y.scatterplot.data,
      label: el.x.scatterplot.zone,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: '#F1BD53',
        size: 6,
        line: {
              color: '#f7ab13',
              width: 1
        }
      }
    }
    // get a copy of the default chart layout
    let scatterplotLayout = Object.assign({}, el.helpers.chartLayout)
    // add in your axis titles
    scatterplotLayout.xaxis.title = `${el.x.variable}`
		scatterplotLayout.yaxis.title = `${el.y.variable}`

    Plotly.plot(gd, [series1], scatterplotLayout, { displayModeBar: true });

    d3.select(window).on('resize.scatterplot1', function() {
      Plotly.Plots.resize(gd)
    });

	}

	var init = function() {
	  el = app.main.el;
	  PubSub.subscribe("scatterDataLoaded", buildChart)
	  PubSub.subscribe("temporalSelectionChanged", buildChart)
	};


	return {
	  init: init
	}
})();