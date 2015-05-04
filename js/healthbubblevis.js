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
HealthBubbleVis = function(_parentElement, _stateData){

    // data 
    this.parentElement = _parentElement;
    this.stateData = _stateData;
    this.displayData = []; 

    // constants
    this.margin = {top: 50, right: 0, bottom: 50, left: 0};
    this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left 
        - this.margin.right; 
    this.height = 400 - this.margin.top - this.margin.bottom;

    // initialize visualization
    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
HealthBubbleVis.prototype.initVis = function(){

  // make data and functions available in other scopes
  var that = this;  

  // creates radius scale
  this.r = d3.scale.linear()
    .domain([0, Math.sqrt(100/Math.PI)])
    .range([0, 150])

  // get correct displayData
  this.wrangleData();

  // constructs SVG layout
  this.svg = this.parentElement.append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
 
  // create color scale
  this.color = d3.scale.ordinal()
    .domain(this.displayData.map(function(d){return d.name}))
    .range(colorbrewer.RdBu[9]);

    // Generate the force layout
  var force = d3.layout.force()
    .charge(-200)
    .size([this.width, this.height]);

  // add force values
  force
    .nodes(this.displayData)
    .start(); 

  // Nodes data join
  var node = this.svg.selectAll(".node")
      .data(this.displayData)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
      .style("fill", function(d) { return that.color(d.name); })
      .attr("r", function(d){return d.radius});

  node.append("text")
      .attr("text-anchor", "middle")
      .style("font-size",function(d){
        if (d.name == "Cardiovascular Disease"){
          return "12px"; 
        }
        else {
          return "16px"; 
        }
      })
      .attr("dy", "0.01em")
      .text(function(d) { 
        if (d.name == "Cardiovascular Disease") 
          return "CD " + d.value + "%"
        else 
          return d.name + " " + d.value + "%"
      })
      .call(that.wrap, 100);


  force.on("tick", function(e) {
    var q = d3.geom.quadtree(that.displayData),
        i = 0,
        n = that.displayData.length;

    while (++i < n) q.visit(that.collide(that.displayData[i]));

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  });

}

/**
 * Method gets the correct data
 */
HealthBubbleVis.prototype.wrangleData = function(){

  // categories we are interested in 
  var categories = ["Obesity", "Diabetes", "Cardiovascular Disease", "Mental Health"]

  // update DisplayData
  for (var j = 0; j < categories.length; j++){

      // set name and value for each category 
      var disease = {}; 
      disease.name = categories[j]; 
      disease.value = [this.stateData[0][categories[j]]]; 
      disease.value = disease.value[0];
      disease.radius = this.r(Math.sqrt(disease.value/Math.PI)); 

      // push to displayData
      this.displayData.push(disease)
  }
}

/** 
 * Resolves overlap between nodes. Adapted from http://bl.ocks.org/mbostock/1748247. 
 */ 
HealthBubbleVis.prototype.collide = function(node) {
  
  // make data and functions available in other scopes
  var that = this;  

  var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}

/**
 * Break text into two lines. Adapted from http://bl.ocks.org/mbostock/7555321
 */ 
HealthBubbleVis.prototype.wrap = function (text, width) {
  text.each(function() {

    // this text
    var text = d3.select(this); 
    // change width according to text length
    if (text[0][0]["__data__"]["name"] == "Cardiovascular Disease"){
      width = 20; 
    }
    else if (text[0][0]["__data__"]["name"] == "Obesity"){
      width = 60; 
    }
    else {
      width = 100; 
    }

    // continue with Mike's code
    var words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}