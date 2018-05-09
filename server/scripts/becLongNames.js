const fs = require('fs');
const dataDir = path.resolve(process.cwd() + '/data/');
const becNames= ["BAFAun","BAFAunp","BGxh1","BGxh2","BGxh3","BGxw1","BGxw2","BWBSdk","BWBSmk","BWBSmw","BWBSvk","BWBSwk1","BWBSwk2","BWBSwk3","CDFmm","CMAun","CMAunp","CMAwh","CWHdm","CWHds1","CWHds2","CWHmm1","CWHmm2","CWHms1","CWHms2","CWHvh1","CWHvh2","CWHvh3","CWHvm1n","CWHvm1s","CWHvm1w","CWHvm2n","CWHvm2s","CWHvm2w","CWHwh1","CWHwh2","CWHwm","CWHws1","CWHws2","CWHxm1","CWHxm2","ESSFdc1","ESSFdc2","ESSFdc3","ESSFdcp","ESSFdcw","ESSFdk1","ESSFdk2","ESSFdkp","ESSFdkw","ESSFdv1","ESSFdv2","ESSFdvp","ESSFdvw","ESSFmc","ESSFmcp","ESSFmh","ESSFmk","ESSFmkp","ESSFmm1","ESSFmm2","ESSFmm3","ESSFmmp","ESSFmmw","ESSFmv1","ESSFmv2","ESSFmv3","ESSFmv4","ESSFmvp","ESSFmw","ESSFmw1","ESSFmw2","ESSFmwp","ESSFmww","ESSFun","ESSFunp","ESSFvc","ESSFvcp","ESSFvcw","ESSFvk","ESSFvm","ESSFvmp","ESSFvmw","ESSFwc2","ESSFwc2w","ESSFwc3","ESSFwc4","ESSFwcp","ESSFwcw","ESSFwh1","ESSFwh2","ESSFwh3","ESSFwk1","ESSFwk2","ESSFwm1","ESSFwm2","ESSFwm3","ESSFwm4","ESSFwmp","ESSFwmw","ESSFwv","ESSFwvp","ESSFxc1","ESSFxc2","ESSFxc3","ESSFxcp","ESSFxcw","ESSFxv1","ESSFxv2","ESSFxvp","ESSFxvw","ICHdk","ICHdm","ICHdw1","ICHdw3","ICHdw4","ICHmc1","ICHmc1a","ICHmc2","ICHmk1","ICHmk2","ICHmk3","ICHmk4","ICHmk5","ICHmm","ICHmw1","ICHmw2","ICHmw3","ICHmw4","ICHmw5","ICHvc","ICHvk1","ICHvk1c","ICHvk2","ICHwc","ICHwk1","ICHwk1c","ICHwk2","ICHwk3","ICHwk4","ICHxw","ICHxwa","IDFdc","IDFdh","IDFdk1","IDFdk1a","IDFdk1b","IDFdk2","IDFdk3","IDFdk4","IDFdk5","IDFdm1","IDFdm2","IDFdw","IDFmw1","IDFmw2","IDFmw2b","IDFww","IDFww1","IDFxc","IDFxh1","IDFxh1a","IDFxh2","IDFxh2a","IDFxk","IDFxm","IDFxw","IDFxx1","IDFxx2","IMAun","IMAunp","MHmm1n","MHmm1s","MHmm1w","MHmm2n","MHmm2s","MHmmp","MHun","MHunp","MHwh","MHwh1","MHwhp","MSdc1","MSdc2","MSdc3","MSdk","MSdm1","MSdm2","MSdm3","MSdm3w","MSdv","MSdw","MSmw1","MSmw2","MSun","MSxk1","MSxk2","MSxk3","MSxv","PPxh1","PPxh1a","PPxh2","PPxh2a","SBPSdc","SBPSmc","SBPSmk","SBPSxc","SBSdh1","SBSdh2","SBSdk","SBSdw1","SBSdw2","SBSdw3","SBSmc1","SBSmc2","SBSmc3","SBSmh","SBSmk1","SBSmk2","SBSmm","SBSmw","SBSun","SBSvk","SBSwk1","SBSwk2","SBSwk3","SBSwk3a","SWBmk","SWBmks","SWBun","SWBuns","SWBvk","SWBvks"]
let becLatest = JSON.parse(fs.readFileSync(dataDir + '/bec-names-list/BGCunits_Ver10_2017.json'))

let becFiltered = becLatest.filter( name => ( becNames.includes(name.BGC_NoSpace) ) )

/* Write the file out*/
fs.writeFile(dataDir + '/bec-names-list/becNames-dropdown.html', createDropdown(becFiltered), function(err, data){
	if (err) console.log(err);
	console.log("finished!")
})


/*@ createDropdown
@@params: filteredData */
function createDropdown(filteredData){
	let dropdownOptionsList = [];

	filteredData.forEach( function(d){
		let dropdownOption = `<option value="${d.BGC_NoSpace}">${d.BGC_NoSpace} - ${d.SubzVarPh_Description}</option>`
		dropdownOptionsList.push(dropdownOption)
	})


	let dropdown = `
		<div class="bec-selector-dropdown">
		    <select data-placeholder="BEC Zone" class="chosen-select dropdown" tabindex="2">
		      <option value=""></option>
		      ${dropdownOptionsList.join("\n")}
		    </select>
		  </div>
	`

	return dropdown;
}

