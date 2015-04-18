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
 * RestaurantVis object for CS171 Final Project
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _restaurantData -- the data containing the locations of restaurants
 * @param _mapData -- the data used to construct the US map
 * @param _stateData -- health information on states as well as the number 
 *                      of restaurants of each franchise
 * @param _eventHandler -- the event handler                     
 */
RestaurantVis = function(_parentElement, _restaurantData, _mapData, _stateData, _eventHandler){

    // data 
    this.parentElement = _parentElement;
    this.restaurantData = _restaurantData;
    this.mapData = _mapData;
    this.stateData = _stateData;
    this.eventHandler = _eventHandler;
    this.displayData = {"us_average": {},
                        "selection1": {},
                        "selection2": {}};

    // constants
    this.margin = {top: 0, right: 0, bottom: 0, left: 0},
    this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left - this.margin.right,
    this.height = 200 - this.margin.top - this.margin.bottom;
    this.centered;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
RestaurantVis.prototype.initVis = function(){

    var that = this; 
    var franchiseNames = ["Starbucks", "McDonalds", "BurgerKing", "DairyQueen"]; 

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
   
    // creates x scale
    this.x = d3.scale.ordinal()
        .rangeRoundBands([0, this.width], .1);

    // create y scales (one for each fast food chain)
    franchiseNames.forEach(function (d){
        that[d] = d3.scale.linear()
            .domain([0, d3.max(that.stateData, function (e){ return e[d];})])
            .range([this.height, 0]);
    });

	this.color = d3.scale.category20();

    // create axis
    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
        .orient("left");

    // Add axes visual elements
    this.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + this.height + ")");

    this.svg.append("g")
        .attr("class", "y axis")

    // call the update method
    this.updateVis();
}

/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
RestaurantVis.prototype.wrangleData= function(_selection){

    // make data and functions available in other scopes
    var that = this; 

    // reset displayData
    this.displayData = {"us_average": {"name": "United States"},
                    "selection1": {},
                    "selection2": {}};

    // read current category from radiobuttons/checkboxes
    var categories = [];
    d3.selectAll("input").each(function(){
        if(d3.select(this).node().checked){
            if (this.type == "checkbox" ) {categories.push(this.value);}
        }
    });

    // update displayData to new values
    categories.forEach(function (d){
        that.displayData.selection1[d] = _selection[d];
        that.displayData.selection1["name"] = _selection.name;
        that.displayData.us_average[d] = that.stateData[0][d];
    });
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 */
RestaurantVis.prototype.updateVis = function(){

    // make data and functions available in other scopes
    var that = this; 
    console.log(that.displayData);
    console.log(that.displayData.map(function(d) { return d.StarBucks; }));
    // updates scales
    this.x.domain();

  	// updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)	    
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-65)" 
	     });

    /*this.svg.select(".y.axis")
        .call(this.yAxis);*/

    // Data join
    var bar = this.svg.selectAll(".bar")
        .data(that.displayData, function(d) { return d.StarBucks; });
 
 	// Append new bar groups, if required
    var bar_enter = bar.enter().append("g");

    // Append a rect for the Enter set (new g)
    bar_enter.append("rect");

    // Add attributes (position) to all bars
    bar
        .attr("class", "bar")
        .transition();

    // Remove the extra bars
    bar.exit()
        .remove();

    bar.selectAll("rect")
        .attr("x", function(d) {
          return that.x(d.name);
        })
        .attr("y", function(d){ 
        	return that.y(d.StarBucks);
        })
        .attr("width", this.x.rangeBand())
        .style("fill", function(d) {
          return that.color(d.name);
        })
        .transition()
        .attr("height", function(d) {
          return that.height - that.y(d.StarBucks);
        });
}


/**
 * Gets called by event handler and updates the displayData
 * @param selection is the state selected by the user
 */
RestaurantVis.prototype.onSelectionChange= function (_selection){

    // call wrangle function
    this.wrangleData(_selection); 
   
    // update bar graph
    this.updateVis();
}