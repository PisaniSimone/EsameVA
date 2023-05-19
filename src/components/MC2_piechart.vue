<template>
    <b-col cols="12" id="my_piechart">
        <svg id="my_piechart_dataviz"></svg>
    </b-col>
</template>

<script>
const d3 = require("d3");

let radius,
    color,
    svg;


export default {
    name: "MC2_piechart",
    props: {
        data_for_piechart: Object,
    },
    data() {
        return {
            data1: {a: 9, b: 20, c: 30, d: 8, e: 12}
        }
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
            console.log(data)
            console.log(this.data1)
            // set the dimensions and margins of the graph
            let width = 350
            let height = 350
            let margin = 40;

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
                .range(d3.schemeDark2);

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
                .cornerRadius(10)

            const arcGenerator2 = d3.arc()
                .innerRadius(0)
                .outerRadius(radius+10)
                .cornerRadius(10)

            // map to data
            const u = svg.selectAll("path")
                .data(data_ready)

            const tooltip2 = d3.select("#my_piechart")
                .selectAll("div")
                .data([0])
                .join("div")
                .style("opacity", 0)
                .attr("id", "tooltip_piechart")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "10px")
                .style("padding", "5px")
                .style("position", "absolute")

            const mouseover2 = function() {
                tooltip2
                    .style("opacity", 1)
                d3.select(this).transition().duration(1000).attr("d", arcGenerator2);
            }
            const mousemove2 = function(event,d) {
                tooltip2
                    .html(d.data[0]+": <strong>"+d.data[1]+"</strong>")
                    .style("position", "absolute")
                    .style("left", (event.x)+20 + "px")
                    .style("top", (event.y) + "px")
            }
            const mouseleave2 = function() {
                tooltip2
                    .style("opacity", 0)
                d3.select(this).transition().duration(200).attr("d", arcGenerator);
            }

           u
                .join("path")
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)
                .on("mouseover", mouseover2)
                .on("mousemove", mousemove2)
                .on("mouseleave", mouseleave2)
               .transition()
               .duration(1000)
               .attr('d', arcGenerator)
               .attr('fill', function (d) {
                   return (color(d.data[0]))
               });
        }
    }
}
</script>

<style scoped>

</style>
