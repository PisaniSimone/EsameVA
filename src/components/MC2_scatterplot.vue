<template>
    <b-col cols="4" id="my_scatterplot">
        <h4 class="mt-2 mb-5">Scatterplot</h4>
        <svg class="mt-4" id="my_scatterplot_dataviz"></svg>
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
        data_for_scatterplot: Object,
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

            x = d3.scaleBand().range([0, width]).padding(0.9);

            xAxis = gg
                .selectAll("g.barchart_x")
                .data([0])
                .join("g")
                .attr("class", "barchart_x")
                .style("font-size", 13)
                .attr("transform", "translate(0," + height + ")")
                .style("z-index", 999);

            y = d3.scaleLinear().range([height, 0]);

            yAxis = gg
                .selectAll("g.myYaxis")
                .data([0])
                .join("g")
                .style("font-size", 13)
                .attr("class", "myYaxis");
        },
        update3(data) {
            const series = [];
            const modifiedData = this.create_modified_data(data);

            series.push(data[1].name, data[2].name);

            const dataReady = [];
            for (let i = 0; i < series.length; i++) {
                dataReady.push({
                    name: series[i],
                    values: modifiedData[i].sort((a, b) => (a.time > b.time ? 1 : -1)),
                });
            }

            const myXs = [];
            dataReady[0].values.forEach((element) => {
                myXs.push(element.time);
            });
            x.domain(myXs);

            const myYs = [];
            dataReady[1].values.forEach((element) => {
                myYs.push(element.value);
            });

            const ymax = d3.max(myYs);
            if (ymax <= 500) {
                y.domain([0, d3.max(myYs)]);
            } else {
                y.domain([0, d3.max(myYs) + ((500 - (d3.max(myYs) % 500)) % 500)]);
            }
            yAxis.transition().duration(1000).call(d3.axisLeft(y));
            xAxis.call(d3.axisBottom(x));

            const myColor = d3
                .scaleOrdinal()
                .domain(series)
                .range(["#4F69D1", "#DF2935"]);

            const line = d3
                .line()
                .x((d) => x(d.time))
                .y((d) => y(d.value));
            gg.selectAll("path.Max, path.Min")
                .data(dataReady)
                .join("path")
                .attr("class", (d) => d.name)
                .style("stroke-width", 2)
                .transition()
                .duration(1000)
                .attr("d", (d) => line(d.values))
                .attr("stroke", (d) => myColor(d.name))
                .style("fill", "none")
                .style("fill-opacity", 0);

            const gpoint = gg
                .selectAll("g.Max, g.Min")
                .data(dataReady)
                .join("g")
                .style("fill", (d) => myColor(d.name))
                .attr("class", (d) => d.name);

            // Second we need to enter in the 'values' part of this group
            const punti = gpoint
                .selectAll("circle")
                .data((d) => d.values.filter((d) => d.value > 0))
                .join("circle");

            punti
                .transition()
                .duration(1000)
                .attr("cx", (d) => x(d.time))
                .attr("cy", (d) => y(d.value))
                .attr("r", 5)
                .attr("stroke", "white");

            punti
                .selectAll("title")
                .remove();

            punti
                .append("title")
                .text(function (d) {
                    if (d.ccard !== undefined) {
                        return (
                            "Transaction value: " +
                            d.value +
                            ". Made on: " +
                            d.fulltime +
                            ". Last 4 number of the credit card: " +
                            d.ccard
                        );
                    } else {
                        return "Average transaction value: " + d.value;
                    }
                });

            const legenda = gg.selectAll("g.legend")
                .data(dataReady)
                .join("g")
                .attr("class", "legend")
                .style("cursor", "pointer");

            legenda
                .selectAll("text")
                .remove();

            legenda
                .append("text")
                .attr("x", 400)
                .attr("y", (d, i) => 30 + i * 20)
                .text((d) => d.name)
                .style("fill", (d) => myColor(d.name))
                .style("font-size", 15)
                .on("click", function (event, d) {
                    // is the element currently visible ?
                    let currentOpacity = d3.selectAll("." + d.name).style("opacity");
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll("." + d.name)
                        .transition()
                        .duration(700)
                        .style("opacity", currentOpacity == 1 ? 0 : 1);
                });
        },

        create_modified_data(data) {
            let data_array = [];
            for (let i = 1; i < data.length; i++) {
                data_array.push([]);
                data[i].value.forEach(function (element) {
                    if (data[0].length === 24) {
                        data_array[i - 1].push({
                            time: element.hour,
                            value: element.price,
                            ccard: element.id,
                            fulltime: element.time,
                        });
                    } else {
                        data_array[i - 1].push({
                            time: element.date.split("/")[1],
                            value: element.price,
                            ccard: element.id,
                            fulltime: element.date,
                        });
                    }
                });
            }
            this.complete_data(data_array, data);
            return data_array;
        },
        complete_data(data_array, data) {
            data_array.forEach(function (element) {
                let start, end;
                if (data[0].length == 24) {
                    start = 0;
                    end = 24;
                } else {
                    start = 6;
                    end = 20;
                }
                for (let j = start; j < end; j++) {
                    let flag = false;
                    element.forEach(function (val) {
                        if (j == +val.time) {
                            flag = true;
                        }
                    });
                    if (!flag) {
                        if (String(j).length == 1) {
                            element.push({
                                time: "0" + String(j),
                                value: 0,
                                ccard: null,
                                fulltime: null,
                            });
                        } else {
                            element.push({
                                time: String(j),
                                value: 0,
                                ccard: null,
                                fulltime: null,
                            });
                        }
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
