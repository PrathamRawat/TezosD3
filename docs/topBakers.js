console.log("nice");


let bakerQuery = async function() {
    let query = conseiljs.ConseilQueryBuilder.blankQuery();
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'baker');
    query = conseiljs.ConseilQueryBuilder.addFields(query, 'timestamp');
    query = conseiljs.ConseilQueryBuilder.addPredicate(query, 'timestamp', conseiljs.ConseilOperator.AFTER, [Math.round(new Date().getTime() / 1000) - 2929746]);
    // query = conseiljs.ConseilQueryBuilder.addOrdering(query, "", conseiljs.ConseilSortDirection.DESC);
    // query = conseiljs.ConseilQueryBuilder.setLimit(query, 1000);
    // query = conseiljs.ConseilQueryBuilder.a

    const result = await conseiljs.ConseilDataClient.executeEntityQuery(conseilServer, 'tezos', conseilServer.network, 'blocks', query);

    console.log(result);

    preliminaryData = result.map(function(x) {return x.baker});

    data = [[preliminaryData[0], 1]];

    for(var i = 1; i < preliminaryData.length; i++) {
        for(var c = 0; c < data.length; c++) {
            if(preliminaryData[i] == data[c][0]) {
                data[c][1] += 1;
                break;
            } else if(c == data.length - 1) {
                console.log("d");
                
                data.push([preliminaryData[i], 1]);
            }
        }
    }

    function sortFunction(a, b) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (a[1] < b[1]) ? -1 : 1;
        }
    }

    data.sort(sortFunction);
    
    console.log(data);
    
    bakerCount = data.map(function(x) {return x[1]});

    // set the dimensions and margins of the graph
    var width = 800
    height = 800
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#topBakers")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    var color = d3.scaleOrdinal()
    .domain(bakerCount)
    .range(d3.schemeSet2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    var data_ready = pie(d3.entries(bakerCount))
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
    .selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d){ return data[d.data.key][0]})
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 17)

    // x = d3.scaleLinear()
    //     .domain([0, d3.max(bakerCount)])
    //     .range([0, width])

    // y = d3.scaleBand()
    //     .domain(d3.range(data.length))
    //     .range([0, 25 * data.length]);

    // const svg = d3.select("#topBakers")
    //     .attr("width", width)
    //     .attr("height", y.range()[1])
    //     .attr("font-family", "serif")
    //     .attr("font-size", "10")
    //     .attr("text-anchor", "end");
    
    // const bar = svg.selectAll("g")
    //     .data(bakerCount)
    //     .join("g")
    //       .attr("transform", (d, i) => `translate(0,${y(i)})`);

    // bar.append("rect")
    //     .attr("fill", "red")
    //     .attr("width", x)
    //     .attr("height", y.bandwidth() - 1);

    // bar.append("text")
    //     .attr("fill", "white")
    //     .attr("x", d => x(d) - 3)
    //     .attr("y", y.bandwidth() / 2)
    //     .attr("dy", "0.35em")
    //     .text(d => d);

    return result;
}

bakerQuery();