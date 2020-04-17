

const seperateAxisStaticBarChartGenerator = function(height, width, graphSVGElement, axisSVGElement, queryResult, xAxisKey, yAxisKey, staticSVG) {
    
    // Create an Array for each Axis
    xAxisData = queryResult.map(d => d[xAxisKey]);
    yAxisData = queryResult.map(d => d[yAxisKey]);

    // Create a D3 Linear Scale for the Y-Axis
    yScale = d3.scaleLinear()
        .domain([0, d3.max(yAxisData)])
        .range([0, height]);

    // Create a D3 Linear Scale for the Y-Axis Label
    // We negate the height here so that the bars are drawn correctly
    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(yAxisData)])
        .range([0, -height]);

    // Create a D3 Band Scale for the X-Axis
    // A static SVG will have a fixed size no matter the number of elements
    // Here, the width parameter is treated as the width of each bar in the graph
    xScale = d3.scaleBand()
        .domain(d3.range(xAxisData.length))
        .range([0, width / xAxisData.length]);

    // Setup SVG element attributes 
    graphSVGElement
        .attr("height", height)
        .attr("width", width)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");
    
    // Create selection for bar graph bars
    const bar = graphSVGElement.selectAll("g")
        .data(yAxisData) //Attach bars to Y-Axis data
        .join("g")
            .attr("transform", (d, i) => `translate(${xScale(i) + 115}, ${500 - yScale(d)})`);

    // Add a rectangle to the bar element
    bar.append("rect")
        .attr("fill", "purple")
        .attr("width", xScale.bandwidth() - 1) // Sets a padding of one pixel between bars
        .attr("height", yScale);
    
    // // Create startup transition
    // bar.selectAll("rect")
    //     .transition()
    //     .duration(800) // 800 milliseconds to transition from height 0 to the correct height
    //     .attr("height", yScale);

    // Create a Y-Axis Scale
    const yAxis = d3.axisLeft()
        .scale(yAxisScale);

    // Prepare the Y-Axis Element
    axisSVGElement
        .attr("height", height)
        .attr("class", "axis");

    // Attach the axis to the SVG Element
    axisSVGElement
        .append("g")
            .attr("transform", "translate(100, 500)")
            .style("color", "black")
            .call(yAxis);
    
    // Set up tooltip for graph data viewing
    const tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // Add event listener for tooltip
    bar.on("mousemove", function(d, i){
        tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d) + "<br>" + (xAxisData[i]));
    })
        .on("mouseout", function(d){ tooltip.style("display", "none");
    });
}

const seperateAxisDynamicBarChartGenerator = function(height, barWidth, graphSVGElement, axisSVGElement, queryResult, xAxisKey, yAxisKey, staticSVG) {
    
    // Create an Array for each Axis
    xAxisData = queryResult.map(d => d[xAxisKey]);
    yAxisData = queryResult.map(d => parseInt(d[yAxisKey]));

    // Create a D3 Linear Scale for the Y-Axis
    yScale = d3.scaleLinear()
        .domain([0, d3.max(yAxisData)])
        .range([0, height]);    

    // Create a D3 Linear Scale for the Y-Axis Label
    // We negate the height here so that the bars are drawn correctly
    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(yAxisData)])
        .range([0, -height]);

    // Create a D3 Band Scale for the X-Axis
    // A non-static SVG will change size depending on the number of elements in the X-Axis
    // Here, the width parameter is treated as the width of each bar in the graph
    xScale = d3.scaleBand()
        .domain(d3.range(xAxisData.length))
        .range([0, barWidth * xAxisData.length]);

    // Setup SVG element attributes 
    graphSVGElement
        .attr("height", height)
        .attr("width", xScale.range()[1])
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");
    
    // Create selection for bar graph bars
    const bar = graphSVGElement.selectAll("g")
        .data(yAxisData) //Attach bars to Y-Axis data
        .join("g")
            .attr("transform", (d, i) => `translate(${xScale(i) + 115}, ${500 - yScale(d)})`);

    // Add a rectangle to the bar element
    bar.append("rect")
        .attr("fill", "purple")
        .attr("width", xScale.bandwidth() - 1) // Sets a padding of one pixel between bars
        .attr("height", yScale);
    
    // // Create startup transition
    // bar.selectAll("rect")
    //     .transition()
    //     .duration(800) // 800 milliseconds to transition from height 0 to the correct height
    //     .attr("height", yScale);

    // Create a Y-Axis Scale
    const yAxis = d3.axisLeft()
        .scale(yAxisScale);

    // Prepare the Y-Axis Element
    axisSVGElement
        .attr("height", height)
        // .attr("width", 60)
        .attr("class", "axis");

    // Attach the axis to the SVG Element
    axisSVGElement
        .append("g")
            .attr("transform", "translate(100, 500)")
            .style("color", "black")
            .call(yAxis);
    
    // Set up tooltip for graph data viewing
    const tooltip = d3.select("body").append("div").attr("class", "toolTip");

    // Add event listener for tooltip
    bar.on("mousemove", function(d, i){
        tooltip
            .style("left", d3.event.pageX - 50 + "px")
            .style("top", d3.event.pageY - 70 + "px")
            .style("display", "inline-block")
            .html((d) + "<br>" + (xAxisData[i]));
    })
        .on("mouseout", function(d){ tooltip.style("display", "none");
    });
}