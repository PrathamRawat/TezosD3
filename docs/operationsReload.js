d3.select("#reload").on("click", function() {
    tphQuery(new Date(document.getElementById("hourlyDate").value).getTime());
    gphQuery(new Date(document.getElementById("hourlyDate").value).getTime());
    fphQuery(new Date(document.getElementById("hourlyDate").value).getTime());
    aphQuery(new Date(document.getElementById("dailyDate").value).getTime());
    ophQuery(new Date(document.getElementById("dailyDate").value).getTime());
});