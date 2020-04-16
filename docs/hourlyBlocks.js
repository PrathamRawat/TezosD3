
let bphQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'hash');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (3600000 * 168)]);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    console.log(result);

    label = [];
    timestamps = [];
    values = [];
    data = [];

    // now = new Date();
    // now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
    // now.setMinutes(0, 0, 0);

    // now = now.getTime();

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
                values[t] += 1;
                break;
            }
        }
    }  

    for(var x = 0; x < values.length; x++) {
        data.push({date : label[x].getTime(), values : parseInt(values[x])});
    }

    console.log(data);
    
    values.pop()
    timestamps.pop()
    data.pop()
    label.pop()

    // bakerCount = data.map(function(x) {return x[1]});

    height = 500;
    

    var y = d3.scaleLinear()
      .domain([0, d3.max(values) + 5])
      .range([ 0, height ]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(values) + 5])
      .range([ 0, -height]);

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, 1200 ]);

    const svg = d3.select("#bph")
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
            .y(function(d) { return y(d.values) }))
        .attr("transform", "translate(25, 500),scale(1, -1)")

    const yAxis = d3.axisLeft()
                    .scale(yScale);

    svg.append("g").attr("transform", "translate(25, 500)").style("color", "black").call(yAxis);

    point = svg.append("circle")

    display = d3.select("#bphLabel");
    svg.on("mousemove", function() {
        date = x.invert(d3.event.clientX - d3.event.target.getBoundingClientRect().left) 
        date.setHours(date.getHours() + Math.round(date.getMinutes()/60.0));
        date.setMinutes(0, 0, 0);
        
        d = timestamps.indexOf(date.getTime());

        point
            .attr("cx", x(date.getTime()) - 3)
            .attr("cy", 500 - y(values[d - 4]))
            .attr("r", 5)
            .attr("fill", "purple")

        display.html(date.toString() + " " + (values[d - 4]) + " Blocks per Hour")
    });

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

bphQuery(now - (3600000 * 168));
