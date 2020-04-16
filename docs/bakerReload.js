d3.select("#reload").on("click", function() {
    stakeQuery(document.getElementById("number").value);
    bakerQuery(document.getElementById("number").value, Math.round(new Date().getTime()) - 2929746000);
    delegateQuery(document.getElementById("number").value);
});