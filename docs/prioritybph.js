
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

    console.log(data);
    console.log(data2);
    
    // Remove last value in the case of an unfinished hour
    value.pop()
    timestamps.pop()
    data.pop()
    label.pop()
    data2.pop()
    value2.pop()

    height = 500;
    
    var y = d3.scaleLinear()
        .domain([0, d3.max(value) + 5])
        .range([ 0, height]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(value) + 5])
        .range([ 0, -height]);

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, 1200 ]);

    const svg = d3.select("#priorityBPH")
        .attr("height", height)
        .attr("width", x.range()[1] + 25)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");

    svg.selectAll("*").remove();

    svg.append("g")
        .attr("transform", "translate(25," + (height - 25) + ")")
        .style("color", "black")
        .call(d3.axisBottom(x));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) }))
        .attr("transform", "translate(25, 500),scale(1, -1)")

    svg.append("path")
        .datum(data2)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) }))
        .attr("transform", "translate(25, 500),scale(1, -1)")

    const yAxis = d3.axisLeft()
                    .scale(yScale);

    svg.append("g").attr("transform", "translate(25, 500)").style("color", "black").call(yAxis);

    dot = svg.append("circle")
    dot2 = svg.append("circle")

    chartLabel = d3.select("#priorityLabel");
    chartLabel2 = d3.select("#nonpriorityLabel")
    svg.on("mousemove", function() {
        date = x.invert(d3.event.clientX - d3.event.target.getBoundingClientRect().left) 
        date.setHours(date.getHours() + Math.round(date.getMinutes()/60.0));
        date.setMinutes(0, 0, 0);
        
        d = timestamps.indexOf(date.getTime());

        dot
            .attr("cx", x(date.getTime()) - 3)
            .attr("cy", 500 - y(value[d - 4]))
            .attr("r", 5)
            .attr("fill", "purple")

        dot2
            .attr("cx", x(date.getTime()) - 3)
            .attr("cy", 500 - y(value2[d - 4]))
            .attr("r", 5)
            .attr("fill", "blue")

        chartLabel.html(date.toString() + " " + (value[d - 4]) + " Priority Blocks per Hour")
        chartLabel2.html(date.toString() + " " + (value2[d - 4]) + " Non-Priority Blocks per Hour")
    });

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

prioritybphQuery(now - (3600000 * 168));
