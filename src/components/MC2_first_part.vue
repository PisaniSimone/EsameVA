<template>
    <MC2_heatmap :transDayLoc="this.transDayLoc"></MC2_heatmap>
</template>

<script>
/*import crossfilter from 'crossfilter';*/

import loyaltydata from "/public/data/loyalty_data.json";
import creditdata from "/public/data/cc_data.json";
import {crossfilter} from "crossfilter/crossfilter";
import MC2_heatmap from "@/components/MC2_heatmap.vue";

let cf;
let dDateLoc;


export default {
    name: "MC2_first_part",
    components: {MC2_heatmap},
    data() {
        return {
            transaction: [],
            transDayLoc: [],
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
        this.transDayLoc = dDateLoc.group().reduceCount().all().map(v => [v.key[0].split("/")[1], v.key[1], v.value]);
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
