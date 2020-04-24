
let prioritybphQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'hash');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (3600000 * 168)]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'priority', conseiljs.ConseilOperator.EQ, [0]);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    d3.select("#priorityBlocksPerHourLink").attr("href", shareReport("mainnet", "blocks", query))

    query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'hash');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (3600000 * 168)]);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result2 = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    // console.log(result);

    label = [];
    timestamps = [];
    value = [];
    data = [];

    value2 = [];
    data2 = [];

    now = date + (3600000 * 168);

    for(var time = new Date(date).getTime(); time < now; time += 3600000) {
        label.push(new Date(time));
        timestamps.push(time);
        value.push(0)
        value2.push(0)
    }
    
    for(var r = 0; r < result.length; r++) {
        for(var t = label.length - 1; t > 0; t--) {
            if(parseInt(result[r].timestamp) > parseInt(label[t].getTime())) {
                value[t] += 1;
                break;
            }
        }
    }  

    for(var r = 0; r < result2.length; r++) {
        for(var t = label.length - 1; t > 0; t--) {
            if(parseInt(result2[r].timestamp) > parseInt(label[t].getTime())) {
                value2[t] += 1;
                break;
            }
        }
    } 

    for(var x = 0; x < value.length; x++) {
        data.push({date : label[x].getTime(), value : parseInt(value[x])});
        data2.push({date : label[x].getTime(), value : parseInt(value2[x])});
    }

    svg = d3.select("#priorityBPH");

    axis = d3.select("#priorityBPHAxis");

    // temporalLineGraphGenerator(500, 1200, svg, label, data, "date", "value");

    seperateAxisStaticBarChartGenerator(500, 1200, svg, axis, data, "date", "value");

    xTooltip = function(d, i) {
        return new Date(timestamps[i])
    }

    yTooltip = function(d, i) {
        return d + " Blocks per Hour"
    }

    barGraphFloatingTooltipGenerator(svg, xTooltip, yTooltip)

    // labelOne = d3.select("#priorityLabel");
    // labelTwo = d3.select("#nonpriorityLabel") 

    // scale = temporalLineGraphGenerator(500, 1200, svg, labelOne, data, "date", "value", null, color = "red");

    // console.log(typeof(scale));

    // temporalLineGraphGenerator(500, 1200, svg, labelTwo, data2, "date", "value", yScale = scale, "blue")

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

prioritybphQuery(now - (3600000 * 168));
