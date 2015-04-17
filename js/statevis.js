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
StateVis = function(_parentElement, _restaurantData, _healthData, _usData, _eventHandler){

    this.parentElement = _parentElement;
    this.restaurantData = _restaurantData;
    this.healthData = _healthData;
    this.usData = _usData;
    this.eventHandler = _eventHandler;
    this.displayData = [];

    console.log(_parentElement);
    // TODO: define all "constants" here
    this.margin = {top: 0, right: 0, bottom: 0, left: 0},
    this.width = this.parentElement[0][0]["clientWidth"] - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.centered;

    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
StateVis.prototype.initVis = function(){

    // make this available for function calls
    var that = this; 

    var projection = d3.geo.albersUsa()
        .scale(1070)
        .translate([this.width / 2, this.height / 2]);

    this.path = d3.geo.path()
        .projection(projection);

        // - construct SVG layout
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.svg.append("rect")
        .attr("class", "background")
        .attr("width", this.width)
        .attr("height", this.height)
        .on("dblclick", function (d) {that.doubleClicked (d)});

    this.g = this.svg.append("g");
    
    this.g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(that.usData, that.usData.objects.states).features)
        .enter().append("path")
            .attr("d", that.path)
            .on("dblclick", function (d) {that.doubleClicked (d)});

    this.g.append("path")
        .datum(topojson.mesh(that.usData, that.usData.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", that.path);



    // modify this to append an svg element, not modify the current placeholder SVG element
    //this.svg = this.parentElement.select("svg");

    // filter, aggregate, modify data
    //this.wrangleData();

    // call the update method
    //this.updateVis();
}



/**
 * Method to wrangle the data. In this case it takes an options object
  */
StateVis.prototype.wrangleData = function(){

    // displayData should hold the data which is visualized
    this.displayData = this.data;

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
StateVis.prototype.updateVis = function(){

    // TODO: implement update graphs (D3: update, enter, exit)
    
    // updates scales
    this.x.domain(d3.extent(this.displayData, function(d) {return d.time; }));
    this.y.domain(d3.extent(this.displayData, function(d) {return d.count; }));

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    // updates graph
    var path = this.svg.selectAll(".area")
      .data([this.displayData])

    path.enter()
      .append("path")
      .attr("class", "area")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    path
      .transition()
      .attr("d", this.area);

    path.exit()
      .remove();

    this.brush.x(this.x);
    this.svg.select(".brush")
        .call(this.brush)
      .selectAll("rect")
        .attr("height", (this.height));

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
StateVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function
    this.wrangleData();
    // do nothing -- no update when brushing

}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */
StateVis.prototype.doubleClicked = function (d){
    console.log(d);
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

    this.g.selectAll("path")
        .classed("active", that.centered && function(d) { return d === that.centered; });

    this.g.transition()
        .duration(750)
        .attr("transform", "translate(" + that.width / 2 + "," + that.height / 2 + ")scale("
            + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}


/**
 * brush function is called when user interacts with chart to call 
 * event handler and update the current brush text
 */ 
StateVis.prototype.brushed = function(){



    // create object to pass into event handler
    var brushRange = {startDate: this.brush.extent()[0], 
                        endDate: this.brush.extent()[1]};



    // trigger event handler
    $(this.eventHandler).trigger("selectionChanged", brushRange);
       
}








