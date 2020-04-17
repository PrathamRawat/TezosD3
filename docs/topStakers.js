let stakeQuery = async function(limit) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'pkh');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'staking_balance');
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "staking_balance", conseiljs.ConseilSortDirection.DESC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, limit);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'delegates', query);

    d3.select("#topStakersLink").attr("href", shareReport("mainnet", "delegates", query))

    graphSVG = d3.select("#topStakers");

    graphAxis = d3.select("#topStakersAxis");

    seperateAxisDynamicBarChartGenerator(500, 25, graphSVG, graphAxis, result, "pkh", "staking_balance");

    return result;
}

stakeQuery(100);
