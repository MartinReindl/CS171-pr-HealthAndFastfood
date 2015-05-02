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
 * TimeVis object for CS171 Final Project
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _stateData -- time series data for obesity and some other measures               
 */
TimeVis = function(_parentElement, _timeData){

    // data 
    this.parentElement = _parentElement;
    this.timeData = _timeData;

    // constants
    this.margin = {top: 50, right: 0, bottom: 50, left: 0},
    this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left 
        - this.margin.right; 
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
TimeVis.prototype.initVis = function(){

  // make data and functions available in other scopes
  var that = this;  

  // constructs SVG layout
  this.svg = this.parentElement.append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
 
  // creates x scale
  this.x = d3.scale.ordinal()
    .domain(that.timeData.map(function(d){return d.year;}))
    .rangeRoundBands([0, this.width], .1);

  // create y scale
  that.y = d3.scale.linear()
    .domain([0, d3.max(that.timeData, function(d){return d.obesity;})])
    .range([this.height, 0]);

  // create color scale
  this.color = d3.scale.quantize()
    .domain([0, d3.max(that.timeData, function(d){return d.obesity;})])
    .range(colorbrewer.PuBu[9])

  // create axis
  this.xAxis = d3.svg.axis()
    .scale(this.x)
    .orient("bottom");

  // Add axes visual elements
  this.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + this.height + ")");

  this.svg.select(".x.axis")
    .call(this.xAxis)     
    .selectAll("text")  
    .style("font-size","12px")
    .style("fill", "white")
    .style("text-anchor", "middle"); 

  // Data join
  var bar = this.svg.selectAll(".bar")
      .data(that.timeData);

  // Enter
  bar.enter().append("rect")

  // Update
  bar
    .attr("class","bar")
    .attr("x", function(d){
      return that.x(d.year)
    })
    .attr("y", function(d){ 
      return that.y(d.obesity);
    })
    .attr("width", this.x.rangeBand())
    .style("fill", function(d) {
        return that.color(d.obesity);
    })
    .attr("height", function(d) {
        return that.height - that.y(d.obesity);
    });

  // Remove the extra bars
  bar.exit()
      .remove();

  // Text data join
  var txt = this.svg.selectAll(".txt")
    .data(that.timeData);

  // enter
  txt.enter()
    .append("text")
    .attr("x", function(d){
      return that.x(d.year); 
    })
    .attr("y", function(d){ 
      return that.y(d.obesity) - 3;
    })
    .attr("class", "txt")
    .style("font-size","12px")
    .style("text-anchor", "start")
    .style("fill", "white");

  // update
  txt
    .text(function(d){return d.obesity + "%"});

  // exit
  txt.exit().remove();

}
