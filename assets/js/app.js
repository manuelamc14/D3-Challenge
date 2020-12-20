var svgWidth = 960;
var svgHeight = 500; 

var margin = {
    top: 20,
    right:40,
    bottom:60,
    left:100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom; 

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".scatter")
   .append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    stateData.forEach(function(data) {
        stateData.poverty = +stateData.poverty;
        stateData.healthcare = +stateData.healthcare;
    });

    // Step 2. Create scale funtions
    
})