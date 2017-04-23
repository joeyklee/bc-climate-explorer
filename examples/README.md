# Example-Area
Welcome to the example-area of the bc-climate-explorer!
 
 In here we want to explain what patterns we used to develop the tool. Also we show you how a new module should look like or rather the conventions it should follow.
 
 Tutorials:
 - [create-new-model](./create-new-module) -> How to create a new module
 - [create-new-controller](./create-new-controller) -> How to create a new controller
 - [create-new-event](./create-new-event) -> How to create a new event for the PubSub usage

Patterns that we used:
- PubSub Pattern 
([Youtube video](https://www.youtube.com/watch?v=nQRXi1SVOow&t=263s&index=4&list=PLoYCgNOIyGABs-wDaaxChu82q_xQgUb4f))
- Model View Controller Pattern
  - **Model** = Gets all the relevant data for example from a database 
  - **View** = Shows the data (in this project the HTML and CSS files are representing the view)
  - **Controller** = Links the model (data) and the view
