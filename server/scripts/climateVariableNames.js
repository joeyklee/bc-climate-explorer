const fs = require('fs');
const path = require('path');
const dataDir = path.resolve(process.cwd() + '/data/');
let data = JSON.parse(fs.readFileSync( dataDir + '/climate-variables-master/climate-variables-list.json'))


/*write the dropdown out to file*/
fs.writeFile(dataDir + '/climate-variables-master/climate-variables-list.html', createDropdown(data), function(err, data){
	if (err) console.log(err);
	console.log("finished!")
})

/* 
@createDropdown()
@@ params: the dataset */
function createDropdown(filteredData){
	let dropdownOptionsList = [];

	filteredData.forEach( function(d){
		let dropdownOption = `<option label="${d.timeScale}" data-timescale="${d.timeScale}" data-logtransform="${d.logTransform}" value="${d.variable}">${d.variable} - ${d.description}</option>`
		dropdownOptionsList.push(dropdownOption)
	})


	let dropdown = `
		<div class="bec-selector-dropdown">
		    <select data-placeholder="Climate Variable" class="chosen-select dropdown" tabindex="2">
		      <option value=""></option>
		      ${dropdownOptionsList.join("\n")}
		    </select>
		  </div>
	`
	return dropdown;
}