
let bphQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'hash');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (3600000 * 168)]);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    d3.select("#blocksPerHourLink").attr("href", shareReport("mainnet", "blocks", query))

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
    
    for(var r = 0; r < result.length; r++) {
        for(var t = label.length - 1; t > 0; t--) {
            if(parseInt(result[r].timestamp) > parseInt(label[t].getTime())) {
                values[t] += 1;
                break;
            }
        }
    }  

    for(var x = 0; x < values.length; x++) {
        data.push({date : label[x].getTime(), value : parseInt(values[x])});
    }

    svg = d3.select("#bph");

    axis = d3.select("#bphAxis");

    label = d3.select("#bphLabel");

    // temporalLineGraphGenerator(500, 1200, svg, label, data, "date", "value");

    seperateAxisStaticBarChartGenerator(500, 1200, svg, axis, data, "date", "value");

    xTooltip = function(d, i) {
        return new Date(timestamps[i])
    }

    yTooltip = function(d, i) {
        return d + " Blocks per Hour"
    }

    barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip)

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

bphQuery(now - (3600000 * 168));
