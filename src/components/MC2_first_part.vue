<template>
    <b-container fluid>
        <b-row class="plots pt-3" style="background-color: #f5f5f5">
            <b-col cols="12">
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
            <b-col cols="12">
                <b-row>
                    <b-col cols="3" class="offset-2">
                        <b-form-group
                                label="Chose a place to focus on:"
                                label-cols="12"
                                content-cols="12"
                        >
                            <b-form-select
                                    v-model="select_focus.selected"
                                    :options="select_focus.options"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col cols="7">
                        <b-form-group
                                label="Chose a day to focus on:"
                                label-cols="12"
                                content-cols="12"
                                class="mb-3"
                        >
                            <b-form-radio-group
                                    v-model="radio_focus.selected"
                                    :options="radio_focus.options"
                                    size="sm"
                                    buttons
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>
                    <MC2_piechart
                            :data_for_piechart="this.data_for_piechart"
                    ></MC2_piechart>
                    <MC2_barchart
                            :data_for_barchart="this.data_for_barchart"
                    ></MC2_barchart>
                    <MC2_scatterplot
                            :data_for_scatterplot="this.data_for_scatterplot"
                    ></MC2_scatterplot>
                </b-row>
            </b-col>
        </b-row>
        <b-row class="obs pt-3" style="background-color: #54494b"> OBS</b-row>
        <b-row class="maps pt-3" style="background-color: #f5f5f5">
            <b-col cols="12">
                <MC2_map></MC2_map>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import MC2_map from "@/components/MC2_map.vue";

const d3 = require("d3");

import {crossfilter} from "crossfilter/crossfilter";
import MC2_heatmap from "@/components/MC2_heatmap.vue";
import MC2_piechart from "@/components/MC2_piechart.vue";
import MC2_barchart from "@/components/MC2_barchart.vue";
import MC2_scatterplot from "@/components/MC2_scatterplot.vue";

let cf;
let dDateLoc;
let dLoc;
let dHour;
let dDate;

let transactions_credit_loyalty = [];

export default {
    name: "MC2_first_part",
    components: {
        MC2_scatterplot,
        MC2_map,
        MC2_barchart,
        MC2_piechart,
        MC2_heatmap,
    },
    data() {
        return {
            data_for_heatmap: [],
            data_for_piechart: {},
            data_for_barchart: [],
            data_for_scatterplot: {},
            radio_heatmap: {
                selected: "everything",
                options: [
                    {text: "All", value: "everything"},
                    {text: "Only credit cards", value: "credit"},
                    {text: "Only loyalty cards", value: "loyalty"},
                ],
            },
            select_focus: {
                selected: String,
                options: [],
            },
            radio_focus: {
                selected: "everything",
                options: [
                    {text: "All", value: "everything"},
                    {text: "Only credit cards", value: "credit"},
                    {text: "Only loyalty cards", value: "loyalty"},
                ],
            },
        };
    },
    mounted() {
        Promise.all([
            d3.json("/data/loyalty_data.json"),
            d3.json("/data/cc_data.json"),
            d3.json("/data/gps.json"),
        ]).then((files) => {
            //Carico i dati e inizializzo le variabili contenenti i record
            const loyaltydata = files[0],
                creditdata = files[1],
                gpsdata = files[2];

            const loyalty_card = loyaltydata.map(
                ({location, loyaltynum, price, timestamp}) => {
                    return {
                        date: timestamp,
                        location: location,
                        price: +price,
                        loyaltyId: loyaltynum,
                    };
                }
            );

            const credit_card = creditdata.map(
                ({last4ccnum, location, price, timestamp}) => {
                    return {
                        date: timestamp.split(" ")[0],
                        time: timestamp.split(" ")[1],
                        location: location,
                        price: +price,
                        last4num: +last4ccnum,
                        hour: timestamp.split(" ")[1].split(":")[0],
                    };
                }
            );

            const gps = gpsdata
                .map(({id, Timestamp, lat, long}) => {
                    return {
                        id: +id,
                        date: Timestamp.split(" ")[0],
                        time: Timestamp.split(" ")[1],
                        lat: lat,
                        long: long,
                        seconds:
                            +Timestamp.split(" ")[1].split(":")[0] * 3600 +
                            +Timestamp.split(" ")[1].split(":")[1] * 60 +
                            +Timestamp.split(" ")[1].split(":")[2],
                    };
                })
                .filter((d) => d.date === "01/06/2014")
                .filter((d) => d.id < 36);

            let boh = [];

            let cId = d3.group(gps, (d) => d.id);
            cId.forEach(function (element) {
                for (let i = 0; i < element.length - 1; i++) {
                    if (element[i + 1].seconds - element[i].seconds > 120) {
                        boh.push({
                            id: element[i].id,
                            fermata: element[i].time,
                            ripartenza: element[i + 1].time,
                        });
                    }
                }
            });
            /*
                  console.log(boh.sort((d) => d.id));
      */
            //Merging tra i dataset credit_card e loyalty card
            this.merge_data_cards(credit_card, loyalty_card);

            //Inizializzo crossfilter e le diverse dimensioni
            cf = crossfilter(transactions_credit_loyalty);
            dDateLoc = cf.dimension((d) => [d.date, d.location]);
            dLoc = cf.dimension((d) => d.location);
            dDate = cf.dimension((d) => d.date);

            //Gestione dei dati da passare al component MC2_heatmap
            this.data_for_heatmap = dDateLoc
                .group()
                .reduceCount()
                .all()
                .map((v) => [v.key[0].split("/")[1], v.key[1], v.value]);

            //Gestione delle opzioni per i due formgroup
            this.select_focus.options = dLoc
                .group()
                .reduceCount()
                .all()
                .map((v) => v.key);
            this.select_focus.selected = this.select_focus.options[0];

            let transformator = [{text: "All", value: "All"}],
                accumulator = [];
            accumulator = dDate
                .group()
                .reduceCount()
                .all()
                .map((d) => d.key);
            accumulator.forEach((element) => {
                transformator.push({
                    text: element.split("/")[1] + "-01",
                    value: element,
                });
            });

            this.radio_focus.options = transformator;
            this.radio_focus.selected = this.radio_focus.options[0].value;

            //Gestione dei dati per MC2_barchart, MC2_piechart, MC2_scatterplot
            this.check_focus(this.select_focus.selected, this.radio_focus.selected);
        });
    },
    watch: {
        radio_heatmap: {
            handler(newVal) {
                if (newVal.selected === "everything") {
                    cf = crossfilter(transactions_credit_loyalty);
                } else if (newVal.selected === "credit") {
                    cf = crossfilter(
                        transactions_credit_loyalty.filter((d) => d.loyaltyId === null)
                    );
                } else {
                    cf = crossfilter(
                        transactions_credit_loyalty.filter((d) => d.last4num === null)
                    );
                }
                dDateLoc = cf.dimension((d) => [d.date, d.location]);
                this.data_for_heatmap = dDateLoc
                    .group()
                    .reduceCount()
                    .all()
                    .map((v) => [v.key[0].split("/")[1], v.key[1], v.value]);
            },
            deep: true,
        },
        select_focus: {
            handler(newVal) {
                this.check_focus(newVal.selected, this.radio_focus.selected);
            },
            deep: true,
        },
        radio_focus: {
            handler(newVal) {
                this.check_focus(this.select_focus.selected, newVal.selected);
            },
            deep: true,
        },
    },
    methods: {
        merge_data_cards(data1, data2) {
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

        check_focus(place, day) {
            this.data_for_piechart = {};
            let first_filter = transactions_credit_loyalty.filter(
                (d) => d.location === place
            );

            if (day !== "All") {
                first_filter = first_filter.filter((d) => d.date === day);
            }
            this.initialize_scatterplot(first_filter, day);
            this.initialize_piechart(first_filter);
            this.initialize_barchart(first_filter);
        },

        initialize_scatterplot(first_filter, day) {
            let max = [];
            let min = [];
            this.data_for_scatterplot = [];
            if (day === "All") {
                this.data_for_scatterplot.push([
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                ]);
                let Tempresult = d3.group(first_filter, (d) => d.date);
                Tempresult.forEach(function (element) {
                    let idmax = d3.maxIndex(element, (d) => d.price);
                    max.push(element[idmax]);
                    let idmin = d3.minIndex(element, (d) => d.price);
                    min.push(element[idmin]);
                });
            } else {
                this.data_for_scatterplot.push([
                    "00",
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                ]);
                let second_filter = first_filter.filter((d) => d.time !== null);
                let Tempresult = d3.group(second_filter, (d) => d.hour);
                Tempresult.forEach(function (element) {
                    let idmax = d3.maxIndex(element, (d) => d.price);
                    max.push(element[idmax]);
                    let idmin = d3.minIndex(element, (d) => d.price);
                    min.push(element[idmin]);
                });
            }
            this.data_for_scatterplot.push({name: "Min", value: min});
            this.data_for_scatterplot.push({name: "Max", value: max});
        },

        initialize_piechart(first_filter) {
            let second_filter = first_filter.filter(
                (d) => d.last4num !== null && d.loyaltyId !== null
            );
            this.data_for_piechart["Transactions with both loyalty and credit card"] =
                second_filter.length;

            second_filter = first_filter.filter((d) => d.last4num === null);
            this.data_for_piechart["Transactions with only loyalty card"] =
                second_filter.length;

            second_filter = first_filter.filter((d) => d.loyaltyId === null);
            this.data_for_piechart["Transactions with only credit card"] =
                second_filter.length;
        },

        initialize_barchart(first_filter) {
            let second_filter = first_filter.filter((d) => d.time !== null);
            let cf2 = crossfilter(second_filter);
            dHour = cf2.dimension((d) => d.hour);

            let take_keys = [];
            this.data_for_barchart = [];
            this.data_for_barchart = dHour
                .group()
                .reduceCount()
                .all()
                .map((d) => [d.key, d.value]);

            take_keys = this.data_for_barchart.map((d) => d[0]);

            for (let i = 0; i < 24; i++) {
                let stringa = String(i);
                if (stringa.length < 2) {
                    stringa = "0" + stringa;
                }
                if (!take_keys.includes(stringa)) {
                    this.data_for_barchart.push([stringa, 0]);
                }
            }
            this.data_for_barchart.sort();
        },
    },
};
</script>

<style scoped></style>
