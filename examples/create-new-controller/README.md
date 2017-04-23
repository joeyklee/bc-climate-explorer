## Table of contents
- [What's a controller in bc-climate-explorer](#whats-a-controller-in-bc-climate-explorer)
- [Roadmap to create a new controller (example)](#roadmap-to-create-a-new-controller-example)
# What's a controller in bc-climate-explorer
The controller connects the model (data) with the view. In this project it practically means the data that the controller gets from the model will be loaded into the html file. [HandlebarsJS](http://handlebarsjs.com/) is the framework that we use for that purpose.

# Roadmap to create a new controller (example)
Say you want to create a new controller called "**awesome**". To do so, just let the steps below guide you through the process.

1. Create a file called "`<name-of-module>Controller.js`" in the appropriate module folder. The name of the controller should always start with the name of the module. Lets say we want to create one in the `awesome` module, so the file name has to be `awesomeController.js`. To do that we assume you already have created a module in the [src/modules](../../src/modules) folder. If you want to know how to do that look at the [create-new-module](../create-new-module) example.

Here an example of how a module should look like with the created `awesomeController.js` mentioned above.

![example_folder_file_names](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-controller/images/example_folder_file_names.png)

2. Now use the following skeleton for the your new controller. (Below it's suited for the `awesomeController.js`).

```javascript
'use strict';

var errorMessages = require('../../../errorMessages');
var moduleBase = require('../../../moduleBase');

module.exports = moduleBase.create({
  init: function() {
    this.htmlIndexId = 'panel-awesome-index';
    this.htmlModuleId = 'panel-awesome-module';
    this.htmlModulePath = './awesome.html';

    var locationsController = this;
    this.loadViews(this.htmlIndexId, this.htmlModuleId, this.htmlModulePath)
      .then(function(success) {
        locationsController.$indexInteractiveDiv = success;
        locationsController.bindEvents();
      })
      .catch(function(errorMsg) {
        console.error(errorMsg);
      });
  },

  bindEvents: function() {
    
  }
});
```

Let us go through the skeleton code step by step. TODO step by step explanation