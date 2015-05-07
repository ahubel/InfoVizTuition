var barWidth = document.getElementById('bargraph').offsetWidth - document.getElementById('label-us').offsetWidth;
var barHeight = 30;

var svgUS = d3.select("#bar-us").append("svg").attr("width", barWidth).attr("height", barHeight);
var barUS = svgUS.append("rect")//
.attr("width", barWidth).attr("height", barHeight)//
.attr("style", "fill: #790647;");

var svgOther = d3.select("#bar-other").append("svg").attr("width", barWidth).attr("height", barHeight);
var barOther = svgOther.append("rect")//
.attr("width", 0).attr("height", barHeight);

function changeBar(d) {
    var name = d.properties.name;
    var value = d.properties.value;
    var color = d.properties.color;
    var w = barWidth * (value / tuitionsMax);
    
    d3.select("#label-other p").text(name);
    barOther.attr("style", "fill: " + color + ";");
    barOther.attr("width", w);
}

console.log();