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
RestaurantVis = function(_parentElement, _stateData, _eventHandler){

    // data 
    this.parentElement = _parentElement;
    this.stateData = _stateData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    // constants
    this.margin = {top: 20, right: 0, bottom: 30, left: 100},
    this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left 
        - this.margin.right,
    this.height = 300 - this.margin.top - this.margin.bottom;
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
    this.wrangleData(this.stateData[22], this.stateData[44])

    // call the update method
    this.updateVis();
}

/**
 * Method to wrangle the data. 
 * @param _selection1 - the first state selected by the user
 * @param _selection2 - the second state selected by the user
 */
RestaurantVis.prototype.wrangleData= function(_selection1, _selection2){

    // make data and functions available in other scopes
    var that = this; 

    // reset displayData
    this.displayData = [];

    // read current category from radiobuttons/checkboxes
    var categories = [];
    d3.selectAll("input").each(function(){
        if(d3.select(this).node().checked){
            if (this.type == "checkbox" && this.name == "fast_food" ){
                categories.push(this.value);}
        }
    });

    // update displayData to new values
    categories.forEach(function (d){

        // array for this category
        var category = [];

        // add US averages
        var selection0 = {}; 
        selection0["franchise"] = d; 
        selection0["name"] = "United States";
        selection0["data"] = that.stateData[0][d]; 
        category.push(selection0); 

        // add first selection 
        var selection1 = {};
        selection1["franchise"] = d; 
        selection1["name"] = _selection1.name;
        selection1["data"] = _selection1[d]
        category.push(selection1); 

        // add second selection
        var selection2 = {};
        selection2["franchise"] = d; 
        selection2["name"] = _selection2.name;
        selection2["data"] = _selection2[d]; 
        category.push(selection2); 

        // rename objects for better labeling 
        category.forEach(function (d){
            switch (d.franchise){
                case "S_perCapita": d.franchise = "Starbucks"; break;
                case "MD_perCapita": d.franchise = "McDonalds"; break;
                case "BK_perCapita": d.franchise = "Burger King"; break;
                case "DQ_perCapita": d.franchise = "Dairy Queen"; 
            }
        })

        // update displayData
        that.displayData = that.displayData.concat(category);  
    });
}

/**
 * the drawing function - uses D3 enter, update, exit to update visualization
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
        .rangeRoundBands([0, that.width/(that.displayData.length/3)], .2);

  	// updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)	    
        .selectAll("text")  
        .style("font-size","17px")
        .attr("dx", "-.8em")
        .attr("dy", ".75em");

    this.svg.select(".y.axis")
        .call(this.yAxis);

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
            return that.x(d.franchise) + that.x_sub(d.name) 
                - that.x_sub(that.displayData[0]["name"]);
        })
        .attr("y", function(d){ 
        	return that.y(d.data);
        })
        .attr("width", this.x.rangeBand()/3)
        .style("fill", function(d) {
            return that.color(d.name);
        })
        .attr("height", function(d) {
            return that.height - that.y(d.data);
        });

}


/**
 * Gets called by event handler to wrangle data and update graph with new input
 * @ param selection1 is the first state selected by the user
 * @ param selection2 is the second state selected by the user
 */
RestaurantVis.prototype.onSelectionChange= function (_selection1, _selection2){

    // call wrangle function
    this.wrangleData(_selection1, _selection2); 
   
    // update bar graph
    this.updateVis();
}