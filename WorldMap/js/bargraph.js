var barWidth = (document.getElementById('bargraph').offsetWidth - document.getElementById('label-us').offsetWidth) * 0.9;
var barHeight = 30;
//
var svgUS, barUS;
var svgOther, barOther;

// Initializing the bar for US
function initBarUS() {
    svgUS = d3.select("#bar-us").append("svg")//
    .attr("width", barWidth).attr("height", barHeight)//
    .attr("id", "svg-us");
    
    barUS = svgUS.append("rect")//
    .attr("width", 0).attr("height", barHeight)//
    .attr("style", "fill: #790647;")//
    .transition().attr("width", barWidth)//
    .duration(700).ease();
    
    // Add text
    var pos = document.getElementById("svg-us").offsetLeft + barWidth + 20;
    d3.select("#value-us").attr("style", "left: " + pos + "px;");
    d3.select("#value-us p").text("$" + tuitionsMax);
}

// Initializing the bar for other country
function initBarOther() {
    svgOther = d3.select("#bar-other").append("svg")//
    .attr("id", "svg-other")//
    .attr("width", barWidth).attr("height", barHeight);
    
    barOther = svgOther.append("rect")//
    .attr("width", 0).attr("height", barHeight);
}

// Change bar and move text
function changeBar(d) {
    var name = d.properties.name;
    var value = d.properties.value;
    var color = d.properties.color;
    var w = barWidth * (value / tuitionsMax);
    
    // Exception: ignore US
    if (name == "United States") {
        changeBarUS()
        return;
    }
    
    // Exception: small lable for UK
    if (name == "United Kingdom") {
        d3.select("#label-other p").attr("style", "font-size: 20px");
    } else {
        d3.select("#label-other p").attr("style", "");
    }
    
    // Change bar
    d3.select("#label-other p").text(name);
    if (value > 0) {
        barOther.attr("style", "fill: " + color + ";");
    }
    barOther.transition().attr("width", w).duration(400);
    
    // Move text
    var pos = document.getElementById("svg-other").offsetLeft + w + 20;
    var style = "left: " + pos + "px;";
    var text;
    if (value == 0) {
        text = "FREE";
        style += "color: #0B62A4; font-weight: bold;";
    } else {
        text = "$" + value;
    }
    
    d3.select("#value-other p").text(text);
    d3.select("#value-other").transition()//
    .attr("style", style)//
    .duration(200);
}

// Function to ignore mouseover to US
function changeBarUS() {
    d3.select("#label-other p").text("");
    d3.select("#value-other p").text("");
    d3.select("#svg-other").remove();
    initBarOther();
}