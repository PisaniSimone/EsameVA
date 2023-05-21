<template>
    <b-container fluid>
        <b-row class="plots pt-3" style="background-color: #F5F5F5">
            <b-col cols="7" class=" col-xl-7 col-lg-12">
                <b-form-group label="Chose a view mode:" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                            id="btn-radios-1"
                            v-model="radio_heatmap.selected"
                            :options="radio_heatmap.options"
                            :aria-describedby="ariaDescribedby"
                            name="radios-btn-default"
                            buttons
                    ></b-form-radio-group>
                </b-form-group>
                <MC2_heatmap :data_for_heatmap="this.data_for_heatmap"></MC2_heatmap>
            </b-col>
            <b-col class="col-xl-5 col-lg-12">
                <b-row>
                    <b-col class="col-lg-6 offset-md-3">
                        <b-form-group label="Chose a place to focus on:" label-cols="12" content-cols="12">
                            <b-form-select
                                    v-model="select_focus.selected"
                                    :options="select_focus.options"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <MC2_piechart :data_for_piechart="this.data_for_piechart"></MC2_piechart>
                    <MC2_barchart :data_for_barchart="this.data_for_barchart"></MC2_barchart>

                </b-row>
            </b-col>
            <b-col cols="12">
                <svg id="ciao" width="700" height="500"></svg>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>
const d3 = require("d3")

import {crossfilter} from "crossfilter/crossfilter";
import MC2_heatmap from "@/components/MC2_heatmap.vue";
import MC2_piechart from "@/components/MC2_piechart.vue";
import MC2_barchart from "@/components/MC2_barchart.vue";

let cf;
let dDateLoc;
let dLoc;
let dHour;

let transactions_credit_loyalty = [];


export default {
    name: "MC2_first_part",
    components: {MC2_barchart, MC2_piechart, MC2_heatmap},
    data() {
        return {
            data_for_heatmap: [],
            data_for_piechart: {},
            data_for_barchart: [],
            radio_heatmap: {
                selected: "everything",
                options: [
                    {text: "All", value: "everything"},
                    {text: "Only credit cards", value: "credit"},
                    {text: "Only loyalty cards", value: "loyalty"},
                ]
            },
            select_focus: {
                selected: String,
                options: []
            }
        };
    },
    mounted() {
        Promise.all([
            d3.json("/data/loyalty_data.json"),
            d3.json("/data/cc_data.json"),
            d3.json("/data/world.geojson")
        ]).then(files =>{
            const loyaltydata = files[0],
                creditdata = files[1],
                geoboh = files[2];

            const loyalty_card = loyaltydata.map((d) => {
                d.loyaltynum = String;
                return {
                    date: d.timestamp,
                    location: d.location,
                    price: +d.price,
                    loyaltyId: d.loyaltynum,
                };
            });

            const credit_card = creditdata.map((d) => {
                d.last4ccnum = Number;
                return {
                    date: d.timestamp.split(" ")[0],
                    time: d.timestamp.split(" ")[1],
                    location: d.location,
                    price: +d.price,
                    last4num: +d.last4ccnum,
                    hour: d.timestamp.split(" ")[1].split(":")[0]
                }
            });

            this.merge_data(credit_card, loyalty_card);
            cf = crossfilter(transactions_credit_loyalty);
            dDateLoc = cf.dimension(d => [d.date, d.location]);
            dLoc = cf.dimension(d => d.location)


            this.data_for_heatmap = dDateLoc.group().reduceCount().all().map(v => [v.key[0].split("/")[1], v.key[1], v.value]);
            this.select_focus.options = dLoc.group().reduceCount().all().map(v => v.key);
            this.select_focus.selected = this.select_focus.options[0];

            this.check_single_place(this.select_focus.selected);

            const svg = d3.select("#ciao"),
                width2 = +svg.attr("width"),
                height2 = +svg.attr("height");

// Map and projection
            const projection = d3.geoNaturalEarth1()
                .scale(width2 / 1.3 / Math.PI)
                .translate([width2 / 2, height2 / 2])

            console.log(geoboh.features)

            svg.append("g")
                .selectAll("path")
                .data(geoboh.features)
                .join("path")
                .attr("fill", "red")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#fff")
        })

    },
    watch: {
        radio_heatmap: {
            handler(newVal) {
                if (newVal.selected === "everything") {
                    cf = crossfilter(transactions_credit_loyalty);
                } else if (newVal.selected === "credit") {
                    cf = crossfilter(transactions_credit_loyalty.filter(d => d.loyaltyId === null));
                } else {
                    cf = crossfilter(transactions_credit_loyalty.filter(d => d.last4num === null));
                }
                dDateLoc = cf.dimension((d) => [d.date, d.location]);
                this.data_for_heatmap = dDateLoc.group().reduceCount().all().map(v => [v.key[0].split("/")[1], v.key[1], v.value]);
            },
            deep: true,
        },
        select_focus: {
            handler(newVal) {
                this.check_single_place(newVal.selected);
            },
            deep: true,
        },
    },
    methods: {
        merge_data(data1, data2) {
            let mergedObj;
            let flag;
            for (let i in data1) {
                flag = false;
                for (let j in data2) {
                    if (
                        data1[i].price === data2[j].price &&
                        data1[i].date === data2[j].date &&
                        data1[i].location === data2[j].location
                    ) {
                        mergedObj = {...data2[j], ...data1[i]};
                        transactions_credit_loyalty.push(mergedObj);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {...data1[i], loyaltyId: null};
                    transactions_credit_loyalty.push(mergedObj);
                }
            }
            for (let i in data2) {
                flag = false;
                for (let j in data1) {
                    if (
                        data2[i].price === data1[j].price &&
                        data2[i].date === data1[j].date &&
                        data2[i].location === data1[j].location
                    ) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {...data2[i], time: null, last4num: null};
                    transactions_credit_loyalty.push(mergedObj);
                }
            }
            return transactions_credit_loyalty;
        },

        check_single_place(place) {
            this.data_for_piechart = {};

            let first_filter = transactions_credit_loyalty.filter(d => d.location === place);
            let second_filter = first_filter.filter(d => d.last4num !== null && d.loyaltyId !== null)
            this.data_for_piechart["Transactions with both loyalty and credit card"] = second_filter.length;

            second_filter = first_filter.filter(d => d.last4num === null)
            this.data_for_piechart["Transactions with only loyalty card"] = second_filter.length;

            second_filter = first_filter.filter(d => d.loyaltyId === null)
            this.data_for_piechart["Transactions with only credit card"] = second_filter.length;

            cf = crossfilter(transactions_credit_loyalty.filter(d => d.location === place));
            dHour = cf.dimension(d => d.hour);

            let take_keys = []
            this.data_for_barchart = dHour.group().reduceCount().all().map(d => [d.key, d.value]);

            take_keys = this.data_for_barchart.map(d => d[0]);

            for (let i = 0; i < 24; i++) {
                let stringa = String(i);
                if (stringa.length < 2) {
                    stringa = "0" + stringa;
                }
                if (!take_keys.includes(stringa)) {

                    this.data_for_barchart.push([stringa, 0])

                }
            }
            this.data_for_barchart.sort();
        },
    },
};
</script>

<style scoped></style>
