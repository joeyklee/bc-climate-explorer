const fs = require('fs')
const hexToHsl = require('hex-to-hsl');
const hslToHex = require('hsl-to-hex')



let becUnits = ["CMAun","ESSFmc","BAFAun","MHmmp","MHwhp","MHwh1","ESSFmkp","ESSFmcp","SBSmc2","CWHws2","ESSFmv1","MHwh","CWHwh2","CMAunp","ESSFmk","CMAwh","CWHvh2","SBSmc3","ESSFmvp","BAFAunp","CWHwh1","ESSFxv1","CWHms2","MSxv","CWHds2","ESSFxvp","ESSFmw","IDFww","IDFdw","MSun","MSdc2","ESSFmwp","IMAunp","CWHdm","CWHxm2","CWHmm1","CWHmm2","CWHvm1n","CWHvm1s","CWHvm1w","CWHvm2w","CWHvm2s","CWHvm2n","MHmm1n","MHmm1s","MHmm1w","MHmm2n","MSdc3","MSdm3","ESSFxvw","ESSFxcp","IMAun","ICHmk2","IDFdk3","MSdm3w","ESSFdc3","ESSFdvp","ESSFdvw","ICHmw3","PPxh2","ESSFdv2","IDFdk1","MSxk3","ESSFxc3","ICHmw5","IDFdc","ESSFxcw","ESSFdcw","PPxh2a","ESSFdcp","ESSFmh","ESSFdc1","IDFxh2","BGxh2","MSxk2","ESSFxc2","IDFmw2","IDFxh2a","IDFxc","BGxw1","MSdc1","IDFdk2","ESSFdv1","MSmw2","ICHdw4","IDFdk1a","ESSFmw2","IDFww1","CWHms1","ICHmk1","ESSFmww","CWHds1","MSdm2","IDFmw1","IDFxh1a","ESSFdc2","MSxk1","IDFdm1","PPxh1","ESSFmw1","IDFxh1","MSmw1","PPxh1a","ESSFxc1","BGxh1","IDFdk1b","CWHxm1","MHmm2s","ESSFdkp","ESSFwcp","ICHvk1","ESSFwcw","ICHmk5","ESSFwc4","ESSFdk2","ESSFdkw","ICHmw2","ICHwk1","MSdk","ESSFwh1","ESSFdk1","ESSFwmp","ESSFwh2","ESSFwm2","ESSFwmw","MSdw","IDFdm2","ICHdw1","IDFxx2","ESSFwm1","ICHmk4","ICHdm","ESSFwm4","ESSFwm3","ESSFwh3","ICHxw","MSdm1","ICHmw4","ICHxwa","IDFdh","IDFxx1","ESSFwk2","ESSFwc3","ESSFmv2","ICHvk2","SBSmh","SBSmk1","ICHwk4","SBSvk","SBSdw3","ESSFwk1","ESSFmmp","ESSFmm1","ICHwk3","SBSmw","SBSdw2","ICHmm","SBSdh1","SBSdw1","SBPSdc","SBPSmk","SBSwk1","SBPSmc","ICHwk2","ICHvk1c","SBSmc1","ESSFwc2","ESSFmmw","ICHmk3","ICHwk1c","IDFxm","IDFdk4","ICHdw3","ESSFvcp","ICHdk","ESSFwc2w","ESSFvc","SBSmm","SBPSxc","ESSFvcw","IDFmw2b","ESSFxv2","ESSFvmp","ESSFvmw","ESSFvk","ICHmw1","ESSFmm3","ESSFvm","ESSFunp","SWBmk","SWBmks","ESSFmv4","ESSFun","BWBSdk","SBSun","ICHwc","ESSFwvp","ESSFwv","ICHvc","ESSFmv3","CWHwm","ICHmc1","SBSwk3","ICHmc1a","ICHmc2","CWHws1","SBSdk","SWBvks","SWBvk","BWBSvk","SWBuns","SWBun","MHunp","MHun","BWBSwk3","BWBSmk","BWBSwk2","BWBSmw","SBSwk2","BWBSwk1","CWHvh3","CWHvh1","CDFmm","BGxw2","BGxh3","MSdv","IDFxw","IDFdk5","IDFxk","ESSFmm2","SBSdh2","SBSmk2","SBSwk3a"]

becUnits = becUnits.sort();
// console.log(becUnits)

let becZones = [
{zone:"BAFA",  desc:"Undifferentiated", hex:"#C1CCC2"},
{zone:"BG", desc: "Bunchgrass", hex:"#DBD590"},
{zone:"BWBS", desc:"Boreal Black and White Spruce" , hex:"#9FC39D"},
{zone:"CDF", desc: "Coastal Douglas-fir" , hex:"#397262"},
{zone:"CMA", desc: "Undifferentiated", hex:"#C1CCC2"},
{zone:"CWH", desc: "Coastal Western Hemlock", hex:"#97C3A2"},
{zone:"ESSF", desc: "Englemann Spruce-Subalpine Fir", hex:"#005F56"},
{zone:"ICH", desc: "Interior Cedar-Hemlock", hex:"#5E6737"},
{zone:"IDF", desc: "Interior Douglas-fir", hex:"#65562A"},
{zone:"IMA", desc:"Undifferentiated", hex:"#C1CCC2"},
{zone:"MH", desc:"Mountain Hemlock", hex:"#72C286"},
{zone:"MS", desc:"Mountane Spruce" , hex:"#7AC276"},
{zone:"PP", desc:"Undifferentiated", hex:"#C1CCC2"},
{zone:"SBPS",desc:"Sub-boreal Pine-Spruce" , hex:"#59706E"},
{zone:"SBS", desc:"Sub-Boreal Spruce", hex:"#857669"},
{zone:"SWB", desc: "Spruce-Willow-Birch", hex:"#AF8971" }
]


/*

colors:

- BG, bunchgrass, RGB 219 213 144, #DBD590
- BWBS: Boreal Black and White Spruce, RGB 159 195 157, #9FC39D
- Coastal Douglas-fir, #397262
- Coastal Western Hemlock, #97C3A2
- Englemann Spruce-Subalpine Fir, #005F56
- Interior Cedar-Hemlock, #5E6737
- Interior Douglas-fir, #65562A
- Mountain Hemlock, #72C286
- Mountane Spruce, #7AC276
- Sub-boreal Pine-Spruce, #59706E
- Sub-Boreal Spruce, #857669
- spruce willow birch, #AF8971
- undifferentiated, #C1CCC2

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
			// console.log(obj)
			console.log(becUnit, obj)	
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

// applyColors("SBSmk2", becZones)

let output = [];
becUnits.map(item => {
		output.push({unit: item, color: applyColors(item, becZones)})
})
// console.log(output)

// Bec Unit Colors

console.log(`mymap.setPaintProperty('bec-layer', 'fill-color', [
                      'match', ['get', 'MAP_LABEL'],`)
output.forEach(item => {
	console.log(`'${item.unit}','${item.color}',`)
})
console.log(`'#ccc'])`)