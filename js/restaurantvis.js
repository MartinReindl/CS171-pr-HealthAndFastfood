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
    this.margin = {top: 0, right: 0, bottom: 40, left: 40},
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
    this.displayData = [];

    // read current category from radiobuttons/checkboxes
    var categories = [];
    d3.selectAll("input").each(function(){
        if(d3.select(this).node().checked){
            if (this.type == "checkbox" ) {categories.push(this.value);}
        }
    });

    // update displayData to new values
    categories.forEach(function (d){

        // object for this category
        var category = [{},{},{}];

        // set US averags
        category[0]["franchise"] = d; 
        category[0]["name"] = "United States";
        category[0]["data"] = that.stateData[0][d]; 

        if (_selection === null){

            // initialize first selection to be Massachussetts 
            category[1]["franchise"] = d; 
            category[1]["name"] = that.stateData[22]["name"];
            category[1]["data"] = that.stateData[22][d];

            // initialize the second selection to be Texas
            category[2]["franchise"] = d; 
            category[2]["name"] = that.stateData[44]["name"];
            category[2]["data"] = that.stateData[44][d];

        }else{

            // set first selection
            category[1]["franchise"] = d; 
            category[1]["name"] = _selection.name;
            category[1]["data"] = _selection[d]

            // initialize the second selection to be Texas
            category[2]["franchise"] = d; 
            category[2]["name"] = _selection.name;
            category[2]["data"] = _selection[d]
        }
        
        category.forEach(function (d){

            switch (d.franchise){
                case "S_perCapita": d.franchise = "Starbucks"; break;
                case "MD_perCapita": d.franchise = "McDonalds"; break;
                case "BK_perCapita": d.franchise = "Burger King"; break;
                case "DQ_perCapita": d.franchise = "Dairy Queen"; 
            }
        })
        console.log(category);

        // move to displayData
        that.displayData = that.displayData.concat(category);
    });
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 */
RestaurantVis.prototype.updateVis = function(){

    // make data and functions available in other scopes
    var that = this; 
    
    // updates scales
    this.x.domain(this.displayData.map(function(d){return d.franchise;}));

    this.y.domain([0, d3.max(this.displayData, function (d){return d.data;})])

    // creates sub-x scale
    this.x_sub = d3.scale.ordinal()
        .domain(this.displayData.map(function(d){return d.name;}))
        .rangeRoundBands([0,(this.width/this.displayData.length)], .1);

  	// updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)	    
        .selectAll("text")  

        .attr("dx", "-.8em")
        .attr("dy", ".15em");

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
        console.log(this.displayData);
    // ensure correct positioning of bars 
    bar.selectAll("rect")
        .attr("x", function(d) {
          return that.x(d.franchise) + that.x_sub(d.name) * 3;
        })
        .attr("y", function(d){ 
        	return that.y(d.data);
        })
        .attr("width", this.x.rangeBand()/3)
        .style("fill", function(d) {
          return that.color(d.name);
        })
        .transition()
        .attr("height", function(d) {
          return that.height - that.y(d.data);
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