<template>
    <b-col cols="12" id="my_piechart">
        <h4 class="mt-2">Percentage of use of credit and loyalty cards in transactions:</h4>
        <svg id="my_piechart_dataviz"></svg>
    </b-col>
</template>

<script>
const d3 = require("d3");
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

let radius,
    color,
    svg;


export default {
    name: "MC2_piechart",
    props: {
        data_for_piechart: Object,
    },
    mounted() {
        this.buildpiechart(this.data_for_piechart)
    },
    watch: {
        data_for_piechart(newVal) {
            this.update(newVal)
        }
    },
    methods: {
        buildpiechart(data) {
            // set the dimensions and margins of the graph
            let width = 200;
            let height = 200;
            let margin = 20;

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            radius = Math.min(width, height) / 2 - margin;

            // append the svg object to the div called 'my_dataviz'
            svg = d3.select("#my_piechart_dataviz")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            // set the color scale
            let keys = []
            for (let key in data) {
                keys.push(key);
            }

            color = d3.scaleOrdinal()
                .domain(keys)
                .range(["#54494B", "#BB2543", "#E3D081"]);

            // Initialize the plot with the first dataset
            this.update(data)
        },
        update(data) {
            // Compute the position of each group on the pie:
            const pie = d3.pie()
                .value(function (d) {
                    return d[1];
                })
                .sort(function (a, b) {
                    return d3.ascending(a.key, b.key);
                }) // This make sure that group order remains the same in the pie chart
            const data_ready = pie(Object.entries(data))

            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)

            const arcGenerator2 = d3.arc()
                .innerRadius(0)
                .outerRadius(radius + 10)

            // map to data
            const paths = svg.selectAll("path")
                .data(data_ready)

            const mouseover2 = function () {
                d3.select(this).transition().duration(1000).attr("d", arcGenerator2);
            }

            const mouseleave2 = function () {
                d3.select(this).transition().duration(200).attr("d", arcGenerator);
            }


            paths
                .join("path")
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)
                .attr("data-tippy-content", function (d) {
                    return d.data[0] + ": <strong>" + d.data[1] + "</strong>"
                })
                .on("mouseover", mouseover2)
                .on("mouseleave", mouseleave2)
                .transition()
                .duration(1000)
                .attr('d', arcGenerator)
                .attr('fill', function (d) {
                    return (color(d.data[0]))
                });

            tippy('[data-tippy-content]', {
                allowHTML: true,
                trigger: "mouseenter",
                touch: false,
            });
        }
    }
}
</script>

<style scoped>

</style>
