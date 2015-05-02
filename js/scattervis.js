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
ScatterVis = function(_parentElement, _stateData, _eventHandler, _restaurantFilter, _health_measure_selection){

    // data 
    this.parentElement = _parentElement;
    this.stateData = _stateData;
    this.eventHandler = _eventHandler;
    this.displayData = [];
	this.restaurant_filter = _restaurantFilter;
	this.health_measure_selection = _health_measure_selection;

    // constants
    this.margin = {top: 0, right: 100, bottom: 30, left: 30},
    this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left 
        - this.margin.right,
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.centered;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
ScatterVis.prototype.initVis = function(){

    // make data and functions available in other scopes
    var that = this;  

    // constructs SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
   
    // creates x scale
    this.x = d3.scale.linear()
			.range([5, this.width-5])
    // create y scale
    that.y = d3.scale.linear()
            .range([this.height-5, 5]);

    // create color scale
	//this.color = d3.scale.category20();

    // create axis
    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom")

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")

    // Add axes visual elements
    this.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + this.height + ")");

    this.svg.append("g")
        .attr("class", "y axis")

    // call the wrangle data method
    this.wrangleData(this.restaurant_filter, this.health_measure_selection)

    // call the update method
    this.updateVis();
}

// helper function to see if an array contains a value
function contains(array, value){
	for(var i in array){
		if(array[i] == value){
			return i;
		}
	}
	return -1;
}


// function that calculates the minimum
function minimum(a, encoding){
  var min = Infinity
  for(el in a){
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
    if(a[el][encoding] != null &&
      parseFloat(a[el][encoding]) > max){
      max = parseFloat(a[el][encoding]);
    }
  }
  return max;
}

// the following code is from an example of adding a trendline from trentrichardson.com/2010/04/06/compute-linear-regressions-in-javascript/
function linearRegression(y,x){
	var lr = {}
	var n = y.length;
	var sum_x = 0;
	var sum_y = 0;
	var sum_xy = 0;
	var sum_xx = 0;
	var sum_yy = 0;

	for (var i = 0; i < n; i++){
		sum_x += x[i];
		sum_y += y[i];
		sum_xy += (x[i]*y[i])
		sum_xx += (x[i]*x[i])
		sum_yy += (y[i]*y[i])
	}

	lr['slope'] = (n * sum_xy - sum_x * sum_y)/(n * sum_xx - sum_x * sum_x);
	lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
	lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x)*(n*sum_yy-sum_y*sum_y)),2)

	return lr;
}

// function that returns y given a linear regression and x value
function return_y(lr, x){
	console.log(lr['slope'])
	console.log(lr['intercept'])
	var y = lr['slope']*x+lr['intercept']
	return y;
}

/**
 * Method to wrangle the data. 
 * @param _selection1 - the first state selected by the user
 * @param _selection2 - the second state selected by the user
 */
ScatterVis.prototype.wrangleData= function(restaurant_filter, health_measure_selection){

	this.restaurant_filter = restaurant_filter;
	this.health_measure_selection = health_measure_selection;

    // make data and functions available in other scopes
    var that = this; 

    // set displayData equal to statedata
    this.displayData = this.stateData;

	var temp_sum;

	for(element in that.displayData){
		temp_sum = 0;
		if(contains(that.restaurant_filter, "McDonalds") >= 0){
			temp_sum += that.displayData[element]["MD_perCapita"]
		}
		if(contains(that.restaurant_filter, "BurgerKing") >= 0){
			temp_sum += that.displayData[element]["BK_perCapita"]
		}
		if(contains(that.restaurant_filter, "DQ") >= 0){
			temp_sum += that.displayData[element]["DQ_perCapita"]
		}
		if(contains(that.restaurant_filter, "Starbucks") >= 0){
			temp_sum += that.displayData[element]["S_perCapita"]
		}
		that.displayData[element]["restaurants_perCapita"] = temp_sum;
	}

}

/**
 * the drawing function - uses D3 enter, update, exit to update visualization
 */
ScatterVis.prototype.updateVis = function(){

    // make data and functions available in other scopes
    var that = this; 

    xmin = minimum(that.displayData, "restaurants_perCapita")
	xmax = maximum(that.displayData, "restaurants_perCapita")
	ymin = minimum(that.displayData, that.health_measure_selection)
	ymax = maximum(that.displayData, that.health_measure_selection)

	// updates scales
    this.x.domain([xmin, xmax]);

    this.y.domain([ymin, ymax])

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
    var point = this.svg.selectAll(".point")
        .data(that.displayData);

    // Enter
    point.enter().append("circle")

    // Update
    point
        .attr("class","point");

    // Remove the extra bars
    point.exit()
        .remove();

    // ensure correct positioning of bars 
    point
        .transition()
        .attr("cx", function(d){
            return that.x(d.restaurants_perCapita) 
        })
        .attr("cy", function(d){ 
			return that.y(d[that.health_measure_selection]);
        })
        .attr("r", 3)
        .style("fill", function(d) {
			return "blue";        	
		})
		.attr("opacity", 0.7)

	// set up the linear trendline
	var x_series = []
	var y_series = []
	for(state in that.displayData){
		x_series.push(that.displayData[state]["restaurants_perCapita"])
		y_series.push(that.displayData[state][that.health_measure_selection])
	}
	var lr = linearRegression(y_series, x_series)
	var trendlineData = [[xmin, return_y(lr, xmin), xmax, return_y(lr, xmax)]]
	
	// data join
	var trendline = this.svg.selectAll(".trendline")
		.data(trendlineData);

	// enter
	trendline.enter().append("line")

	//update
	trendline
		.attr("class", "trendline")
		.attr("x1", function(d){
			return that.x(d[0]);
		})
		.attr("y1", function(d){
			return that.y(d[1]);
		})
		.attr("x2", function(d){
			return that.x(d[2]);
		})
		.attr("y2", function(d){
			return that.y(d[3]);
		})	
		.attr("stroke", "black")
		.attr("stroke-width", 0.7);

	// exit
	trendline.exit().remove();
}


/**
 * Gets called by event handler to wrangle data and update graph with new input
 * @ param selection1 is the first state selected by the user
 * @ param selection2 is the second state selected by the user
 */
ScatterVis.prototype.onSelectionChange= function (_selection1, _selection2){

    // call wrangle function
    this.wrangleData(_selection1, _selection2); 
   
    // update bar graph
    this.updateVis();
}
