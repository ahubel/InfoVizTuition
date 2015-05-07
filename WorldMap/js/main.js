d3.select(window).on("resize", throttle);

var zoom = d3.behavior.zoom().scaleExtent([1, 9]).on("zoom", move);


var width = document.getElementById('map').offsetWidth;
var height = width / 2;

var topo, projection, path, svg, g;

var graticule = d3.geo.graticule();

var tooltip = d3.select("#map").append("div").attr("class", "tooltip hidden");

setup(width, height);

function setup(width, height) {
    projection = d3.geo.mercator().translate([(width / 2), (height / 2)]).scale(width / 2 / Math.PI);
    
    path = d3.geo.path().projection(projection);
    
    svg = d3.select("#map").append("svg").attr("width", width).attr("height", height).call(zoom).on("click", click).append("g");
    
    g = svg.append("g");
}

// Load Tuition
var tuitions = {
};
var tuitionsMax = 0;
d3.csv("data/tuition.csv", function (data) {
    data.forEach(function (element) {
        tuitions[element.country] = Number(element.value);
    });
    tuitionsMax = _.max(_.values(tuitions));
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
            value = tuitions[element.properties.name];
            element.properties.value = value;
            element.properties.color = calculateColor(value);
        } else {
            element.properties.value = undefined;
            element.properties.color = "#AAAAAA";
        }
    });
}

// Get color according to the value of tuition
function calculateColor(value) {
    if (value == 0) {
        return "#39528D";
    } else {
        return d3.interpolate("#F4B8DA", "#790647")(value / tuitionsMax);
    }
}

function draw(topo) {
    var country = g.selectAll(".country").data(topo);
    
    country.enter().insert("path").attr("class", function (d, i) {
        if (d.properties.value == undefined) {
            return "country";
        } else {
            return "country with-value";
        }
    }).attr("d", path).attr("id", function (d, i) {
        return d.id;
    }).attr("title", function (d, i) {
        return d.properties.name;
    }).style("fill", function (d, i) {
        return d.properties.color;
    });
    
    //tooltips
    country.on("mousemove", mousemove).on("mouseout", function (d, i) {
        tooltip.classed("hidden", true);
    });
}


function redraw() {
    width = document.getElementById('map').offsetWidth;
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

// Tooltips
function mousemove(d, i) {
    // Exit if value is unavailable
    if (d.properties.value == undefined) {
        return;
    }
    
    // Offsets for tooltips
    var offsetL = document.getElementById('map').offsetLeft + 20;
    var offsetT = document.getElementById('map').offsetTop + 10;
    var mouse = d3.mouse(svg.node()).map(function (d) {
        return parseInt(d);
    });
    
    var boxStyle = "left:" +(mouse[0] + offsetL) + "px;top:" +(mouse[1] + offsetT) + "px";
    var html = d.properties.name + "<br /> $" + d.properties.value;
    
    
    tooltip.classed("hidden", false).attr("style", boxStyle).html(html);
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