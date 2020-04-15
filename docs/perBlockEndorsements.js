
let pbeQuery = async function(date) {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'kind');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'block_level');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.BETWEEN, [date, date + (3600000 * 168)]);
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'kind', conseiljs.ConseilOperator.EQ, ['endorsement']);
    query = conseiljs.ConseilQueryBuilder.addAggregationFunction(query, 'kind', conseiljs.ConseilFunction.count);
    query = conseiljs.ConseilQueryBuilder.addOrdering(query, "block_level", conseiljs.ConseilSortDirection.ASC);
    query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000000000);

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'operations', query);

    // console.log(result);

    blklevel = result.map(d => d.block_level);
    endorsements = result.map(d => d.count_kind);
    data = [];

    for(var x = 0; x < endorsements.length; x++) {
        data.push({level : blklevel[x], endorsements : endorsements[x]});
    }

    console.log(blklevel);
    
    endorsements.pop()
    data.pop()
    blklevel.pop()

    // bakerCount = data.map(function(x) {return x[1]});

    height = 500;
    

    var y = d3.scaleLinear()
      .domain([0, d3.max(endorsements)])
      .range([ 0, height ]);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(endorsements)])
      .range([ 0, -height]);

    var x = d3.scaleLinear()
        .domain([d3.min(blklevel), d3.max(blklevel)])
        .range([ 0, 20000]);

    const svg = d3.select("#pbe")
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
            .x(function(d) { return x(d.level) })
            .y(function(d) { return y(d.endorsements) }))
        .attr("transform", "translate(25, 500),scale(1, -1)")

    const yAxis = d3.axisLeft()
                    .scale(yScale);

    svg.append("g").attr("transform", "translate(25, 500)").style("color", "black").call(yAxis);

    circle = svg.append("circle")

    readout = d3.select("#pbeLabel");
    svg.on("mousemove", function() {
        level = x.invert(d3.event.clientX - d3.event.target.getBoundingClientRect().left) 
        level = Math.round(level);

        d = blklevel.indexOf(level);

        circle
            .attr("cx", x(blklevel[d]) - 3)
            .attr("cy", 500 - y(endorsements[d - 14]))
            .attr("r", 5)
            .attr("fill", "purple")

        readout.html("Block Level " + level + ", " + (endorsements[d - 4]) + " Endorsements")
    });

    return result;                                              
}

now = new Date();
now.setHours(now.getHours() + Math.round(now.getMinutes()/60));
now.setMinutes(0, 0, 0);

now = now.getTime();

pbeQuery(now - (3600000 * 168));

d3.select("#bphReload").on("click", function() {
    pbeQuery(new Date(document.getElementById("bphDate").endorsements).getTime());
});