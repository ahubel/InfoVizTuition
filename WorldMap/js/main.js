d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom().scaleExtent([1, 9]).on("zoom", move);


var width = document.getElementById('container').offsetWidth;
var height = width / 2;

var topo, projection, path, svg, g;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

setup(width, height);

function setup(width, height) {
    projection = d3.geo.mercator().translate([(width / 2), (height / 2)]).scale(width / 2 / Math.PI);
    
    path = d3.geo.path().projection(projection);
    
    svg = d3.select("#container").append("svg").attr("width", width).attr("height", height).call(zoom).on("click", click).append("g");
    
    g = svg.append("g");
}

// Load Tuition
var tuitions = {
};
d3.csv("data/tuition.csv", function (data) {
    data.forEach(function (element) {
        tuitions[element.country] = element.value;
    });
});

// Load Map
d3.json("data/world-topo-min.json", function (error, world) {
    
    var countries = topojson.feature(world, world.objects.countries).features;
    
    topo = countries;
    loadTuition();
    draw(topo);
});

// Function to assign tuition data and corresponding color
function loadTuition() {
    topo.forEach(function (element) {
        if (_.has(tuitions, element.properties.name)) {
            element.properties.value = tuitions[element.properties.name];
            element.properties.color = "#990000";
        } else {
            element.properties.value = undefined;
            element.properties.color = "#333333";
        }
    });
}

function draw(topo) {
    
    svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path);
    
    
    g.append("path").datum({
        type: "LineString", coordinates:[[-180, 0],[-90, 0],[0, 0],[90, 0],[180, 0]]
    }).attr("class", "equator").attr("d", path);
    
    
    var country = g.selectAll(".country").data(topo);
    
    country.enter().insert("path").attr("class", "country").attr("d", path).attr("id", function (d, i) {
        return d.id;
    }).attr("title", function (d, i) {
        return d.properties.name;
    }).style("fill", function (d, i) {
        return d.properties.color;
    });
    
    //offsets for tooltips
    var offsetL = document.getElementById('container').offsetLeft + 20;
    var offsetT = document.getElementById('container').offsetTop + 10;
    
    //tooltips
    country.on("mousemove", function (d, i) {
        
        var mouse = d3.mouse(svg.node()).map(function (d) {
            return parseInt(d);
        });
        
        tooltip.classed("hidden", false).attr("style", "left:" +(mouse[0] + offsetL) + "px;top:" +(mouse[1] + offsetT) + "px").html(tooltipHTML(d.properties.name));
    }).on("mouseout", function (d, i) {
        tooltip.classed("hidden", true);
    });
}


function redraw() {
    width = document.getElementById('container').offsetWidth;
    height = width / 2;
    d3.select('svg').remove();
    setup(width, height);
    draw(topo);
}


function move() {
    
    var t = d3.event.translate;
    var s = d3.event.scale;
    zscale = s;
    var h = height / 4;
    
    
    t[0] = Math.min(
    (width / height) * (s - 1),
    Math.max(width * (1 - s), t[0]));
    
    t[1] = Math.min(
    h * (s - 1) + h * s,
    Math.max(height * (1 - s) - h * s, t[1]));
    
    zoom.translate(t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");
    
    //adjust the country hover stroke width based on zoom level
    d3.selectAll(".country").style("stroke-width", 1.5 / s);
}


// Tooltip
function tooltipHTML(countryName) {
    return countryName;
}

var throttleTimer;
function throttle() {
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function () {
        redraw();
    },
    200);
}


//geo translation on mouse click in map
function click() {
    var latlon = projection.invert(d3.mouse(this));
    console.log(latlon);
}

//