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
    this.displayData = [];

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
        .rangeRoundBands([0, this.width], .1);

    // create y scale
    that.y = d3.scale.linear()
            .domain([0, d3.max(this.stateData, function (d){
                var restaurants = ["restaurants_perCapita", "MD_perCapita", "BK_perCapita", "DQ_perCapita", "S_perCapita"];
                var restaurant_max = d3.max(restaurants, function (e){
                    return d[e];
                })
                return restaurant_max;
            })])
            .range([this.height, 0]);

    // create color scale
	this.color = d3.scale.category20();

    // create axis
    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    // Add axes visual elements
    this.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + this.height + ")");

    this.svg.append("g")
        .attr("class", "y axis")

    // call the wrangle data method
    this.wrangleData(null)

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
    this.displayData = [{"name": "United States"}, {}, {}];

    // read current category from radiobuttons/checkboxes
    var categories = [];
    d3.selectAll("input").each(function(){
        if(d3.select(this).node().checked){
            if (this.type == "checkbox" ) {categories.push(this.value);}
        }
    });


    // update displayData to new values
    categories.forEach(function (d){
        if (_selection === null){
            // initialize first selection to show Massachussetts 
            that.displayData[1][d] = that.stateData[22][d];
            that.displayData[1]["name"] = that.stateData[22]["name"];

            // initialize the second selection to show Texas
            that.displayData[2][d] = that.stateData[44][d];
            that.displayData[2]["name"] = that.stateData[44]["name"];

        }else{
            that.displayData[1][d] = _selection[d];
            that.displayData[1]["name"] = _selection.name;
        }
        that.displayData[0][d] = that.stateData[0][d];
    });
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 */
RestaurantVis.prototype.updateVis = function(){

    // make data and functions available in other scopes
    var that = this; 
    
    // updates scales
    var keys = [];
    for(var k in this.displayData[0]) {
        if (k != "name"){keys.push(k);}
    }
    this.x.domain(keys);

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

    this.svg.select(".y.axis")
        .call(this.yAxis);

    // Data join
    var bar = this.svg.selectAll(".bar")
        .data(this.displayData);

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

    // ensure correct positioning of bars 
    bar.selectAll("rect")
        .attr("x", function(d) {
          return that.x(d.name);
        })
        .attr("y", function(d){ 
            console.log(d.S_perCapita);
        	return that.y(d.S_perCapita);
        })
        .attr("width", this.x.rangeBand())
        .style("fill", function(d) {
          return that.color(d.name);
        })
        .transition()
        .attr("height", function(d) {
          return that.height - that.y(d.S_perCapita);
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