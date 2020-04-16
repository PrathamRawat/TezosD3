
let apdQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'kind');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'kind', conseiljs.ConseilOperator.EQ, ['activate_account']);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (86400000 * 365)]);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "timestamp", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'operations', query);

    // console.log(result);

    label = [];
    times = [];
    activations = [];
    data = [];

    now = date + (86400000 * 365);

    // now = new Date().getTime()
    // start = new Date(date)
    // start.setHours(0, 0, 0, 0)

    for(var time = date; time < now; time += 86400000) {
        value = new Date(time);
        value.setHours(0, 0, 0, 0)
        label.push(value);
        times.push(value.getTime());
        activations.push(0)
    }

    // console.log(label);
    
    for(var r = 0; r < result.length; r++) {
        for(var t = label.length - 1; t > 0; t--) {
            if(parseInt(result[r].timestamp) > parseInt(label[t].getTime())) {
                activations[t] += 1;
                break;
            }
        }
    }  

    for(var x = 0; x < activations.length; x++) {
        data.push({date : label[x].getTime(), values : parseInt(activations[x])});
    }

    console.log(data);
    
    activations.pop()
    times.pop()
    data.pop()
    label.pop()

    height = 500;

    var y = d3.scaleLinear()
      .domain([0, d3.max(activations) + 5])
      .range([ 25, height ]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(activations) + 5])
      .range([ -25, -height]);

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([ 0, 1200 ]);

    const svg = d3.select("#activationsPerDay")
        .attr("height", height)
        .attr("width", x.range()[1] + 25)
        .attr("font-family", "sans-serif")
        .attr("font-size", "10")
        .attr("text-anchor", "end");

    svg.selectAll("*").remove();

    svg.append("g")
        .attr("transform", "translate(40," + (height - 25) + ")")
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
        .attr("transform", "translate(40, 500),scale(1, -1)")

    const yAxis = d3.axisLeft()
                    .scale(yScale);

    svg.append("g").attr("transform", "translate(40, 500)").style("color", "black").call(yAxis);

    pointer = svg.append("circle")

    show = d3.select("#apdLabel");
    svg.on("mousemove", function() {
        date = x.invert(d3.event.clientX - d3.event.target.getBoundingClientRect().left + 40) 
        date.setHours(0, 0, 0, 0);

        d = times.indexOf(date.getTime());

        pointer
            .attr("cx", x(date.getTime()))
            .attr("cy", 500 - y(activations[d - 12]))
            .attr("r", 5)
            .attr("fill", "purple")

        show.html((activations[d - 12]) + " Activations on " + date.toDateString())
    });

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

apdQuery(now - (86400000 * 365));
