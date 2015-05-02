
/**
 * TimeVis object for CS171 Final Project
 * This is a simple bar graph visualization that shows the prevalance
 * of obesity in the United States over time                    
 */

// set some variables
var margin = {top: 50, bottom: 10, left: 50, right: 40};
var width = 1000 - margin.left - margin.right;
var height = 1160- margin.top - margin.bottom;

// Creates sources <svg> element and inner g (for margins)
var svg = d3.select("body").append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom)
          .append("g")
            .attr("transform", "translate("+margin.left+","+margin.top+")");


d3.json("data/obesity.json", function(error, data){
  // check for error while loading data
  if (error) { 
    console.log(error); 
  } else { 

  // save data to new variable
  var timeData = data; 

  // x-scale
  var x = d3.scale.ordinal()
    .domain([d3.extent(timeData, function (d){return d.year;})])
    .rangeRoundBands([0, width], .1);

  // y-scale
  var y = d3.scale.linear()
    .domain([0, height])

  // create axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  // data join
  var bar = this.svg.selectAll(".bar")
    .data(timeData);

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
        return that.y(d);
    })
    .attr("width", this.x.rangeBand()/3)
    .style("fill", function(d) {
        return that.color(d.name);
    })
    .attr("height", function(d) {
        return that.height - that.y(d.data);
    })
    .delay(function(d,i){return i * 300;});
}
