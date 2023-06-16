<template>
    <b-col cols="6" class="offset-1"><h4 class="mt-2">Time of transactions</h4></b-col>
    <b-col cols="6" class="offset-1 border-dark border shadow-lg" align-v="center" id="my_sankeyt" style="height: 700px; align-items: center; overflow: auto; background-color: whitesmoke">
        <svg class="mt-4 mx-auto" id="my_sankey_dataviz"></svg>
    </b-col>
</template>

<script>
const d3 = require("d3");
const d3Sankey = require("d3-sankey");

const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 800 - margin.left - margin.right;
let height = 1500 - margin.top - margin.bottom;


let sankey;

export default {
    name: "MC2_sankey",
    props: {
        data_for_sankey: Object,
    },
    mounted() {


    },
    watch:{
        data_for_sankey(newVal){
            d3.select("#my_sankey_dataviz")
                .selectAll("g")
                .remove()
            this.modify_sankey(newVal)
        }
    },
    methods:{
        modify_sankey(newVal){
            let lunghezza = this.data_for_sankey.links.length
            if(lunghezza === 0){
                height = 100 - margin.top - margin.bottom;
                return
            }
            else if(lunghezza < 20){
                height = (lunghezza * 40) - margin.top - margin.bottom;
            }
            else if(lunghezza < 60){
                height = (lunghezza * 20) - margin.top - margin.bottom;
            }
            else if(lunghezza < 100){
                height = (lunghezza * 10) - margin.top - margin.bottom;
            }
            else {
                height = (lunghezza * 8) - margin.top - margin.bottom;
            }

            sankey = d3Sankey.sankey()
                .nodeWidth(20)
                .nodePadding(5)
                .size([width, height])
                .iterations(0);

            d3.select("#my_sankey_dataviz")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            let graph = sankey(newVal)
            graph.links.sort((a,b) => a.target > b.target ? 1 : -1)

            let link = d3.select("#my_sankey_dataviz").append("g").selectAll(".link")
                .data(graph.links)
                .enter().append("path")
                .attr("class", "link")
                .attr("d", d3Sankey.sankeyLinkHorizontal())
                .attr("stroke-width", function(d) {
                    return d.width; });

            link.append("title")
                .text(function(d) {
                    return "From: "+d.source.name + "- To: " +
                        d.target.name+". Number of links: "+d.value*2; });

            let node = d3.select("#my_sankey_dataviz").append("g").selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", "node");

            node.append("rect")
                .attr("x", function(d) {
                    return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("width", sankey.nodeWidth())
                .style("fill", "#2B2D42" )
                .style("stroke", function(d) {
                    return d3.rgb(d.color).darker(2); })
                .append("title")
                .text(function(d) {
                    return d.name; });

            node.append("text")
                .attr("x", function(d) { return d.x0 - 6; })
                .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(function(d) { if(!d.name){
                    return "Null"
                }
                    return d.name; })
                .filter(function(d) { return d.x0 < width / 2; })
                .attr("x", function(d) { return d.x1 + 6; })
                .attr("text-anchor", "start");



        },
    }
}
</script>

<style>
.node rect {
    fill-opacity: .9;
    shape-rendering: crispEdges;
}

.node text {
    pointer-events: none;
    text-shadow: 0 1px 0 #fff;
}

.link {
    fill: transparent;
    stroke: #8D99AE;
    stroke-opacity: .2;
}

.link:hover {
    stroke-opacity: .5;
}
</style>
