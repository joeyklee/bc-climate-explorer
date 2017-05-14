## Table of contents
- [What's a controller in bc-climate-explorer](#whats-a-controller-in-bc-climate-explorer)
- [Roadmap to create a new controller (example)](#roadmap-to-create-a-new-controller-example)
    - [Step by Step explanation skeleton](#step-by-step-explanation-skeleton)
        - [Error Messages](#error-messages)
        - [Module Base](#module-base)
        - [Initialization of the ids and the path](#initialization-of-the-ids-and-the-path)
# What's a controller in bc-climate-explorer
The controller connects the model (data) with the view. In this project it practically means the data that the controller gets from the model will be loaded into the html file. [HandlebarsJS](http://handlebarsjs.com/) is the framework that we use for that purpose.

# Roadmap to create a new controller (example)
Say you want to create a new controller called "**awesomeController**". To do so, just let the steps below guide you through the process.

1. Create a file called "`<name-of-module>Controller.js`" in the appropriate module folder. The name of the controller should always start with the name of the module. Lets say we want to create one in the `awesome` module, so the file name has to be `awesomeController.js`. To do that we assume you already have created a module in the [src/modules](../../src/modules) folder. If you want to know how to do that look at the [create-new-module](../create-new-module) example.

Here an example of how a module should look like with the created `awesomeController.js` mentioned above.

![example_folder_file_names](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/create-new-controller/images/example_folder_file_names.png)

2. Now use the following skeleton for your new controller. (Below it's fitted for the `awesomeController.js`).

```javascript
1. 'use strict';
2.
3. var errorMessages = require('../../../errorMessages');
4. var moduleBase = require('../../../moduleBase');
5.
6..module.exports = moduleBase.create({
7.  init: function() {
8.    this.htmlIndexId = 'panel-awesome-index';
9.    this.htmlModuleId = 'panel-awesome-module';
10.    this.htmlModulePath = './awesome.html';
11.
12.    var locationsController = this;
13.    this.loadViews(this.htmlIndexId, this.htmlModuleId, this.htmlModulePath)
14.      .then(function(success) {
15.        locationsController.$indexInteractiveDiv = success;
16.        locationsController.bindEvents();
17.      })
18.      .catch(function(errorMsg) {
19.        console.error(errorMsg);
20.      });
21.  },
22.
23.  bindEvents: function() {
24.    
25.  }
26.});
```

Here the version without line numbers. That way the copying will be easier ;)
```javascript
'use strict';

var $ = require('jquery');
var errorMsg = require('./errorMessages');

module.exports = {
  htmlIndexId: '',
  htmlModuleId: '',
  htmlModulePath: '',

  loadViews: function(htmlIndexId, htmlModuleId, htmlModulePath) {
    return new Promise(function(resolve, reject) {
      var $indexDiv = $('#' + htmlIndexId);
      if($indexDiv.length === 0) {
        reject(errorMsg.idNotFound('#' + htmlIndexId));
      } else {
        $indexDiv.load(htmlModulePath, function(response, status, jqxhr) {
          if(status == 'error') {
            reject(errorMsg.fileNotFound(htmlModulePath));
          }
          resolve($indexDiv);
        });
      }
    });
  },

  create: function(values) {
    var instance = Object.create(this);
    Object.keys(values).forEach(function(key) {
      instance[key] = values[key];
    });
    return instance;
  }
};
```

Let us go through the skeleton code step by step.
## Step by Step explanation skeleton
### Error Messages
`Line 1` from the skeleton
```javascript
var errorMessages = require('../../../errorMessages');
```

This line includes all our defined errorMessages. It is not neccesarily needed just if you need to print out some error messages. When you do so please put your messages in this module. It is located in the [src/](../../src) folder and the content looks like the one below.

```javascript
'use strict';

var idNotFound = function(id) {
  if(typeof id === 'string') {
    return "Didn't found id: '"+ id +"'" ;
  }
  return "Didn't found id";
};

var fileNotFound = function(filePath) {
  if(typeof filePath === 'string') {
    return "File not found: '" + filePath + "'";
  }
  return "File not found";
};

module.exports.idNotFound = idNotFound;
module.exports.fileNotFound = fileNotFound;
```

### Module Base
`Line 4` from the skeleton 
```javascript
var moduleBase = require('../../../moduleBase');
```
This is the base module it extends every new module in the bc-climate-explorer. This module will be called in `line 6` of the skeleton
```javascript
module.exports = moduleBase.create({
  ...
}
```

This base module will load the views that are necessary for the new module. Here is the code of the `moduleBase.js` to get a better understanding of how it works

```javascript
'use strict';

var $ = require('jquery');
var errorMsg = require('./errorMessages');

module.exports = {
  htmlIndexId: '',
  htmlModuleId: '',
  htmlModulePath: '',

  loadViews: function(htmlIndexId, htmlModuleId, htmlModulePath) {
    return new Promise(function(resolve, reject) {
      var $indexDiv = $('#' + htmlIndexId);
      if($indexDiv.length === 0) {
        reject(errorMsg.idNotFound('#' + htmlIndexId));
      } else {
        $indexDiv.load(htmlModulePath, function(response, status, jqxhr) {
          if(status == 'error') {
            reject(errorMsg.fileNotFound(htmlModulePath));
          }
          resolve($indexDiv);
        });
      }
    });
  },

  create: function(values) {
    var instance = Object.create(this);
    Object.keys(values).forEach(function(key) {
      instance[key] = values[key];
    });
    return instance;
  }
};
```

### Initialization of the ids and the path
The initialization for the ids and the HTML file path can be found in the `lines 8-10` in the skeleton

```javascript
this.htmlIndexId = 'panel-awesome-index';
this.htmlModuleId = 'panel-awesome-module';
this.htmlModulePath = './awesome.html';
```

The index and module ids should look like this 
```
panel-<module-name>-<index/module>
``` 
for all new modules. TODO describe the promise from the loadViews function