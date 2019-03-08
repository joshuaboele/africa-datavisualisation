const width = 1200,
    height = 1000;

const projection = d3
    .geoMercator()
    .center([15, 5])
    .scale(600)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// tooltip init

tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
        return d.properties.geounit;
    });

const colorScheme = d3.scaleSequential(d3.interpolateBlues);

const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .call(tip);

const color = d3
    .scaleThreshold()
    .domain(d3.range(2, 10))
    .range(d3.schemeBlues[9]);

var g = svg
    .append('g')
    .attr('class', 'key')
    .attr('transform', 'translate(0,40)');

var x = d3
    .scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

g.selectAll('rect')
    .data(
        color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        })
    )
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', function(d) {
        return x(d[0]);
    })
    .attr('width', function(d) {
        return x(d[1]) - x(d[0]);
    })
    .attr('fill', function(d) {
        return color(d[0]);
    });

g.append('text')
    .attr('class', 'caption')
    .attr('x', x.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold')
    .text('Unemployment rate');

g.call(
    d3
        .axisBottom(x)
        .tickSize(13)
        .tickFormat(function(x, i) {
            return i ? x : x + '%';
        })
        .tickValues(color.domain())
)
    .select('.domain')
    .remove();

d3.json('source/continent_Africa_subunits.json').then(function(africa) {
    console.log(africa);
    const paths = svg
        .selectAll('path')
        .data(africa.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', function(d, i) {
            return colorScheme(Math.random());
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});
