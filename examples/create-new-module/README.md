# What's a module in bc-climate-explorer
Every box in the picture below is a different module. Each of them is a separate folder (see second picture). All module folders are in the [src/modules](../../src/modules) folder of the project.

### All modules in the GUI
![wireframe image](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/modules.png)

### All modules in the project
![filesystem image](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/modules_directories.png)

Every module for the bc-climate-explorer should at least contain the following files:

- 1 controller JavaScript file (Click for an example of a controller file)
- 1 model JavaScript file (Click for an example of a model file)
- 1 HTML file (Click for an example of a HTML file)
- 1 CSS file

The names of these files should contain the module name.

### Example
In the picture below you see the file names for the location module. 
![example_folder_file_names](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/example_folder_file_names.png)


# Roadmap for a new module (example)
Say you want to create a new module called "**awesome**". To do so, just let the steps below guide you.
1. Create a new folder with a fitting name for the module in the project's [src/modules](../../src/modules) folder. For the example we call it "awesome"
![roadmap_1_new_folder.png](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/roadmap_1_new_folder.png)

2. Create the files mentioned above with the following naming convention:
    - `awesome.html`
    - `awesome.css`
    - `awesomeController.js`
    - `awesomeModel.js`
![roadmap_2_new_files.png](https://github.com/joeyklee/bc-climate-explorer/blob/master/examples/images/roadmap_2_new_files.png)