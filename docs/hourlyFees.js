
let fphQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'fee');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'fee', conseiljs.ConseilOperator.GT, [0]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, new Date().getTime()]);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, 'fee', conseiljs.ConseilFunction.sum);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'operations', query);

    d3.select("#gasPerHourLink").attr("href", shareReport("mainnet", "operations", query))

    console.log(result);

    label = [];
    timestamps = [];
    fees = [];
    data = [];

    now = new Date().getTime()

    for(var time = new Date(date).getTime(); time < now; time += 3600000) {
        label.push(new Date(time));
        timestamps.push(time);
        fees.push(0)
    }

    console.log(timestamps);
    
    for(var r = 0; r < result.length; r++) {
        for(var t = label.length - 1; t > 0; t--) {
            if(parseInt(result[r].timestamp) > parseInt(label[t].getTime())) {
                fees[t] += parseInt(result[r].sum_fee);
                break;
            }
        }
    }  

    for(var x = 0; x < fees.length; x++) {
        data.push({date : label[x].getTime(), values : parseInt(fees[x] / 1000000)});
    }

    svg = d3.select("#feesPerHour");

    axis = d3.select("#fphAxis");

    seperateAxisPrioritizedBarChartGenerator(500, 1200, svg, axis, data, "date", "values");

    xTooltip = function(d, i) {
        return new Date(timestamps[i])
    }

    yTooltip = function(d, i) {
        return d + " ꜩ in Fees Paid per Hour"
    }

    barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip)

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

fphQuery(now - (3600000 * 168));
