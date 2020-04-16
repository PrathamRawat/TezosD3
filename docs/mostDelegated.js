
let delegateQuery = async function(limit) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'account_id');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'delegate_value');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'delegate_value', conseiljs.ConseilOperator.ISNULL, [], true);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, "account_id", conseiljs.ConseilFunction.count);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "count_account_id", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'accounts', query);

    console.log(result);

    data = result.map(function(x) {return x.count_account_id});
    accounts = result.map(function(x) {return x.delegate_value});
    
    console.log(data);
    
    // bakerCount = data.map(function(x) {return x[1]});
    

    y = d3.scaleLinear()
        .domain([0, data[0]])
        .range([0, height])

    yScale = d3.scaleLinear()
        .domain([0, data[0]])
        .range([0, -height])

    x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, 25 * data.length]);

    const svg = d3.select("#topDelegates")
        .attr("height", height)
        .attr("width", x.range()[1])
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");

    svg.selectAll("*").remove();

    const bar = svg.selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(${x(i) + 100}, ${500 - y(d)})`);

    bar.append("rect")
        .attr("fill", "purple")
        .attr("width", x.bandwidth() - 1)
        .attr("height", 0);

    bar.selectAll("rect")
        .transition()
        .duration(800)
        .attr("height", y);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    bar.on("mousemove", function(d, i){
        tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html((d) + " Delegated Accounts<br>" + (accounts[i]));
    })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

    const yAxis = d3.axisLeft()
                    .scale(yScale);

    const axisSVG = d3.select("#topDelegatesAxis")
        .attr("height", height)
        .attr("width", 60);

    axisSVG.selectAll("*").remove();

    axisSVG.append("g").attr("transform", "translate(60, 500)").style("color", "black").call(yAxis);

    return result;                                              
}

delegateQuery(100);
