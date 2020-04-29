d3.select("#oneDay").on("click", function() {
    tphQuery(new Date().getTime() - 86400000);
    gphQuery(new Date().getTime() - 86400000);
    fphQuery(new Date().getTime() - 86400000);
    apdQuery(new Date().getTime() - 86400000);
    opdQuery(new Date().getTime() - 86400000);
});

d3.select("#oneWeek").on("click", function() {
    tphQuery(new Date().getTime() - 604800000);
    gphQuery(new Date().getTime() - 604800000);
    fphQuery(new Date().getTime() - 604800000);
    apdQuery(new Date().getTime() - 604800000);
    opdQuery(new Date().getTime() - 604800000);
});

d3.select("#oneMonth").on("click", function() {
    tphQuery(new Date().getTime() - 2629746000);
    gphQuery(new Date().getTime() - 2629746000);
    fphQuery(new Date().getTime() - 2629746000);
    apdQuery(new Date().getTime() - 2629746000);
    opdQuery(new Date().getTime() - 2629746000);
});

d3.select("#oneYear").on("click", function() {
    tphQuery(new Date().getTime() - 31556952000);
    vphQuery(new Date().getTime() - 31556952000);
    gphQuery(new Date().getTime() - 31556952000);
    fphQuery(new Date().getTime() - 31556952000);
    apdQuery(new Date().getTime() - 31556952000);
    opdQuery(new Date().getTime() - 31556952000);
});

d3.select("#allTime").on("click", function() {
    tphQuery(1530316800);
    vphQuery(1530316800);
    gphQuery(1530316800);
    fphQuery(1530316800);
    apdQuery(1530316800);
    opdQuery(1530316800);
});