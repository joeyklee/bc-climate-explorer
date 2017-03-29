# How to create a new module

## What's a module in bc-climate-explorer
Every box in the picture below is a different module. Each of them is a separate folder (see second picture). All module folders are in the [src/modules](../../src/modules) folder of the project.

### All modules in the GUI
![wireframe image](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/modules.png)

### All modules in the filesystem
![filesystem image](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/modules_directories.png)

Every module for the bc-climate-explorer should contain the following files:

- 1 controller JavaScript file
- 1 model JavaScript file
- 1 HTML file
- 1 CSS file

The names of these files should contain the module name.
