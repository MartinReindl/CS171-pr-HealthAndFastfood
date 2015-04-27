/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * StateVis object for CS171 final project
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _healthData -- the array containing franchise information
 * @param _healthData -- the array containing health information for each state
 * @param _eventHandler -- the Eventhandling Object to emit data to 
 * @constructor
 */
StateVis = function(_parentElement, _restaurantData, _mapData, _stateData, _eventHandler){

  // data 
  this.parentElement = _parentElement;
  this.restaurantData = _restaurantData;
  this.mapData = _mapData;
  this.stateData = _stateData;
  this.eventHandler = _eventHandler;
  this.displayData = [];

  // constants
  this.margin = {top: 0, right: 0, bottom: 0, left: 0},
  this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left - this.margin.right,
  this.height = 500 - this.margin.top - this.margin.bottom;
  this.centered;
	this.health_measure = "Obesity"

	// scales
	this.color_scale = d3.scale.quantize()
	this.color_scale.range(colorbrewer.PuBu[9])

	this.xScale = d3.scale.linear()
    .range([135, this.width])

	this.yScale = d3.scale.linear()
    .range([this.height, this.margin.bottom])

	// update x and y scales
	var xmin = minimum(this.restaurantData, "Lattitude")
	var xmax = maximum(this.restaurantData, "Lattitude")
	var ymin = minimum(this.restaurantData, "Longitude")
	var ymax = maximum(this.restaurantData, "Longitude")

	this.xScale.domain([xmin,xmax])
	this.yScale.domain([ymin,ymax])

    this.initVis();
}





/**
 * Method that sets up the SVG and the variables
 */
StateVis.prototype.initVis = function(){

	// make this available for function calls
  var that = this; 

  // set up color scale
	var max = maximum(this.stateData, this.health_measure)

	var min = minimum(this.stateData, this.health_measure)
	
	this.color_scale.domain([min/2, max]) 
	
	projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([this.width / 2, this.height / 2]);

  this.path = d3.geo.path()
    .projection(projection);

	// - construct SVG layout
  this.svg = this.parentElement.append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom);

  // tooltip
  tip = d3.tip()
    .attr("class", "d3-tip")
    .direction("s")
    .html(function (d) { 
      return that.display_tip(d);
    });

  // initialize tooltip
  this.svg.call(tip)

  this.g = this.svg.append("g");
  
  this.g.append("g")
    .attr("id", "states")
  .selectAll("path")
    .data(topojson.feature(that.mapData, that.mapData.objects.states).features)
    .enter().append("path")
    .attr("d", that.path)
		.attr("fill", function(d) {
      var id = d["id"];
      for(element in that.stateData){
        if(id == that.stateData[element]["id"]){
          return that.color_scale(that.stateData[element][that.health_measure])
        }
      }
			return "black"
		})
    .attr("class", "states")
    .on("dblclick", function (d) {that.doubleClicked (d)})
    .on("click", function (d) {that.clicked (d)})
    // Show and hide tip on mouse events
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  this.g.append("path")
      .datum(topojson.mesh(that.mapData, that.mapData.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", that.path)
      .attr("fill", "blue");

	// create scatterplot of points corresponding to individual restaurants
	this.g.selectAll("circle")
		.data(that.restaurantData)
		.enter()
		.append("circle")
		.attr("r", 1.2)
		.attr("cx", function(d){
			var loc = projection([parseFloat(d["Lattitude"]), parseFloat(d["Longitude"])])
			return loc[0];
		})
		.attr("cy", function(d){
			var loc = projection([parseFloat(d["Lattitude"]), parseFloat(d["Longitude"])])
			return loc[1];
		})
		.attr("fill", function(d){
			if(d["Restaurant"] == "BurgerKing")
				return "white"
			if(d["Restaurant"] == "McDonalds")
				return "yellow"
			if(d["Restaurant"] == "Starbucks")
				return "green"
			if(d["Restaurant"] == "DQ")
				return "red"
		})
}



/**
 * Method to wrangle the data. In this case it does not need to do anything
**/
StateVis.prototype.wrangleData = function(){
	// do nothing
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
StateVis.prototype.updateVis = function(filtered_restaurant_data, health_measure_encoding){
	
	// update health measure
	this.health_measure = health_measure_encoding

	// make this available for function calls
  var that = this; 

  // update color scale
	var max = maximum(this.stateData, this.health_measure)

	var min = minimum(this.stateData, this.health_measure)
	
	this.color_scale.domain([min/2, max]) 

	// redefine projection
	projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([this.width / 2, this.height / 2]);

	// update heat map
	d3.selectAll("path")
    .transition()
    .duration(500)
    .attr("fill", function(d){
  		var id = d["id"];
  		for(element in that.stateData){
  			if(id == that.stateData[element]["id"]){
  				return that.color_scale(that.stateData[element][that.health_measure])
  			}
  		}
  		return "black"
  	})

	// data join
	var points = this.g.selectAll("circle")
		.data(filtered_restaurant_data)

	// add points if necessary
	points.enter()
		.append("circle")
		.attr("r", 1.2)
		.attr("cx", function(d){
			var loc = projection([parseFloat(d["Lattitude"]), parseFloat(d["Longitude"])])
			return loc[0];
		})
		.attr("cy", function(d){
			var loc = projection([parseFloat(d["Lattitude"]), parseFloat(d["Longitude"])])
			return loc[1];
		})
		.attr("fill", function(d){
			if(d["Restaurant"] == "BurgerKing")
				return "white"
			if(d["Restaurant"] == "McDonalds")
				return "yellow"
			if(d["Restaurant"] == "Starbucks")
				return "green"
			if(d["Restaurant"] == "DQ")
				return "red"
		})

	// remove points that aren't needed anymore
	points.exit().remove()
}

/*
 * doubleClicked allows a user to zoom in onto the map 
 * @ parameter d is the state selected
 */ 

StateVis.prototype.doubleClicked = function (d){

  that = this; 
  
  var x, y, k;

  if (d && that.centered !== d) {
    var centroid = that.path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    that.centered = d;
  } else {
    x = that.width / 2;
    y = that.height / 2;
    k = 1;
    that.centered = null;
  }

  this.g.transition()
    .duration(750)
    .attr("transform", "translate(" + that.width / 2 + "," + that.height / 2 + ")scale("
        + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
}


/*
 * clicked allows a user to select a state 
 * @ parameter selection is the selected state
 */ 
StateVis.prototype.clicked = function (selection){
  
  // find information on selection
  var selectionInfo; 
  this.stateData.forEach(function (e) {
      if (selection.id == e.id) {
          selectionInfo = e; 
      }
  });

  // trigger event handler
  $(this.eventHandler).trigger("selectionChanged", selectionInfo);
}

/*
 * display_tip shows information about the state we are currently hovering on 
 * @ parameter selection is the selected state
 */
StateVis.prototype.display_tip = function (selection){

  // find information on selection
  var d; 
  this.stateData.forEach(function (e) {
      if (selection.id == e.id) {
          d = e; 
      }
  });

  // find out which health information is currently being displayed 
  var health_measure; 
  d3.selectAll("input").each(function(){
    if(d3.select(this).node().checked){
      if (this.type == "radio"){
        health_measure = this.value; 
      }
    }
  });
  
  // create table
  var table = "<h5>" + d.name +"</h5><br>" + 
    health_measure + ": " + d[health_measure] +"% <br> Starbucks: " + 
    d.S_perCapita + " per million <br> McDonalds: " + 
    d.MD_perCapita + " per million <br> BurgerKing: " +
    d.BK_perCapita + " per million <br> Dairy Queen: " +
    d.DQ_perCapita + " per million";

  return table;
}

// function that calculates the minimum
function minimum(a, encoding){
  var min = Infinity
  for(el in a){
    if(a[el]["State"] == "AK" ||  
      a[el]["State"] == "HI"){
      continue;
    }
    if(a[el][encoding] != null &&
      parseFloat(a[el][encoding]) < min){
      min = parseFloat(a[el][encoding]);
    }
  }

  return min;
}

// function that calculates the maximum
function maximum(a, encoding){
  var max = -Infinity
  for(el in a){
    if(a[el]["State"] == "AK" ||
      a[el]["State"] == "HI"){
      continue;
    }
    if(a[el][encoding] != null &&
      parseFloat(a[el][encoding]) > max){
      max = parseFloat(a[el][encoding]);
    }
  }
  return max;
}








