<template>
    <b-col cols="11" class="border-dark border mx-3 shadow-lg offset-1" id="my_piechart" style="background-color: whitesmoke; height: 220px">
        <h4 class="my-1">
            Percentage of use of credit/loyalty cards:
        </h4>
        <svg id="my_piechart_dataviz">
            <rect width="15" height="15" x="350" y="50" fill="#D7B377" stroke="black"></rect>
            <rect width="15" height="15" x="350" y="70" fill="#931F1D" stroke="black"></rect>
            <rect width="15" height="15" x="350" y="90" fill="#004F2D" stroke="black"></rect>
            <text x="370" y="63">Both loyalty and credit card</text>
            <text x="370" y="83">Only credit card</text>
            <text x="370" y="103">Only loyalty card</text>
        </svg>
    </b-col>
</template>

<script>
const d3 = require("d3");

let radius, color, svg;

export default {
    name: "MC2_piechart",
    props: {
        data_for_piechart: Object,
    },
    mounted() {
        this.buildpiechart(this.data_for_piechart);
    },
    watch: {
        data_for_piechart(newVal) {
            this.update(newVal);
        },
    },
    methods: {
        buildpiechart(data) {
            // set the dimensions and margins of the graph
            let width = 600;
            let height = 175;
            let margin = 20;

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            radius = Math.min(width, height) / 2 - margin;

            // append the svg object to the div called 'my_dataviz'
            svg = d3
                .select("#my_piechart_dataviz")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${(width / 2) - 50}, ${height / 2})`);

            // set the color scale
            let keys = [];
            for (let key in data) {
                keys.push(key);
            }

            color = d3
                .scaleOrdinal()
                .domain(keys)
                .range(["#D7B377", "#004F2D", "#931F1D"]);
        },
        update(data) {
            // Compute the position of each group on the pie:
            const pie = d3
                .pie()
                .value(function (d) {
                    return d[1];
                })
                .sort(function (a, b) {
                    return d3.ascending(a.key, b.key);
                }); // This make sure that group order remains the same in the pie chart
            const data_ready = pie(Object.entries(data));
            const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
            const arcGenerator2 = d3
                .arc()
                .innerRadius(0)
                .outerRadius(radius + 10);

            // map to data
            const paths = svg.selectAll("g.pies").data(data_ready.filter(d => d.value > 0));

            const gpaths = paths.join("g").attr("class", "pies");

            gpaths
                .selectAll("title")
                .data((d) => [d])
                .join("title")
                .html((d) => d.data[0] + ": <strong>" + d.data[1] + "</strong>");

            const mouseover2 = function () {
                d3.select(this).transition().duration(1000).attr("d", arcGenerator2);
            };

            const mouseleave2 = function () {
                d3.select(this).transition().duration(200).attr("d", arcGenerator);
            };

            gpaths
                .selectAll("path")
                .data(function(d) {
                    return [d]
                })
                .join("path")
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)
                .on("mouseover", mouseover2)
                .on("mouseleave", mouseleave2)
                .attr("d", d3.arc().innerRadius(0).outerRadius(0))
                .style("opacity", 0)
                .attr("fill", (d) => color(d.data[0]))
                .transition()
                .duration(400)
                .style("opacity", 1)
                .delay(100)
                .attr("d", arcGenerator)
        },
    },
};
</script>

<style scoped></style>
