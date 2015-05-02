/**
 * structure adapted from CS 171 Homework 3, Spring 2015
 */


/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * LegendVis object for CS171 Final Project
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _restaurantData -- the data containing the locations of restaurants
 * @param _mapData -- the data used to construct the US map
 * @param _stateData -- health information on states as well as the number 
 *                      of restaurants of each franchise
 * @param _eventHandler -- the event handler                     
 */
LegendVis = function(_parentElement, _stateData, _eventHandler){

  // data 
  this.parentElement = _parentElement;
  this.stateData = _stateData;
  this.displayData = [];
console.log(this.parentElement);
  // constants
  this.margin = {top: 20, right: 0, bottom: 30, left: 0},
  this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left 
    - this.margin.right,
  this.height = 300 - this.margin.top - this.margin.bottom;
  this.centered;

  this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
LegendVis.prototype.initVis = function(){

  // create color scale
  this.color = d3.scale.category20();

  // create y scale
  this.x = d3.scale.ordinal()
    .rangeRoundBands([0,this.width], .1);

  // constructs SVG layout
  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
 
  // call the wrangle data method
  this.wrangleData(this.stateData[22], this.stateData[44])

  // call the update method
  this.updateVis();
}

/**
 * Method to wrangle the data. 
 * @param _selection1 - the first state selected by the user
 * @param _selection2 - the second state selected by the user
 */
LegendVis.prototype.wrangleData= function(_selection1, _selection2){

  // reset displayData
  this.displayData = ["United States", _selection1.name, _selection2.name];

}

/**
 * the drawing function - uses D3 enter, update, exit to update visualization
 */
LegendVis.prototype.updateVis = function(){

  // make data and functions available in other scopes
  var that = this; 

  // update scale
  this.x.domain(this.displayData)

  // Data join
  var bar = this.svg.selectAll(".bar")
    .data(that.displayData);

  // Enter
  bar.enter().append("rect")

  // Update
  bar
    .attr("class","bar");

  // Remove the extra bars
  bar.exit()
    .remove();

  // ensure correct positioning of bars 
  bar
    .transition()
    .attr("x", function(d){
      return that.x(d); 
    })
    .attr("y", function(d){ 
      return that.height/2 - that.height/10;
    })
    .attr("width", function(d){
      return that.width/2;
    })
    .style("fill", function(d) {
      return that.color(d);
    })
    .attr("height", function(d) {
      return that.height/10;
    })

  // Text data join
  var txt = this.svg.selectAll(".txt")
    .data(that.displayData);

  // enter
  txt.enter()
    .append("text")
    .attr("x", function(d){
      return that.x(d); 
    })
    .attr("y", function(d){ 
      return that.height/2;
    })
    .attr("class", "txt")
    .style("font-size","17px")
    .style("text-anchor", "middle");

  // update
  txt
    .text(function(d){return d});

  // exit
  txt.exit().remove();
}


/**
 * Gets called by event handler to wrangle data and update graph with new input
 * @ param selection1 is the first state selected by the user
 * @ param selection2 is the second state selected by the user
 */
LegendVis.prototype.onSelectionChange= function (_selection1, _selection2){

  // call wrangle function
  this.wrangleData(_selection1, _selection2); 
 
  // update bar graph
  this.updateVis();
}