d3.select("#reload").on("click", function() {
    contractQuery(document.getElementById("number").value);
    invokedQuery(document.getElementById("number").value, Math.round(new Date().getTime()) - 2929746000);
});