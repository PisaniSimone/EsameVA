<template>
    <b-col cols="7" id="my_heatmap">
        <svg id="my_dataviz"></svg>
    </b-col>
</template>

<script>
const d3 = require("d3");
export default {
    name: "MC2_heatmap",
    props: {
        transDayLoc: Array,
    },
    mounted() {
        this.buildHeatmap(this.transDayLoc);
    },
    watch:{
        transDayLoc(newVal){
            this.buildHeatmap(newVal)
        }
    },
    methods: {
        buildHeatmap(data) {
            // set the dimensions and margins of the graph
            const margin = {top: 30, right: 30, bottom: 30, left: 130},
                width = 600 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;


            // append the svg object to the body of the page
            const svg = d3.select("#my_dataviz")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Labels of row and columns
            const myGroups = [];
            const myVars = []
            data.forEach((element) => {
                myGroups.push(+element[0]);
                myVars.push(element[1]);
            });

            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([0, width])
                .domain(myGroups)
                .padding(0.01);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))

            // Build X scales and axis:
            const y = d3.scaleBand()
                .range([height, 0])
                .domain(myVars)
                .padding(0.01);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Build color scale
            const myColor = d3.scaleLinear()
                .range(["yellow", "red"])
                .domain([null, d3.max(data, function (d){ return d[2];})])


            const tooltip = d3.select("#my_heatmap")
                .append("div")
                .style("opacity", 0)
                .attr("id", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function() {
                tooltip.style("opacity", 1)
            }
            const mousemove = function(event,d) {
                tooltip
                    .html("Numero di transazioni: " + d[2])
                    .style("position", "absolute")
                    .style("left", (event.x) + "px")
                    .style("top", (event.y) + "px")
            }
            const mouseleave = function() {
                tooltip.style("opacity", 0)
            }

            //Read the data

            svg.selectAll()
                .data(data, function (d, i) {
                    return data[i][0] + ':' + data[i][1];
                })
                .join("rect")
                .attr("x", function (d, i) {
                    return x(+data[i][0])
                })
                .attr("y", function (d, i) {
                    return y(data[i][1])
                })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function (d, i) {
                    return myColor(data[i][2])
                })
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
        }
    }
}
</script>

<style scoped>

</style>
