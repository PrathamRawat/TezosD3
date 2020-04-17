
let delegateQuery = async function(limit) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'account_id');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'delegate_value');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'delegate_value', conseiljs.ConseilOperator.ISNULL, [], true);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, "account_id", conseiljs.ConseilFunction.count);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "count_account_id", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'accounts', query);

    d3.select("#mostDelegatedLink").attr("href", shareReport("mainnet", "accounts", query))

    graphSVG = d3.select("#topDelegates");

    graphAxis = d3.select("#topDelegatesAxis");

    seperateAxisDynamicBarChartGenerator(500, 25, graphSVG, graphAxis, result, "delegate_value", "count_account_id");

    return result;                                              
}

delegateQuery(100);
