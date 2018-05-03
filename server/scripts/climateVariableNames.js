const fs = require('fs');

let data = JSON.parse(fs.readFileSync('/Users/joeyklee/Code/src/github/joeyklee/bc-climate-explorer/data/climate-variables-master/climate-variables-list.json'))



function createDropdown(filteredData){
	let dropdownOptionsList = [];

	filteredData.forEach( function(i){
		let k = Object.keys(i)[0];

		i[k].forEach(function(d){
			let dropdownOption = `<option label="${k}" value="${d.variable}">${d.variable} - ${d.description}</option>`
			dropdownOptionsList.push(dropdownOption)
		})
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
createDropdown(data)

let output = createDropdown(data)
console.log(output)

fs.writeFile('/Users/joeyklee/Code/src/github/joeyklee/bc-climate-explorer/data/climate-variables-master/climate-variables-list.html', output, function(err, data){
	if (err) console.log(err);

	console.log("finished!")
})