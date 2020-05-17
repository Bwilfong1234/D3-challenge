// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 250,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var chart = d3
    .select("#scatter")
    .append("div")
    .classed('chart', true);
let svg = chart.append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusdata, chosenXAxis) {
    // create scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusdata, d => d[chosenXAxis]) * 0.8,
            d3.max(censusdata, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

function yScale(censusdata, chosenYAxis) {
    // create scales
    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusdata, d => d[chosenYAxis]) * .5,
            d3.max(censusdata, d => d[chosenYAxis]) * 1
        ])
        .range([height, 0]);

    return yLinearScale;

}

// function used for updating xAxis var upon click on axis label




function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);


    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);


    return xAxis;

}

// function renderAxes(newYScale, yAxis) {
//     var leftAxis = d3.axisLeft(newYScale);

//     yAxis.transition()
//         .duration(1000)
//         .call(leftAxis);
//     return yAxis
// }

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr('x', d => newXScale(d[chosenXAxis]))
        .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}



// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))
    return circlesGroup;

}



// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, chosenXAxis, circlesGroup) {
    var label
    var label2
    if (chosenXAxis === "Poverty") {
        label = "Poverty:";
    } else {
        label = "Age:";
    }




    if (chosenYAxis === "Healthcare") {
        label2 = "healthcare:";
    } else {
        label2 = "obesity:";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-6, 0])
        .html(function(d) {
            return (`${d.state}<br>${label}${d[chosenYAxis]}<br>${label2}${d[chosenXAxis]}${d.abbr}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;


}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/js/data.csv").then(function(censusdata, err) {
    if (err) throw err;

    // parse data
    censusdata.forEach(function(data) {
        data.poverty = +data.poverty;
        // data.abbr = +data.abbr;
        data.age = +data.age;
        // data.state = +data.state;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusdata, chosenXAxis);
    var yLinearScale = yScale(censusdata, chosenYAxis);

    // Create y scale function
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Create initial axis functions


    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusdata)
        .enter()
        .append("circle")
        .classed('stateCircle', true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))


    .attr("r", 30)


    .attr("opacity", ".5");
    var textGroup = chartGroup.selectAll('.stateText')
        .data(censusdata)
        .enter()
        .append('text')
        .classed('stateText', true)
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis]))
        .attr('dy', 3)
        .attr('font-size', '10px')
        .text(function(d) { return d.abbr });

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 10+ margin.top})`)


    var sgroup = chartGroup.append("g")
        .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);



    var hairLengthLabel = labelsGroup.append("text")
        .classed('aText', true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)

    .text("Poverty");

    var albumsLabel = labelsGroup.append("text")
        .classed('aText', true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age");

    // append y axis
    var helthcare = sgroup.append("text")
        .classed('aText', true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("value", "healthcare")
        .attr("transform", "rotate(-90)")
        .attr('dy', '1em')
        .classed("active", true)
        .text("Healthcare");


    var obesity = sgroup.append("text")
        .classed('aText', true)


    .attr("y", 0 - 40)
        .attr("x", 0)
        .attr('dy', '1em')
        .attr("value", "obesity")
        .attr("transform", "rotate(-90)")
        .classed("inactive", true)
        .text("obesity");



    // updateToolTip function above csv import
    // var circlesGroup = updateToolTip(chosenYAxis, chosenXAxis, circlesGroup);
    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusdata, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    albumsLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    hairLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    albumsLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    hairLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    sgroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value")
            if (value !== chosenYAxis) {
                // replaces chosenXAxis with value
                chosenYAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(censusdata, chosenYAxis);

                // updates x axis with transition
                // yAxis = renderAxes(yLinearScale, yAxis);
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
                // updates circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesity
                        .classed("active", true)
                        .classed("inactive", false);
                    helthcare
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    obesity
                        .classed("active", false)
                        .classed("inactive", true);
                    helthcare
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        })

}).catch(function(error) {
    console.log(error);
});