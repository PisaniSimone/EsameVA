<template>
    <b-col cols="4" id="my_scatterplot">
        <h4 class="mt-2 mb-5">Scatterplot</h4>
        <svg id="my_scatterplot_dataviz"></svg>
    </b-col>
</template>

<script>
const d3 = require("d3");

const margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

let gg, svg, x, y, xAxis, yAxis;

export default {
    name: "MC2_scatterplot",
    props: {
        data_for_scatterplot: Object
    },
    mounted() {
        this.buildscatterplot();
    },
    watch: {
        data_for_scatterplot(newVal) {
            this.update3(newVal);
        },
    },
    methods: {
        buildscatterplot() {
            svg = d3
                .select("#my_scatterplot_dataviz")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            gg = svg
                .selectAll("g.graph_scatterplot")
                .data([0])
                .join("g")
                .attr("class", "graph_scatterplot")
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

        },
        update3(data) {
            const myGroups = [];
            data[0].forEach((element) => {
                myGroups.push(element);
            });
            x.domain(myGroups);

            const myVars = [];
            data[1].value.forEach((element) => {
                myVars.push(element.price);
            });
            data[2].value.forEach((element) => {
                myVars.push(element.price);
            });
            if(data[3].value.length !== 0){
                myVars.push(data[3].value[0].mean)
            }

            y.domain([0, d3.max(myVars)]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));
            xAxis.transition().duration(1000).call(d3.axisBottom(x));

        },
    },
};
</script>

<style scoped></style>
