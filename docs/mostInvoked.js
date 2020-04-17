
let invokedQuery = async function(limit, date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'destination');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'operation_group_hash');
    // query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'source', conseiljs.ConseilOperator.STARTSWITH, ["KT1"]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'kind', conseiljs.ConseilOperator.EQ, ["transaction"]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'status', conseiljs.ConseilOperator.EQ, ["applied"]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.AFTER, [date]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'parameters', conseiljs.ConseilOperator.ISNULL, [], true);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, "operation_group_hash", conseiljs.ConseilFunction.count);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "count_operation_group_hash", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'operations', query);

    d3.select("#mostInvokedLink").attr("href", shareReport("mainnet", "operations", query))

    console.log(result);

    data = result.map(function(x) {return x.count_operation_group_hash});
    contract_source = result.map(function(x) {return x.destination});
    
    // bakerCount = data.map(function(x) {return x[1]});

    height = 500;

    y = d3.scaleLinear()
        .domain([0, data[0]])
        .range([0, height])

    yScale = d3.scaleLinear()
        .domain([0, data[0]])
        .range([0, -height])

    x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, 25 * data.length]);

    const svg = d3.select("#topInvoked")
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
        .html((d) + " Invocations<br>" + (contract_source[i]));
    })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

    const yAxis = d3.axisLeft()
                    .scale(yScale);

    const axisSVG = d3.select("#topInvokedAxis")
        .attr("height", height)
        .attr("width", 60);

    axisSVG.selectAll("*").remove();

    axisSVG.append("g").attr("transform", "translate(60, 500)").style("color", "black").call(yAxis);

    return result;                                              
}

invokedQuery(100, Math.round(new Date().getTime()) - 2929746000);

d3.select("#invokedReload").on("click", function() {
    invokedQuery(document.getElementById("invokedNumber").value, new Date(document.getElementById("invokedDate").value));
});