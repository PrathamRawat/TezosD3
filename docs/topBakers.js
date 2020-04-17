

let bakerQuery = async function(limit, date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'baker');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'hash');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.AFTER, [date]);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, "hash", conseiljs.ConseilFunction.count);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "count_hash", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    d3.select("#topBakersLink").attr("href", shareReport("mainnet", "blocks", query))

    graphSVG = d3.select("#topBakers");

    graphAxis = d3.select("#topBakersAxis");

    seperateAxisDynamicBarChartGenerator(500, 25, graphSVG, graphAxis, result, "baker", "count_hash");

    return result;                                              
}

bakerQuery(100, Math.round(new Date().getTime()) - 2929746000);

d3.select("#blockReload").on("click", function() {
    bakerQuery(document.getElementById("number").value, new Date(document.getElementById("blockDate").value).getTime());
});