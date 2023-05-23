<template>
    <b-col cols="6" id="my_barchart">
        <h4 class="mt-2">Time of transactions during the analyzed period:</h4>
        <p>
            (NB: transactions made using only the loyalty card are not taken into
            consideration)
        </p>
        <svg id="my_barchart_dataviz"></svg>
    </b-col>
</template>

<script>
const d3 = require("d3");
let x, xAxis, y, yAxis, gg;

const margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// set the dimensions and margins of the graph

export default {
    name: "MC2_barchart",
    props: {
        data_for_barchart: Array,
    },
    mounted() {
        this.buildBarchart(this.data_for_barchart)
    },
    watch: {
        data_for_barchart(newVal) {
            this.update2(newVal);
        },
    },
    methods: {
        buildBarchart(data) {
            const svg = d3
                .select("#my_barchart_dataviz")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            gg = svg
                .selectAll("g.graph_barchart")
                .data([0])
                .join("g")
                .attr("class", "graph_barchart")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x = d3.scaleBand().range([0, width]).padding(0.2);

            xAxis = gg
                .selectAll("g.barchart_x")
                .data([0])
                .join("g")
                .attr("class", "barchart_x")
                .style("font-size", 13)
                .attr("transform", "translate(0," + height + ")");

            y = d3.scaleLinear().range([height, 0]);

            yAxis = gg
                .selectAll("g.myYaxis")
                .data([0])
                .join("g")
                .style("font-size", 13)
                .attr("class", "myYaxis");

            this.update2(data);
        },
        update2(data) {
            // Update the X axis
            const myGroups = [];
            data.forEach((element) => {
                myGroups.push(element[0]);
            });
            x.domain(
                data.map(function (d) {
                    return d[0];
                })
            );
            xAxis.call(d3.axisBottom(x));

            // Update the Y axis
            const myVars = [1];
            data.forEach((element) => {
                myVars.push(element[1]);
            });
            y.domain([0, d3.max(myVars)]);

            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // Create the rects_barchart variable
            const rects_barchart = gg
                .selectAll("g.rects_bar")
                .data(data)

            const gbar = rects_barchart
                .enter()
                .append("g")
                .attr("class","rects_bar")
                .merge(rects_barchart)

            gbar.selectAll("title")
                .data((d)  => [d])
                .join("title")
                .text(function(d){ return "From "+d[0]+":00 to "+d[0]+":59 there were "+d[1]+" transactions"})

           gbar.selectAll("rect.bar")
               .data((d) => [d])
                .join("rect")
                .attr("class", "bar")
                .transition()
                .duration(500)
                .attr("x", function (d) {
                    return x(d[0]);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return height - y(d[1]);
                })
                .attr("fill", "#6C7D47")

            /*gbar
                .enter()
                .append("rect")
                .attr("class", "bar")
                .merge(rects_barchart)
                .transition()
                .duration(1000)
                .attr("x", function (d) {
                    return x(d[0]);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return height - y(d[1]);
                })
                .attr("fill", "#6C7D47")*/
        },
    },
};
</script>

<style scoped></style>
