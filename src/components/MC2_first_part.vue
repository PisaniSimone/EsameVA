<template>
    <h1>La mia prima heatmap</h1>
    <div id="my_dataviz"></div>
</template>

<script>
/*import crossfilter from 'crossfilter';*/

import loyaltydata from "/public/data/loyalty_data.json";
import creditdata from "/public/data/cc_data.json";
import {crossfilter} from "crossfilter/crossfilter";

let cf;
let dDateLoc;
const d3 = require("d3");


export default {
    name: "MC2_first_part",
    data() {
        return {
            transaction: [],
        };
    },
    mounted() {
        const loyalty_card = loyaltydata.map((d) => {
            const l = {
                date: d.timestamp,
                location: d.location,
                price: +d.price,
                loyaltyId: d.loyaltynum,
            };
            return l;
        });

        const credit_card = creditdata.map((d) => {
            const c = {
                date: d.timestamp.split(" ")[0],
                time: d.timestamp.split(" ")[1],
                location: d.location,
                price: +d.price,
                last4num: +d.last4ccnum,
            };
            return c;
        });

        this.merge_data(credit_card, loyalty_card);
        cf = crossfilter(this.transaction);

        dDateLoc = cf.dimension(function (d) {
            return [d.date, d.location]
        });
        const result = dDateLoc.group().reduceCount().all().map(v => [v.key[0].split("/")[1], v.key[1], v.value]);

        // set the dimensions and margins of the graph
        const margin = {top: 30, right: 30, bottom: 30, left: 130},
            width = 650 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;


        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Labels of row and columns
        const myGroups = [];
        const myVars = []
        result.forEach((element) => {
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
            .range(["white", "blue"])
            .domain([1, 100])

        //Read the data
        svg.selectAll()
            .data(result, function (d, i) {
                return result[i][0] + ':' + result[i][1];
            })
            .join("rect")
            .attr("x", function (d, i) {
                return x(+result[i][0])
            })
            .attr("y", function (d, i) {
                return y(result[i][1])
            })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d, i) {
                return myColor(result[i][2])
            })
    },
    methods: {
        merge_data(data1, data2) {
            let flag;
            for (let i in data1) {
                flag = false;
                for (let j in data2) {
                    if (
                        data1[i].price == data2[j].price &&
                        data1[i].date == data2[j].date &&
                        data1[i].location == data2[j].location
                    ) {
                        var mergedObj = {...data2[j], ...data1[i]};
                        this.transaction.push(mergedObj);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {...data1[i], loyaltyId: null};
                    this.transaction.push(mergedObj);
                }
            }
            for (let i in data2) {
                flag = false;
                for (let j in data1) {
                    if (
                        data2[i].price == data1[j].price &&
                        data2[i].date == data1[j].date &&
                        data2[i].location == data1[j].location
                    ) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {...data2[i], time: null, last4num: null};
                    this.transaction.push(mergedObj);
                }
            }
            return this.transaction;
        },
    },
};
</script>

<style scoped></style>
