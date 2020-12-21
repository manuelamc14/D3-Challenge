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
var svg = d3.select("#scatter")
   .append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data

d3.csv("assets/data/data.csv").then(function(stateData) {

    console.log(stateData);
    

    // Step 1: Parse Data/Cast as numbers
    stateData.forEach(function(city) {
        city.poverty = +city.poverty;
        city.healthcare = +city.healthcare;
    });
    console.log(d3.max(stateData, d => d.poverty));
    console.log(d3.extent(stateData, d => d.poverty))

    // Step 2. Create scale funtions

    var xLinearScale = d3.scaleLinear()
        //.domain(d3.extent(stateData, d => d.poverty))
        .domain([9, d3.max(stateData, d => d.poverty)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

 
    // Step 3. Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4. Append Axes to the chart Group

    chartGroup.append("g")
       .attr("transform", `translate(0, ${height})`)
       .call(bottomAxis);

    chartGroup.append("g")
       .call(leftAxis);

    // Step 5. Create Circles

    var circlesGroup =  chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "11")
    .attr("fill", "purple")
    .attr("opacity", ".5");

    // Add Labels

    var circleLabels = chartGroup.selectAll(null)
    .data(stateData)
    .enter()
    .append("text");

   circleLabels
   .attr("x", function(d) {
   return xLinearScale(d.poverty);
   })
   .attr("y", function(d) {
   return yLinearScale(d.healthcare);
   })
   .text(function (d) {
   return d.abbr;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "10px")
   .attr("text-anchor", "middle")
   .attr("fill", "white");

   // Create axes labels

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 -margin.left +40)
      .attr("x", 0 - (height /2))
      .attr("dy", "1em")
      .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
      .text("In Poverty (%)")
});



