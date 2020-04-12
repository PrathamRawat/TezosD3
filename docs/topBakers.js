

let bakerQuery = async function(limit, date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'baker');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'hash');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.AFTER, [Math.round(new Date().getTime() / 1000) - 2929746]);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, "hash", conseiljs.ConseilFunction.COUNT);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "count_hash", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    console.log(result);

    preliminaryData = result.map(function(x) {return x.baker});

    data = [[preliminaryData[0], 1]];
    
    // console.log(data);
    
    bakerCount = data.map(function(x) {return x[1]});

    x = d3.scaleLinear()
        .domain([0, d3.max(bakerCount)])
        .range([0, width])

    y = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, 25 * data.length]);

    const svg = d3.select("#topBakers")
        .attr("width", width)
        .attr("height", y.range()[1])
        .attr("font-family", "serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");
    
    const bar = svg.selectAll("g")
        .data(bakerCount)
        .join("g")
          .attr("transform", (d, i) => `translate(0,${y(i)})`);

    bar.append("rect")
        .attr("fill", "red")
        .attr("width", x)
        .attr("height", y.bandwidth() - 1);

    bar.append("text")
        .attr("fill", "white")
        .attr("x", d => x(d) - 3)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d);

    return result;
}

bakerQuery(20, 5);