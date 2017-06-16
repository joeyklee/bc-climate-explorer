## Table of contents
- [What's a module in bc-climate-explorer](#whats-a-module-in-bc-climate-explorer)
    - [All modules in the GUI](#all-modules-in-the-gui)
    - [All modules in the project](#all-modules-in-the-project)
    - [Example](#example)
- [Roadmap to create a new module (example)](#roadmap-to-create-a-new-module-example)

# What's a module in the bc-climate-explorer
Every box in the picture below is a different module. Each of them is a separate folder (see second picture). All module folders are in the [src/modules](../../src/modules) folder of the project.

### All modules in the GUI
![wireframe image](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-module/images/modules.png)

### All modules in the project
![filesystem image](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-module/images/modules_directories.png)

Every module for the bc-climate-explorer should at least contain the following files:

- [1 controller JavaScript file](../create-new-controller) (Click for an example of a controller file)
- 1 model JavaScript file (Click for an example of a model file)
- 1 HTML file (Click for an example of a HTML file)
- 1 CSS file

The names of these files should contain the module name.

### Example
In the picture below you see the file names for the location module. 

![example_folder_file_names](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-module/images/example_folder_file_names.png)


# Roadmap to create a new module (example)
Say you want to create a new module called "**awesome**". To do so, just let the steps below guide you through the process.
1. Create a new folder with a fitting name for the module in the project's [src/modules](../../src/modules) folder. For the example we call it "awesome"

![roadmap_1_new_folder.png](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-module/images/roadmap_1_new_folder.png)

2. Create the files mentioned above with the following naming convention:
    - `awesomeController.js`
    - `awesomeModel.js`
    - `awesome.html`
    - `awesome.css`
    
![roadmap_2_new_files.png](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-module/images/roadmap_2_new_files.png)

3. The last step is to add the module in the [src/index.js](../../src/index.js) file. The content of the file looks a bit like the one below. Just add the new `awesomeController` and the execution for the `init()` function to it. (See code between the comments with "awesome example")

```javascript
'use strict';

var interactiveMapController = require('./modules/maps/interactiveMapController');
var locationsController = require('./modules/panels/locations/locationsController');
var scatterplotController = require('./modules/charts/scatterplot/scatterplotController');
var timeseriesLeftController = require('./modules/charts/timeseries-left/timeseriesLeftController');
var timeseriesRightController = require('./modules/charts/timeseries-right/timeseriesRightController');
//------------awesome example start------------
var awesomeController = require('./modules/awesome/awesomeController');
//------------awesome example end------------

window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

locationsController.init();
interactiveMapController.init();
scatterplotController.init();
timeseriesLeftController.init();
timeseriesRightController.init();
//------------awesome example start------------
awesomeController.init();
//------------awesome example end------------
```