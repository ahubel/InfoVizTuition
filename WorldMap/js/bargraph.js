var barGraph;
var heightGraph = width * 0.2;

setBarGraph(width, heightGraph);

function setBarGraph(width, height) {    
    barGraph = d3.select("#bargraph").append("svg").attr("width", width).attr("height", heightGraph).append("g");    
}