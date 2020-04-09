// import { ConseilQueryBuilder, ConseilOperator, ConseilDataClient, ConseilSortDirection } from 'conseiljs';

// const d3 = require("d3@5");
const tezosNode = '...';
const conseilServer = { url: 'https://conseil-prod.cryptonomic-infra.tech:443', apiKey: 'f86ab59d-d2ea-443b-98e2-6c0785e3de8c', network: 'mainnet' };

let accountQuery = async function() {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'balance');
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "balance", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 20);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'accounts', query);

    console.log(result);

    data = result.map(function(x) {return x.balance});

    width = 800;
    
    console.log(data);
    

    x = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, width])

    y = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([0, 25 * data.length]);

    const svg = d3.select("#topAccounts")
        .attr("width", width)
        .attr("height", y.range()[1])
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");
    
    const bar = svg.selectAll("g")
        .data(data)
        .join("g")
          .attr("transform", (d, i) => `translate(0,${y(i)})`);

    bar.append("rect")
        .attr("fill", "purple")
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

accountQuery();