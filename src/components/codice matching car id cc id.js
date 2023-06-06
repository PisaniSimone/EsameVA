const d3 = require("d3");

let gps_stops = []
let dIdGps = d3.group(gps, (d) => d.id);
dIdGps.forEach(function (element) {
    for (let i = 0; i < element.length - 1; i++) {
        if (element[i + 1].seconds - element[i].seconds > 5) {
            gps_stops.push({
                id: element[i].id,
                date: element[i].date,
                fermata: element[i].time,
                ripartenza: element[i + 1].time,
                coord: [element[i].lat, element[i].long],
            });
        }
    }
});


let cc_transactions = []
let dIdcc_transactions = d3.group(credit_card, (d) => d.id);
dIdcc_transactions.forEach(function (element) {
    for (let i = 0; i < element.length - 1; i++) {
        cc_transactions.push({
            id: element[i].id,
            date: element[i].date,
            location: element[i].location,
            time: element[i].time,
        });
    }
});

let cc_transactions2 = this.reaggarangeData(cc_transactions)
let gps_stops2 = this.reaggarangeData(gps_stops);

let first_day_gps = gps_stops2[0].value
let first_day_cc = cc_transactions2[0].value

this.check_something(gps_stops2, cc_transactions2)

first_day_gps.forEach(gps_id =>{
    first_day_cc.forEach(cc_id =>{
        let big_flag = false
        for(let j = 0; j<cc_id.value.length; j++) {
            let cc_movement = cc_id.value[j]
            let transazione = this.getMinutes(cc_movement.time)
            let little_flag = false
            for (let i = 0; i < gps_id.value.length; i++){
                let gps_movement = gps_id.value[i]

                let fermata = this.getMinutes(gps_movement.fermata)
                let partenza = this.getMinutes(gps_movement.ripartenza)

                if (partenza - fermata >= transazione - fermata && transazione - fermata > 0){
                    little_flag = true
                    break;
                }
                little_flag = false
            }
            if(little_flag){
                big_flag = true
            }
            else{
                big_flag = false
            }
        }
        if (big_flag){
            this.check_next_days(gps_stops2, cc_transactions2, gps_id.id, cc_id.id)
            /*if(this.check_next_days(gps_stops2, cc_transactions2, gps_id.id, cc_id.id)){
                console.log("Eureka! "+gps_id.id+" - "+cc_id.id)
            }*/
        }
    })
})
