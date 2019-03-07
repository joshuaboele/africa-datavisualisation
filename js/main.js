const width = 1200,
    height = 1000;

const projection = d3
    .geoMercator()
    .center([15, 5])
    .scale(600)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const colorScheme = d3.scaleSequential(d3.interpolatePuBuGn);

const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

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
        .on('click', function(d) {
            if (d.properties.geounit == 'Sudan') {
                console.log('Conditional executes when clicked on Sudan');
            }
            console.log('This country is called ' + d.properties.geounit);
            console.log(d);
        });
});
