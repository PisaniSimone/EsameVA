<template>
    <b-container>
        <b-row class="plots">
            <b-col>
                <div style="height:800px; background-color: beige">

                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
/*import crossfilter from 'crossfilter';*/
import loyaltydata from '/public/data/loyalty_data.json';
import creditdata from '/public/data/cc_data.json';

/*let cf;*/

export default {
    name: "MC2_first_part",
    data() {
        return {
            credit: [],
            loyalty: [],
            transaction: [],
        };
    },
    mounted() {
        /*fetch('./data/loyalty_data.json')
            .then(res => res.json())
            .then((res) =>{
                this.loyaltyCard = res.map((d) =>{
                    const l = {
                        date: d.timestamp,
                        location: d.location,
                        price: +d.price,
                        loyaltyId: d.loyaltynum,
                    }
                    return l
                });
                cf = crossfilter(this.loyaltyCard)
                console.log("num reports", cf.groupAll().reduceCount().value());
                console.log(this.loyaltyCard[0].price);
            })*/
        this.loyalty = loyaltydata.map((d) => {
            const l = {
                date: d.timestamp,
                location: d.location,
                price: +d.price,
                loyaltyId: d.loyaltynum,

            }
            return l;
        });

        this.credit = creditdata.map((d) => {
            const c = {
                date: d.timestamp.split(" ")[0],
                time: d.timestamp.split(" ")[1],
                location: d.location,
                price: +d.price,
                last4num: +d.last4ccnum,
            }
            return c;
        })

        this.merge_data(this.credit, this.loyalty);
    },
    methods: {
        merge_data(data1, data2) {
            let flag;
            for (let i in data1) {
                flag = false;
                for (let j in data2) {
                    if (data1[i].price == data2[j].price && data1[i].date == data2[j].date && data1[i].location == data2[j].location) {
                        var mergedObj = {...data2[j], ...data1[i]};
                        this.transaction.push(mergedObj);
                        flag = true
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {...data1[i], loyaltyId:null};
                    this.transaction.push(mergedObj);
                }
            }
            for (let i in data2) {
                flag = false;
                for (let j in data1) {
                    if (data2[i].price == data1[j].price && data2[i].date == data1[j].date && data2[i].location == data1[j].location) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {...data2[i], time:null, last4num:null};
                    this.transaction.push(mergedObj);
                }
            }
            console.log(this.transaction)
            return this.transaction;
        }
    }
}
</script>

<style scoped>

</style>
