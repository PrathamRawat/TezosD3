d3.select("#reload").on("click", function() {
    prioritybphQuery(new Date(document.getElementById("date").value).getTime());
    pbeQuery(new Date(document.getElementById("date").value).getTime());
    bphQuery(new Date(document.getElementById("date").value).getTime());
});