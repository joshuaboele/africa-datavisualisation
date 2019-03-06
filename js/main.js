var width = 1240,
    height = 800;

var path = d3.geoPath().projection(null);
var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', color);

d3.json('source/continent_Africa_subunits.json').then(function(africa) {
    console.log(africa);
    svg.append('path').attr('d', function() {
        return path(africa);
    });
});
