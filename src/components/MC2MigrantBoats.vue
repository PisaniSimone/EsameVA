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
import crossfilter from 'crossfilter'

let cf;
export default {
    name: "MC2_first_part",

    data(){
        return{
            loyaltyData: [],
            ccData: [],
        }
    },
    mounted() {
        fetch("C:\\Users\\Master\\WebstormProjects\\first_try\\src\\data\\loyalty_data.json")
            .then(res => res.json)
            .then((res) =>{
                this.loyaltyData = res.map((d) =>{
                    const ld = {
                        Day: d.timestamp.split("/")[1],
                        Month: d.timestamp.split("/")[0],
                        Price: +d.price,

                    }
                })
            })
    }
}
</script>

<style scoped>

</style>