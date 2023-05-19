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


            const gg = svg.selectAll("g.graph")
                .data([0])
                .join("g")
                .attr("class", "graph")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Labels of row and columns
            const myGroups = [];
            const myVars = []
            data.forEach((element) => {
                myGroups.push(element[0]);
                myVars.push(element[1]);
            });

            // Build X scales and axis:
            const x = d3.scaleBand()
                .range([ 0, width ])
                .domain(myGroups)
                .padding(0.05);
            gg.selectAll("g.x")
                .data([0])
                .join("g")
                .attr("class", "x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .select(".domain").remove()

            // Build X scales and axis:
            const y = d3.scaleBand()
                .range([ height, 0 ])
                .domain(myVars)
                .padding(0.05);
            gg.selectAll("g.y")
                .data([0])
                .join("g")
                .attr("class", "y")
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove()

            // Build color scale
            const myColor = d3.scaleLinear()
                .range(["yellow", "red"])
                .domain([null, d3.max(data, function (d){ return d[2];})])


            const tooltip = d3.select("#my_heatmap")
                .selectAll("div")
                .data([0])
                .join("div")
                .style("opacity", 0)
                .attr("id", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function() {
                tooltip
                    .style("opacity", 1)
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            }
            const mousemove = function(event,d) {
                tooltip
                    .html("Numero di transazioni: " + d[2])
                    .style("position", "absolute")
                    .style("left", (event.x)+20 + "px")
                    .style("top", (event.y) + "px")
            }
            const mouseleave = function() {
                tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
            }

            //Read the data
            const gs = gg
                .selectAll("g.rects")
                .data(data)
                .join("g")
                .attr("class","rects");

            gs.selectAll("rect")
                .data((d)=>[d])
                .join("rect")
                .attr("x", function (d) {
                    return x(d[0])
                })
                .attr("y", function (d) {
                    return y(d[1])
                })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", function (d) {
                    return myColor(d[2])
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
