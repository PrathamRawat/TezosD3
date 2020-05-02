d3.select("#oneDay").on("click", function() {
    clearAllGraphs()
    prioritybphQuery(new Date().getTime() - 86400000);
    pbeQuery(new Date().getTime() - 86400000);
    bphQuery(new Date().getTime() - 86400000);
});

d3.select("#oneWeek").on("click", function() {
    clearAllGraphs()
    prioritybphQuery(new Date().getTime() - 604800000);
    pbeQuery(new Date().getTime() - 604800000);
    bphQuery(new Date().getTime() - 604800000);
});

d3.select("#oneMonth").on("click", function() {
    clearAllGraphs()
    prioritybphQuery(new Date().getTime() - 2629746000);
    pbeQuery(new Date().getTime() - 2629746000);
    bphQuery(new Date().getTime() - 2629746000);
});

d3.select("#oneYear").on("click", function() {
    clearAllGraphs()
    prioritybphQuery(new Date().getTime() - 31556952000);
    pbeQuery(new Date().getTime() - 31556952000);
    bphQuery(new Date().getTime() - 31556952000);
});

d3.select("#allTime").on("click", function() {
    clearAllGraphs()
    prioritybphQuery(1530316800000);
    pbeQuery(1530316800000);
    bphQuery(1530316800000);
});