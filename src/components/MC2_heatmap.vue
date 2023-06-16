<template>
    <b-col cols="8" id="my_heatmap" class="pb-2" style="overflow: auto">
        <h4 class="mt-3">
            Number of transactions for each place during the analyzed period:
        </h4>
        <svg id="my_heatmap_dataviz">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#333A48;stop-opacity:1" />
                    <stop offset="40%" style="stop-color:#707F99;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#A0AABB;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="30" height="150" x="1050" y="45" fill="url(#grad1)" stroke="black"></rect>
            <text x="1051" y="41">Max</text>
            <text x="1052" y="210">Min</text>
        </svg>
    </b-col>
    <b-col cols="4" class="pt-5">
        <b-card text-variant="white" title="Total Transactions:" class="mt-5" style="background-color: #4B5976">
            <b-card-text class="mt-3">
                <p style="font-size: 30px">{{ total }}</p>
            </b-card-text>

        </b-card>
        <b-card text-variant="white" title="Statistical Indicators per Place:" class="mt-5" style="background-color: #4B5976">
            <b-card-text class="mt-2" style="text-align: left">
                <p style="font-size: 17px">Mean: {{ mean_place }}
                    <br>
                Mode: {{ mode_place }}
                    <br>
                Standard deviation: {{ std_dev_place }}
                <br>
                Place with most transactions: {{ max_place }}</p>
            </b-card-text>

        </b-card>
        <b-card text-variant="white" title="Statistical Indicators per Day:" class="mt-5" style="background-color: #4B5976">
            <b-card-text class="mt-2" style="text-align: left">
                <p style="font-size: 17px">Mean: {{ mean_date }}
                    <br>
                    Mode: {{ mode_date }}
                    <br>
                    Standard deviation: {{ std_dev_date }}
                <br>
                Day with most transactions: {{ max_date }}</p>
            </b-card-text>

        </b-card>
    </b-col>
</template>

<script>

const d3 = require("d3");
export default {
    name: "MC2_heatmap",
    data(){
        return{
            total: 0,
            mean_place: 0,
            mode_place: 0,
            std_dev_place: 0,
            max_place: "",
            mean_date: 0,
            mode_date: 0,
            std_dev_date: 0,
            max_date: ""
        }
    },
    props: {
        data_for_heatmap: Array,
        places_for_heatmap: Array,
    },
    mounted() {
    },
    watch: {
        data_for_heatmap(newVal) {
            this.buildHeatmap(newVal);
            this.total = newVal.reduce((sum,d) => {
                return sum + d[2]
            }, 0)

            this.buildCards(newVal)
        },
    },
    methods: {
        buildCards(newVal){
            this.total = newVal.reduce((sum,d) => {
                return sum + d[2]
            }, 0)

            let data_rearranged = d3.flatRollup(newVal, v => d3.sum(v, d=> d[2]), d => d[1])
            this.mean_place = (d3.mean(data_rearranged, d => d[1])).toFixed(2)
            this.mode_place = (d3.mode(data_rearranged, d => d[1]))
            this.std_dev_place = (d3.deviation(data_rearranged, d => d[1])).toFixed(2)
            let maxid = d3.maxIndex(data_rearranged, d=>d[1])
            this.max_place = data_rearranged[maxid][0]+" ("+data_rearranged[maxid][1]+")"

            data_rearranged = d3.flatRollup(newVal, v => d3.sum(v, d=> d[2]), d => d[0])
            this.mean_date = (d3.mean(data_rearranged, d => d[1])).toFixed(2)
            this.mode_date = (d3.mode(data_rearranged, d => d[1]))
            this.std_dev_date = (d3.deviation(data_rearranged, d => d[1])).toFixed(2)
            maxid = d3.maxIndex(data_rearranged, d=>d[1])
            this.max_date = data_rearranged[maxid][0]+" Gen 2014 ("+data_rearranged[maxid][1]+")"
        },
        buildHeatmap(data) {
            d3.flatGroup(data, d=>d[0]).forEach(element => {
                let giorno = element[0]
                let temp = []
                element[1].forEach(el => {
                    temp.push(el[1])
                })
                this.places_for_heatmap.forEach(el =>{
                    if(!temp.includes(String(el))){
                        data.push([giorno, el, 0])
                    }
                })
            })
            // set the dimensions and margins of the graph
            const margin = {top: 30, right: 60, bottom: 100, left: 200},
                width = 1100 - margin.left - margin.right,
                height = 770 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3
                .select("#my_heatmap_dataviz")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);


            const gg = svg
                .selectAll("g.graph")
                .data([0])
                .join("g")
                .attr("class", "graph")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Labels of row and columns
            const myGroups = [];
            const myVars = [];
            data.forEach((element) => {
                myGroups.push("Gen " + element[0]);
            });

            this.places_for_heatmap.forEach(element =>{
                myVars.push(element)
            })

            myVars.sort();

            // Build X scales and axis:
            const x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
            gg.selectAll("g.x")
                .data([0])
                .join("g")
                .attr("class", "x")
                .style("font-size", 14)
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(0))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            gg.selectAll("g.x")
                .data([0])
                .select(".domain")
                .remove();

            // Build X scales and axis:
            const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);

            gg.selectAll("g.y")
                .data([0])
                .join("g")
                .attr("class", "y")
                .style("font-size", 14)
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y).tickSize(0))


            gg.selectAll("g.y")
                .data([0])
                .select(".domain")
                .remove();

            // Build color scale
            const myColor = d3
                .scaleLinear()
                .range(["#A0AABB", "#707F99", "#333A48"])
                .domain([0, 1, d3.max(data, (d) => d[2])]);

            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function () {
                d3.select(this).style("stroke", "black").style("opacity", 1);
            };

            const mouseleave = function () {
                d3.select(this).style("stroke", "none").style("opacity", 1);
            };

            const rects_heat = gg.selectAll("g.rects_heat").data(data);

            const gs = rects_heat
                .enter()
                .append("g")
                .attr("class", "rects_heat")
                .merge(rects_heat);

            rects_heat.exit().remove();

            gs.selectAll("title")
                .data((d) => [d])
                .join("title")
                .html(
                    (d) =>
                        "Number of transations on <strong>Gen " +
                        d[0] +
                        "</strong> at <strong>" +
                        d[1] +
                        "</strong>: <strong>" +
                        d[2] +
                        "</strong>"
                );

            gs.selectAll("rect.heat")
                .data((d) => [d])
                .join("rect")
                .attr("class", "heat")
                .on("mouseover", mouseover)
                .on("mouseleave", mouseleave)
                .transition()
                .duration(1000)
                .attr("x", (d) => x("Gen " + d[0]))
                .attr("y", (d) => y(d[1]))
                .attr("width", x.bandwidth())
                .attr("height", y.bandwidth())
                .style("fill", (d) => myColor(d[2]));
        },
    },
};
</script>

<style scoped></style>
