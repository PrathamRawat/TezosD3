
let pbeQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'kind');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    // query = conseiljs.ConseilQueryBuilder.addFields(query, 'block_level');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (3600000 * 168)]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'kind', conseiljs.ConseilOperator.EQ, ['endorsement']);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, 'kind', conseiljs.ConseilFunction.count);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'operations', query);

    d3.select("#perBlockEndorsementsLink").attr("href", shareReport("mainnet", "operations", query))

    console.log(result);

    label = [];
    timestamps = [];
    values = [];
    data = [];

    now = date + (3600000 * 168);

    for(var time = new Date(date).getTime(); time < now; time += 3600000) {
        label.push(new Date(time));
        timestamps.push(time);
        values.push(0)
    }

    console.log(timestamps);
    
    for(var r = 0; r < result.length; r++) {
        for(var t = label.length - 1; t > 0; t--) {
            if(parseInt(result[r].timestamp) > parseInt(label[t].getTime())) {
                values[t] += parseInt(result[r].count_kind);
                break;
            }
        }
    }  

    for(var x = 0; x < values.length; x++) {
        data.push({date : parseInt(label[x].getTime()), value : parseInt(values[x])});
    }

    data.pop()
    data.shift()

    // console.log(data);
    
    svg = d3.select("#pbe");

    label = d3.select("#pbeLabel");

    temporalLineGraphGenerator(500, 1200, svg, label, data, "date", "value");

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

pbeQuery(now - (3600000 * 168));