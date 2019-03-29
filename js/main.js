let countryPopulation = [];

d3.csv('source/population.csv', function(d) {
    return {
        name: d.Name,
        population: parseInt(d.Population.replace(/,/g, '')),
    };
}).then(function(data) {
    countryPopulation = data;
    drawMap();
});

function drawMap() {
    const width = 1400,
        height = 1000;

    const projection = d3
        .geoMercator()
        .center([15, 5])
        .scale(500)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    var rObj = [];

    countryPopulation.forEach(country => {
        rObj.push(parseInt(country.population));
    });

    const maxValue = Math.max(...rObj);
    const minValue = Math.min(...rObj);

    const colorScale = d3.scaleSequential(d3.interpolateBuPu).domain([minValue, maxValue]);

    const color = d3
        .scaleThreshold()
        .domain(d3.range(2, 10))
        .range(d3.schemeBuPu[9]);

    tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
            return d.properties.geounit + ' Populatie:' + d.properties.population;
        });

    const svg = d3
        .select('body')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(tip);

    const g = svg
        .append('g')
        .attr('class', 'key')
        .attr('transform', 'translate(0,40)');

    const x = d3
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
        .text('Arbitrary legend');

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
        const africaProcessed = mergingData(africa);
        const paths = svg
            .selectAll('path')
            .data(africaProcessed.features)
            .enter()
            .append('path')
            .attr('d', path)
            .style('transition', 'opacity .4s ease')
            .style('fill', function(d, i) {
                if (d.properties.population === undefined) {
                    return 'eee';
                }
                return colorScale(d.properties.population);
            })
            .on('click', function(d) {
                const countryName = d.properties.geounit;
                window.open('https://en.wikipedia.org/wiki/' + countryName);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    });
}

function mergingData(africa) {
    const featuresProcessed = africa.features.map(feature => {
        const matchedCountries = countryPopulation.filter(function(country) {
            return country.name === feature.properties.geounit;
        });
        if (matchedCountries.length > 0) {
            feature.properties.population = matchedCountries[0].population;
        }
        return feature;
    });
    console.log(africa);
    africa.features = featuresProcessed;
    return africa;
}
