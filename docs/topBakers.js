// import { ConseilQueryBuilder, ConseilOperator, ConseilDataClient, ConseilSortDirection } from 'conseiljs';

// const d3 = require("d3@5");

let delegateQuery = async function() {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'delegated_balance');
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "delegated_balance", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 20);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'delegates', query);

    console.log(result);

    data = result.map(function(x) {return x.delegated_balance});

    width = 800;
    
    console.log(data);
    

    x = d3.scaleLinear()
        .domain([0, d3.max(data)])
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
        .data(data)
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

delegateQuery();