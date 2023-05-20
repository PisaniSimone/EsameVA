<template>
    <div id="my_heatmap" class="pb-2">
        <h4 class="mt-3">Number of transactions for each place during the analyzed period:</h4>
        <svg id="my_heatmap_dataviz"></svg>
    </div>
</template>

<script>
const d3 = require("d3");
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
export default {
    name: "MC2_heatmap",
    props: {
        data_for_heatmap: Array,
    },
    mounted() {
        this.buildHeatmap(this.data_for_heatmap);
    },
    watch:{
        data_for_heatmap(newVal){
            this.buildHeatmap(newVal)
        }
    },
    methods: {
        buildHeatmap(data) {
            // set the dimensions and margins of the graph
            const margin = {top: 30, right: 30, bottom: 30, left: 200},
                width = 1000 - margin.left - margin.right,
                height = 770 - margin.top - margin.bottom;


            // append the svg object to the body of the page
            const svg = d3.select("#my_heatmap_dataviz")
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
                myGroups.push("Gen "+element[0]);
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
                .style("font-size", 14)
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
                .style("font-size", 14)
                .call(d3.axisLeft(y).tickSize(0))
                .select(".domain").remove()


            // Build color scale
            const myColor = d3.scaleLinear()
                .range(["#E3D081", "#A90022"])
                .domain([null, d3.max(data, function (d){ return d[2];})])

            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function() {
                d3.select(this)
                    .style("stroke", "black")
                    .style("opacity", 1)
            }

            const mouseleave = function() {
                d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 1)
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
                    return x("Gen "+d[0])
                })
                .attr("y", function (d) {
                    return y(d[1])
                })
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .attr("data-tippy-content",function (d){
                    return "Number of transations on <strong>Gen "+d[0] +"</strong> at <strong>"+d[1]+"</strong>: <strong>" + d[2]+"</strong>"})
                .style("fill", function (d) {
                    return myColor(d[2])
                })
                .attr("ref", "btnShow")
                .on("mouseover", mouseover)
                .on("mouseleave", mouseleave)

            tippy('[data-tippy-content]',{
                allowHTML:true,
                trigger: "mouseenter",
                touch: false,
            });
        }
    }
}
</script>

<style scoped>

</style>
