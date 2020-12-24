var svgWidth = 660;
var svgHeight = 400; 

var margin = {
    top: 30,
    right:40,
    bottom:80,
    left:100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom; 

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
   .append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params

//XAXIS
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label

function xScale(stateData, chosenXAxis){
  // create scales
  var xLinearScale = d3.scaleLinear()
   .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
     d3.max(stateData, d => d[chosenXAxis]) * 1.2
   ])
   .range([0, width]);

  return xLinearScale;

};

//YAXIS
var chosenYAxis = "healthcare";

// function used for updating Y-scale var upon click on axis label

function yScale(stateData, chosenYAxis){
  // create scales
  var ylinearScale = d3.scaleLinear()
   .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
     d3.max(stateData, d => d[chosenYAxis ]) * 1.2
   ])
   .range([height, 0]);

  return ylinearScale;

};

//function used for updating xAxis var upon click on axis label

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating YAxis var upon click on axis label

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis,chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//Function for updating circle labels
function renderLabels(circleLabels, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    
    circleLabels.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
  return circleLabels;
}

// // function used for updating circles group with new tooltip 

function updateToolTip(chosenXAxis,chosenYAxis, circlesGroup) {


  if (chosenXAxis === "poverty") {
    var xLabel = "Poverty %:";
  }
  else {
    var xLabel = "Age:";
  }

  if (chosenYAxis === "healthcare") {
    var yLabel = "Healthcare %:";
  }
  else {
    var yLabel = "Obesity %:";
  }

 // ToolTip
 var toolTip = d3.tip()
 .attr("class", "d3-tip")
 .offset([80, -60])
 .html(function(d) {

return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
});
  
  // Append to chart
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup;
}
// Import Data

d3.csv("assets/data/data.csv").then(function(stateData) {

    console.log(stateData);
    

    // Step 1: Parse Data/Cast as numbers
    stateData.forEach(function(city) {
        city.poverty = +city.poverty;
        city.age = +city.age;
        city.healthcare = +city.healthcare;
        city.obesity = +city.obesity;
        
    });
    console.log(d3.max(stateData, d => d.poverty));
    console.log(d3.extent(stateData, d => d.poverty))

    // Step 2. Create scale funtions

    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);

    // Step 3. Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4. Append Axis to the group

    // append x axis
    var xAxis = chartGroup.append("g")
       .classed("x-axis", true)
       .attr("transform", `translate(0, ${height})`)
       .call(bottomAxis);
    
    // append y axis
    var yAxis = chartGroup.append("g")
       .classed("y-axis", true)
       .call(leftAxis);

    // Step 5. Create Circles

    var circlesGroup =  chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "11")
    .attr("fill", "purple")
    .attr("opacity", ".5");

    // Add Labels

    var circleLabels = chartGroup.selectAll()
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

   // Create axes labels
   // Create group for two x-axis labels
  var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 40)
   .attr("value", "age") // value to grab for event listener
   .classed("active", true)
   .text("Age (Mediam)");

    // append y axis
    // Create group for two x-axis labels

  var yLabelsGroup = chartGroup.append("g")
     .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("y", 0 -margin.left +40)
    .attr("x", 0 - (height /1.7))
    .attr("dy", "1em")
    .attr("value", "healthcare") // value to grab for event listener
    .text("Lacks Healthcare (%)");

  var obesityLabel = yLabelsGroup.append("text")
    .attr("y", 0 -margin.left +20)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .attr("value", "obesity") // value to grab for event listener
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
  // bold text default xAxis
  if (chosenXAxis === "poverty") {
    povertyLabel
     .classed("active", true)
     .classed("inactive", false);
    ageLabel
     .classed("active", false)
     .classed("inactive", true);
 }
 else {
   povertyLabel
     .classed("active", false)
     .classed("inactive", true);
    ageLabel
     .classed("active", true)
     .classed("inactive", false);
 };
  // bold text default yAxis
  if (chosenYAxis === "healthcare") {
    healthcareLabel
      .classed("active", true)
      .classed("inactive", false);
    obesityLabel
      .classed("active", false)
      .classed("inactive", true);
  }
  else {
    helathcareLabel
      .classed("active", false)
      .classed("inactive", true);
    obesityLabel
      .classed("active", true)
      .classed("inactive", false);
    };

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {
    
       // replaces chosenXAxis with value
       chosenXAxis = value;

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(stateData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderXAxes(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

       //Updates circle labels with new values
       circleLables = renderLabels(circleLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenXAxis === "poverty") {
          povertyLabel
           .classed("active", true)
           .classed("inactive", false);
          ageLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else {
         povertyLabel
           .classed("active", false)
           .classed("inactive", true);
          ageLabel
           .classed("active", true)
           .classed("inactive", false);
       }
     } 
   });

     // y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
  
      // replaces chosenXAxis with value
      chosenYAxis = value;

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(stateData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
      
      // Updates circle labels with new values
      circleLables = renderLabels(circleLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
         healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
         obesityLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    } else {
      console.log("no match")
    }
  })
}).catch(function(error) {
  console.log(error);
});

