var width = 960,
    height = 600;

var path = d3.geoPath().projection(null);

console.log(path);

var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json('source/africa.json', function(error, us) {
    if (error) return console.error(error);
    console.log(error);
    svg.append('path')
        .datum(topojson.mesh(us))
        .attr('d', path);
});
