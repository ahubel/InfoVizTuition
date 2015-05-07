var barWidth = document.getElementById('bargraph').offsetWidth - document.getElementById('label-us').offsetWidth;
var barHeight = 30;
//
var svgUS, barUS;
var svgOther, barOther;

// Initializing the bar for US
function initBarUS() {
    svgUS = d3.select("#bar-us").append("svg").attr("width", barWidth).attr("height", barHeight);
    barUS = svgUS.append("rect")//
    .attr("width", 0).attr("height", barHeight)//
    .attr("style", "fill: #790647;")//
    .transition().attr("width", barWidth)//
    .duration(700).ease();
}

// Initializing the bar for other country
function initBarOther() {
    svgOther = d3.select("#bar-other").append("svg").attr("width", barWidth).attr("height", barHeight);
    barOther = svgOther.append("rect")//
    .attr("width", 0).attr("height", barHeight);
}

function changeBar(d) {
    var name = d.properties.name;
    var value = d.properties.value;
    var color = d.properties.color;
    var w = barWidth * (value / tuitionsMax);
    
    d3.select("#label-other p").text(name);
    if (value > 0) {
        barOther.attr("style", "fill: " + color + ";");
    }
    barOther.transition().attr("width", w).duration(400);
}

console.log();