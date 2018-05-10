/*

colors:

- BG, bunchgrass
- BWBS: Boreal Black and White Spruce
- Coastal Douglas-fir
- Coastal Western Hemlock
- Englemann Spruce-Subalpine Fir
- Interior Cedar-Hemlock
- Interior Douglas-fir
- Mountain Hemlock
- Mountane Spruce
- Sub-boreal Pine-Spruce
- Sub-Boreal Spruce
- spruce willow birch
- undifferentiated

(very dry - decrease saturation)
x
d
m 
w
v
(very wet - increase saturation)

(hot - increase lightness)
h 
w
m
k
c
(cold - decrease lightness)
*/


const fs = require('fs');
const path = require('path');
const hexToHsl = require('hex-to-hsl');
const hslToHex = require('hsl-to-hex');
const dataDir = path.resolve(process.cwd() + '/data/');

let becUnits = ["CMAun","ESSFmc","BAFAun","MHmmp","MHwhp","MHwh1","ESSFmkp","ESSFmcp","SBSmc2","CWHws2","ESSFmv1","MHwh","CWHwh2","CMAunp","ESSFmk","CMAwh","CWHvh2","SBSmc3","ESSFmvp","BAFAunp","CWHwh1","ESSFxv1","CWHms2","MSxv","CWHds2","ESSFxvp","ESSFmw","IDFww","IDFdw","MSun","MSdc2","ESSFmwp","IMAunp","CWHdm","CWHxm2","CWHmm1","CWHmm2","CWHvm1n","CWHvm1s","CWHvm1w","CWHvm2w","CWHvm2s","CWHvm2n","MHmm1n","MHmm1s","MHmm1w","MHmm2n","MSdc3","MSdm3","ESSFxvw","ESSFxcp","IMAun","ICHmk2","IDFdk3","MSdm3w","ESSFdc3","ESSFdvp","ESSFdvw","ICHmw3","PPxh2","ESSFdv2","IDFdk1","MSxk3","ESSFxc3","ICHmw5","IDFdc","ESSFxcw","ESSFdcw","PPxh2a","ESSFdcp","ESSFmh","ESSFdc1","IDFxh2","BGxh2","MSxk2","ESSFxc2","IDFmw2","IDFxh2a","IDFxc","BGxw1","MSdc1","IDFdk2","ESSFdv1","MSmw2","ICHdw4","IDFdk1a","ESSFmw2","IDFww1","CWHms1","ICHmk1","ESSFmww","CWHds1","MSdm2","IDFmw1","IDFxh1a","ESSFdc2","MSxk1","IDFdm1","PPxh1","ESSFmw1","IDFxh1","MSmw1","PPxh1a","ESSFxc1","BGxh1","IDFdk1b","CWHxm1","MHmm2s","ESSFdkp","ESSFwcp","ICHvk1","ESSFwcw","ICHmk5","ESSFwc4","ESSFdk2","ESSFdkw","ICHmw2","ICHwk1","MSdk","ESSFwh1","ESSFdk1","ESSFwmp","ESSFwh2","ESSFwm2","ESSFwmw","MSdw","IDFdm2","ICHdw1","IDFxx2","ESSFwm1","ICHmk4","ICHdm","ESSFwm4","ESSFwm3","ESSFwh3","ICHxw","MSdm1","ICHmw4","ICHxwa","IDFdh","IDFxx1","ESSFwk2","ESSFwc3","ESSFmv2","ICHvk2","SBSmh","SBSmk1","ICHwk4","SBSvk","SBSdw3","ESSFwk1","ESSFmmp","ESSFmm1","ICHwk3","SBSmw","SBSdw2","ICHmm","SBSdh1","SBSdw1","SBPSdc","SBPSmk","SBSwk1","SBPSmc","ICHwk2","ICHvk1c","SBSmc1","ESSFwc2","ESSFmmw","ICHmk3","ICHwk1c","IDFxm","IDFdk4","ICHdw3","ESSFvcp","ICHdk","ESSFwc2w","ESSFvc","SBSmm","SBPSxc","ESSFvcw","IDFmw2b","ESSFxv2","ESSFvmp","ESSFvmw","ESSFvk","ICHmw1","ESSFmm3","ESSFvm","ESSFunp","SWBmk","SWBmks","ESSFmv4","ESSFun","BWBSdk","SBSun","ICHwc","ESSFwvp","ESSFwv","ICHvc","ESSFmv3","CWHwm","ICHmc1","SBSwk3","ICHmc1a","ICHmc2","CWHws1","SBSdk","SWBvks","SWBvk","BWBSvk","SWBuns","SWBun","MHunp","MHun","BWBSwk3","BWBSmk","BWBSwk2","BWBSmw","SBSwk2","BWBSwk1","CWHvh3","CWHvh1","CDFmm","BGxw2","BGxh3","MSdv","IDFxw","IDFdk5","IDFxk","ESSFmm2","SBSdh2","SBSmk2","SBSwk3a"]
becUnits = becUnits.sort();

let becZones = [
{zone:"BAFA",  desc:"Undifferentiated", hex:"#D9E0EB"},
{zone:"BG", desc: "Bunchgrass", hex:"#FF0000"},
{zone:"BWBS", desc:"Boreal Black and White Spruce" , hex:"#ABE8FF"},
{zone:"CDF", desc: "Coastal Douglas-fir" , hex:"#FFFF00"},
{zone:"CMA", desc: "Undifferentiated", hex:"#E3EBD9"},
{zone:"CWH", desc: "Coastal Western Hemlock", hex:"#218500"},
{zone:"ESSF", desc: "Englemann Spruce-Subalpine Fir", hex:"#9E3379"},
{zone:"ICH", desc: "Interior Cedar-Hemlock", hex:"#85A303"},
{zone:"IDF", desc: "Interior Douglas-fir", hex:"#FFCF00"},
{zone:"IMA", desc:"Undifferentiated", hex:"#E3E3E3"},
{zone:"MH", desc:"Mountain Hemlock", hex:"#A699FF"},
{zone:"MS", desc:"Mountane Spruce" , hex:"#FF47A3"},
{zone:"PP", desc:"Undifferentiated", hex:"#DE7D00"},
{zone:"SBPS",desc:"Sub-boreal Pine-Spruce" , hex:"#36DEFC"},
{zone:"SBS", desc:"Sub-Boreal Spruce", hex:"#2E8CBD"},
{zone:"SWB", desc: "Spruce-Willow-Birch", hex:"#A3D1AB" }
]


function applyColors(becUnit, becZones){
	let selected, zone, precip, temp, segmented, color;

	const precipVals = {
		x: -10,
		d: -5,
		m: 0,
		w: 5,
		v: 10,
		u: 0
	}

	const tempVals = {
		h: 10,
		w: 5,
		m: 0,
		k: -5,
		c: -10,
		v: -15,
		h: 0,
		n: 0
	}

	becZones.forEach( obj => {
		if(becUnit.startsWith(obj.zone) === true ){
			selected = Object.assign({}, obj);
		} 
	})

	zone = selected.zone;
	segmented = becUnit.split(zone);
	precip = segmented[1][0]
	temp = segmented[1][1]

	color = hexToHsl(selected.hex);
	color[1]+= precipVals[precip]
	color[2] += tempVals[temp]
	
	return hslToHex(color[0], color[1], color[2]);

}


let becUnitColors = [];
becUnits.map(item => {
		becUnitColors.push({zone: item, hex: applyColors(item, becZones)})
})


let output = {
	zoneStyles:becZones,
	unitStyles:becUnitColors
}


fs.writeFile(dataDir+ "/bec-colors/bec-colors.js", JSON.stringify(output), function(err, data){
	if(err) console.log(err)
	console.log("done!")
})

fs.writeFile(dataDir+ "/bec-colors/bec-zone-colors.json", JSON.stringify(mapboxStyleSpec('ZONE', output.zoneStyles)), function(err, data){
	if(err) console.log(err)
	console.log("done!")
})

fs.writeFile(dataDir+ "/bec-colors/bec-unit-colors.json", JSON.stringify(mapboxStyleSpec('MAP_LABEL', output.unitStyles)), function(err, data){
	if(err) console.log(err)
	console.log("done!")
})


function mapboxStyleSpec(matchFilter, colorData){
	// 'ZONE' 
	// 'MAP_LABEL'

	let fillArray = ['match', ['get', matchFilter]];
	colorData.forEach( item => {
		fillArray.push(item.zone)
		fillArray.push(item.hex)
	})
  fillArray.push('#ccc')

	let style = {
          "id": "bec-layer",
          "source": "bec-layer",
          "source-layer": "BGCv10beta_100m",
          "paint": {
            "fill-color": fillArray,
            "fill-opacity": 1,
          },
          "type": "fill"
        }

  return style
}



// Bec Unit Colors
// console.log(`mymap.setPaintProperty('bec-layer', 'fill-color', [
//                       'match', ['get', 'MAP_LABEL'],`)
// becUnitColors.forEach(item => {
// 	console.log(`'${item.zone}','${item.hex}',`)
// })
// console.log(`'#ccc'])`)