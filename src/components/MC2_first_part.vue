<template>
    <b-container fluid>
        <b-row class="plots pt-3 section1">
            <b-col cols="12">
                <h1>Panoramic Overview</h1>
                <b-form-group label="Chose a view mode:" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                            id="radiomap"
                            v-model="radio_heatmap.selected"
                            :options="radio_heatmap.options"
                            :aria-describedby="ariaDescribedby"
                            name="radios-btn-default"
                            buttons
                    ></b-form-radio-group>
                </b-form-group>
            </b-col>
            <MC2_heatmap
                    :data_for_heatmap="this.data_for_heatmap"
                    :places_for_heatmap="this.places_for_heatmap"
            ></MC2_heatmap>
        </b-row>

        <b-row
                class="obs pt-3 my-3"
                style="background-color: #001427; color: whitesmoke"
        >
            <b-col cols="8" class="my-3 offset-2">
                <h1>Observations:</h1>
            </b-col>

            <b-col cols="10" class="offset-1 mb-3" style="text-align: start">
                <p>
                    As we can see from this initial overview, among the shops on the Abila island we can see some that
                    are much more popular than the others, mainly cafès and restaurants such as <strong>Katerina's
                    Cafè</strong>, <strong>Hippokampos</strong>,
                    <strong>Brew've Been Served</strong>,
                    <strong>Hallowed Grounds</strong> or <strong>Guy's Gyros</strong>.
                    It's also important to pay attention over the fact that, in almost all the shops
                    listed above, its possible to notice a - more or less - slight drop in the number of transactions
                    during the weekends, days in which the transactions carried out in cultural or leisure places such
                    as
                    Ahaggo Museum or Desafio Golf Course tend to increase.
                </p>

                <p>
                    Another interesting aspect is rapresented by the statistical analysis of the data, referring to
                    indices such as mean, mode and standard deviation. The analysis, carried out starting from the shops
                    first and then from the days,
                    has highlighted a great disparity over the transactions among the different shops: the fact that the
                    mode and, above all, the standard deviation have values much
                    higher than the mean, identify a large dispersion of the values compared to it
                </p>

                <p>On the other hand, those anomalies don't appear so consistently in the case of the analysis over
                    days: here the pattern
                    seems to be decidedly more stable, with trends that tend to repeat themselves such as
                    the one already described above about weekends.</p>

                <p>
                    The filters also allow us to have an overview over the transactions made using only
                    <b-link @click="set_radioMap('credit')">credit cards</b-link>
                    or
                    <b-link @click="set_radioMap('loyalty')">loyalty cards</b-link>
                    .
                    The algorithm on which the data matching between the credit cards and loyalty cards
                    datasets was
                    based is, unfortunately, far from being reliable for several reasons, first of all, the data
                    structure. <br>
                    The matching was carried out on the basis of three fields: location, price and timestamp of the
                    transaction. Among those three data, only the first one doesn't present any
                    particular problem. On the other hand, both the credit cards and loyalty cards datasets had a "date"
                    field, with the difference that, in the first case, there was also the transaction time which is
                    absent in the second case.<br>
                    As far as the price is concerned, the algorithm doesn't take in account its possible variations such
                    as the case of eventual cashbacks or loyalty card's discounts
                    which in this way would make the money movements in the same transaction looking different.
                </p>

                <p>
                    In conclusion, the algorithm has given good results showing that it may be possible to carry out a
                    transaction using cash or without using a loyalty card.
                    However, the matching failed to trace a 1 to 1 relationship between credit cards and loyalty cards,
                    both due to the already described low reliability of the algorithm but also due to the fact that the
                    last digits of the credit cards (used as ID) are not necessarily unique.
                </p>
            </b-col>
        </b-row>

        <b-row class="plots pt-3 section2">
            <b-col cols="12">
                <h1 id="focus">Focused View</h1>
            </b-col>

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
            <MC2_sankey :data_for_sankey="this.data_for_sankey"></MC2_sankey>
            <b-col cols="5">
                <MC2_piechart
                        :data_for_piechart="this.data_for_piechart"
                ></MC2_piechart>
                <MC2_barchart
                        :data_for_barchart="this.data_for_barchart"
                ></MC2_barchart>
                <MC2_scatterplot
                        :data_for_scatterplot="this.data_for_scatterplot"
                ></MC2_scatterplot>
            </b-col>
        </b-row>
        <b-row
                class="obs pt-3 my-3"
                style="background-color: #001427; color: whitesmoke"
        >
            <b-col cols="8" class="my-3 offset-2">
                <h1>Observations:</h1>
            </b-col>

            <b-col cols="10" class="offset-1 mb-3" style="text-align: start">
                <p>
                    In this section, the goal is to give a more "focus oriented" view of the data,
                    analyzing the transactions in the different commercial establishments during the various days
                    covered by the study.
                </p>

                <p>
                    The analysis is conducted through the insertion of four different graphs.<br/>
                    The first one is a Sankey diagram which is used to trace the relationship [credit card-loyalty
                    card-transaction time] between each transaction carried out during the various days.<br/>
                    The second one is a piechart used to show the percentages of transactions conducted with both
                    the credit card and the loyalty card, those carried out using only the credit card and those made
                    using only the loyalty card.<br/>
                    The third one is a barchart which, in a certain sense, simplifies the analysis conducted within the
                    Sankey diagram, creating a visualization that allows us to quickly understand the various trends
                    relating to the times of the various commercial operations.<br/>
                    The last one is a scatterplot that allows us to view the maximum and minimum price peaks both by day
                    and by hour in the carious commercial establishment.
                </p>

                <p>
                    The observation of the graphs, in addition to confirming the presence of some trends characterizing
                    the commercial establishments, has brought to light various anomalies present in the data.
                </p>

                <ol>
                    <li>At
                        <b-link href="#focus" @click="set_focus('All','Bean There Done That')">Bean There Done That
                        </b-link>
                        ,
                        <b-link href="#focus" @click="set_focus('All','Brewed Awakenings')">Brewed Awakenings</b-link>
                        ,
                        <b-link href="#focus" @click="set_focus('All','Coffee Shack')">Coffee Shack</b-link>
                        ,
                        and
                        <b-link href="#focus" @click="set_focus('All','Jack\'s Magical Beans')">Jack's Magical Beans
                        </b-link>
                        ,
                        all transactions appear to have taken place at exactly 12:00 PM.
                    </li>
                    <li>At
                        <b-link href="#focus" @click="set_focus('All','Kronos Mart')">Kronos Mart</b-link>
                        ,
                        the transactions seem to have been carried out at very unusual times compared to those of a
                        normal market, probably due to an error they were shifted by a certain amount of hours.
                    </li>
                    <li>Looking at the lows and highs of transaction prices, on January 13th at 7:20 pm, a transaction
                        appears to have been made at
                        <b-link href="#focus" @click="set_focus('01/13/2014','Frydos Autosupply n\' More')">Frydos
                            Autosupply n' More
                        </b-link>
                        whose price deviates disproportionately
                        from the average.
                    </li>
                </ol>
            </b-col>
        </b-row>
        <b-row class="maps pt-3">
            <b-col cols="12" class="mb-3">
                <h1 id="geospat">Geo-Spatial View</h1>
            </b-col>
            <b-col cols="2">
                <b-button @click="show_legend">Show All</b-button>
                <b-button class="ms-3" @click="hide_legend">Hide All</b-button>
            </b-col>

            <b-col cols="8">
                <b-form-radio-group
                        id="btn-radios-2"
                        v-model="radio_map.selected"
                        :options="radio_map.options"
                        name="radios-btn-default1"
                        buttons
                ></b-form-radio-group>
            </b-col>
            <MC2_map
                    :feature_collection="this.point_collection"
                    :data_for_listgroup="this.data_for_listgroup"
                    :cc_data_for_map="this.cc_data_for_map"
            ></MC2_map>
        </b-row>
        <b-row
                class="obs pt-3 mt-3"
                style="background-color: #001427; color: whitesmoke"
        >
            <b-col cols="8" class="my-3 offset-2">
                <h1>Observations:</h1>
            </b-col>

            <b-col cols="10" class="offset-1 mb-3" style="text-align: start">
                <p>
                    In this last section, the main focus was on analyzing the geospatial data relating to the
                    movements of the different inhabitants of the island within the city. The section consists of a
                    filter on the days and one on the time (allowing us to cover all the seconds present within the
                    space of a day), two windows showing the people in movement and the last transactions made and a map
                    on which the routes of citizens are traced starting from the gps dataset.
                </p>
                <p>
                    By analyzing the movements, we are able to define a certain pattern typically followed by all the
                    inhabitants of the island.</p>
            </b-col>
            <b-col cols="5" class="offset-1" style="text-align: start">
                <p><b>During the weekdays:</b>
                </p>
                <ul>
                    <li>From 6:30 am to 8:30 am leave the house</li>
                    <li>Stop for a coffee for a few minutes</li>
                    <li>Go to the office</li>
                    <li>Around noon, leave the office to go to a restaurant or café to eat</li>
                    <li>By 2.30 pm return to the office</li>
                    <li>Leave the office between 5:00 pm and 6:00 pm to go home or dine out</li>
                </ul>
            </b-col>
            <b-col cols="4" class="offset-1" style="text-align: start">
                <p><b>During the weekends:</b></p>
                <ul>
                    <li>Around noon, leave the house to go shopping or to have lunch</li>
                    <li>Go back home</li>
                    <li>In the evening, leave the house to go shopping or to dine</li>
                </ul>
            </b-col>


            <b-col cols="10" class="offset-1" style="text-align: start">
                <hr class="col-12">
                <p>
                    Based on these recurring patterns, by analyzing the data, it is possible to trace relationships
                    among the different inhabitants of the island:
                </p>
                <ul>
                    <li><b>Brand Tempestad</b> (#33) and <b>Elsa Orilla</b> (#7) may have an affair, some days during
                        lunchtime they
                        seem to rent an hotel room and stay there for about two hours -
                        <b-link href="#geospat" @click="set_map('01/08/2014', [7,33])">Check</b-link>
                    </li>
                    <li><b>Lidelse Dedos</b> (#14) and <b>Birgitta Frente</b> (#18) live together -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [14,18])">Check</b-link>
                    </li>
                    <li><b>Brand Tempestad</b> (#33), <b>Minke Mies</b> (#24) and <b>Scen Flecha</b> (#17) live together
                        -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [17,24,33])">Check</b-link>
                    </li>
                    <li><b>Linnea Bergen</b> (#6), <b>Kanon Herrero</b> (#25) and <b>Bertrand Ovan</b> (#29) live
                        together -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [6,25,29])">Check</b-link>
                    </li>
                    <li><b>Felix Resumir</b> (#30), <b>Varja Lagos</b> (#23) and <b>Adra Nubarron</b> (#22) live
                        together -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [22,23,30])">Check</b-link>
                    </li>
                    <li><b>Hennie Osvaldo</b> (#21), <b>Isia Vann</b> (#16), <b>Loreto Bodrogi</b> (#15) and <b>Inga
                        Ferro</b> (#13) live together -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [13,15,16,21])">Check</b-link>
                    </li>
                    <li><b>Nils Calixsto</b> (#1), <b>Lars Azada</b> (#2), <b>Felix Balas</b> (#3), <b>Isak Baza</b>
                        (#5), <b>Linnea Bergen</b> (#6),
                        <b>Elsa Orilla</b> (#7), <b>Lucas Alcazar</b> (#8), <b>Gustav Cazar</b> (#9), <b>Axel Calzas</b>
                        (#11), <b>Lidelse Dedos</b> (#14),
                        <b>Birgitta Frente</b> (#18), <b>Vira Frente</b> (#19), <b>Kanon Herrero</b> (#25), <b>Marin
                            Onda</b> (#26) and
                        <b>Brand Tempestad</b> (#33) get together from 7:00 pm to late night on 10-1 at Lars Azada's
                        house -
                        <b-link href="#geospat" @click="set_map('01/10/2014', [1,2,3,5,6,7,8,9,11,14,18,19,25,26,33])">
                            Check
                        </b-link>
                    </li>
                    <li>A group of people meet every Sunday to play golf. On 19-1 there are <b>Ingrid Barranco</b> (#4),
                        <b>Ada Campo-Corrente</b> (#10), <b>Sten Sanjorge Jr.</b> (#31), <b>Orhan Strum</b> (#32), <b>Willem
                            Vasco-Pais</b> (#35) from 2:00 pm to 4:00 pm
                        while a week before Sten and Orhan weren't there. -
                        <b-link href="#geospat" @click="set_map('01/19/2014', [4,10,31,32,35])">Check</b-link>
                    </li>
                </ul>
                <hr class="col-12">
                <p>
                    In addition to this, it is also possible to define some anomalies and suspicious shifts that seem to
                    deviate too much from the usual identified trends:</p>
                <ul>
                    <li><b>Gustav Cazar</b> (#9) seems to be very suspicious, the last movement of the day never
                        coincide with the first one of the following one. -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [9])">Check</b-link>
                    </li>
                    <li><b>Nils Calixsto</b> (#1) often works overtime and then returns home after midnight from the office -
                        <b-link href="#geospat" @click="set_map('01/07/2014', [1])">Check</b-link>
                    </li>
                    <li>A series of suspicious shifts are visible around 3:00 am:
                        <ul>
                            <li>07-1: <b>Loreto Bodrogi</b> (#15) -
                                <b-link href="#geospat" @click="set_map('01/07/2014', [15])">Check</b-link>
                            </li>
                            <li>09-1: <b>Loreto Bodrogi</b> (#15) and <b>Minke Mies</b> (#24) -
                                <b-link href="#geospat" @click="set_map('01/09/2014', [15,24])">Check</b-link>
                            </li>
                            <li>11-1: <b>Isia Vann</b> (#16) and <b>Hennie Osvaldo</b> (#21) -
                                <b-link href="#geospat" @click="set_map('01/11/2014', [16,21])">Check</b-link>
                            </li>
                            <li>14-1: <b>Hennie Osvaldo</b> (#21) and <b>Minke Mies</b> (#24) -
                                <b-link href="#geospat" @click="set_map('01/14/2014', [21,24])">Check</b-link>
                            </li>
                        </ul>
                    </li>
                    <li><b>Isande Borrasca</b> (#28) seems to make very strange movements every day, with non-continuous
                        shifts. Furthermore, he/she always stops far from the GAStech headquarters during working hours,
                        unlike the other colleagues -
                        <b-link href="#geospat" @click="set_map('01/06/2014', [28])">Check</b-link>
                    </li>
                    <li><b>Minke Mies</b> (#24), <b>Hennie Osvaldo</b> (#21), <b>Inga Ferro</b> (#13) and <b>Loreto
                        Bodrogi</b> (#15), in a time that seems to start from 11:30, tend to leave work early to stop
                        for about an hour in places not registered on the map. -
                        <b-link href="#geospat" @click="set_map('01/07/2014', [24,13,15])">Check1</b-link>
                        -
                        <b-link href="#geospat" @click="set_map('01/08/2014', [15,24,21])">Check2</b-link>
                    </li>
                </ul>
                <p class="mt-5"><b>PS:</b> purtroppo c'è stato un problema con i link di questa ultima sezione. Non avevo pensato
                    originariamente di inserirli per cui ho collocato il dato dei giorni nel componente principale e
                    quello
                    dell'orario all'interno di un altro componente - quello della mappa - rendendo (da quanto ho capito)
                    impossibile la modifica del dato presente all'interno del sottocomponente a partire dal componente
                    principale.
                    <br>Essendomi reso conto troppo tardi di questa dimenticanza, non sono riuscito a correggere
                    andando
                    a modificare l'architettura dell'app.
                    L'idea originale era quello di aggiungere, oltre al cambio di giorno e all'highlighting delle
                    persone coinvolte, anche l'orario in cui lo spostamento o l'anomalia si fosse verificata.<br><br>
                    Mi scusi per l'errore.</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import MC2_map from "@/components/MC2_map.vue";
import {crossfilter} from "crossfilter/crossfilter";
import MC2_heatmap from "@/components/MC2_heatmap.vue";
import MC2_piechart from "@/components/MC2_piechart.vue";
import MC2_barchart from "@/components/MC2_barchart.vue";
import MC2_scatterplot from "@/components/MC2_scatterplot.vue";
import MC2_sankey from "@/components/MC2_sankey.vue";

const d3 = require("d3");

let cf;
let dDateLoc;
let dLoc;
let dHour;
let dDate;

let transactions_credit_loyalty = [];
let gps;
let credit_card;
let loyalty_card;

export default {
    name: "MC2_first_part",
    components: {
        MC2_sankey,
        MC2_scatterplot,
        MC2_map,
        MC2_barchart,
        MC2_piechart,
        MC2_heatmap,
    },
    data() {
        return {
            data_for_sankey: {},
            places_for_heatmap: [],
            data_for_heatmap: [],
            data_for_piechart: {},
            data_for_barchart: [],
            data_for_scatterplot: {},
            radio_heatmap: {
                selected: "",
                options: [],
            },
            select_focus: {
                selected: String,
                options: [],
            },
            radio_focus: {
                selected: "",
                options: [],
            },
            radio_map: {
                selected: "",
                options: [],
            },
            point_collection: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            name: "Default point",
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [1, 1],
                        },
                    },
                ],
            },
            data_for_listgroup: [],
            cc_data_for_map: [],
        };
    },
    mounted() {
        Promise.all([
            d3.json("/data/loyalty_data.json"),
            d3.json("/data/cc_data.json"),
            d3.json("/data/gps_cars_assignment_merged.json"),
        ]).then((files) => {
            //Carico i dati e inizializzo le variabili contenenti i record
            const loyaltydata = files[0],
                creditdata = files[1],
                gpsdata = files[2];

            loyalty_card = loyaltydata.map(
                ({location, loyaltynum, price, timestamp}) => {
                    return {
                        date: timestamp,
                        location: location,
                        price: +price,
                        id: loyaltynum,
                    };
                }
            );

            credit_card = creditdata.map(
                ({last4ccnum, location, price, timestamp}) => {
                    return {
                        date: timestamp.split(" ")[0],
                        time: timestamp.split(" ")[1],
                        location: location,
                        price: +price,
                        id: +last4ccnum,
                        hour: timestamp.split(" ")[1].split(":")[0],
                        seconds:
                            +timestamp.split(" ")[1].split(":")[0] * 3600 +
                            +timestamp.split(" ")[1].split(":")[1] * 60,
                    };
                }
            );

            gps = gpsdata
                .map(({id, Timestamp, lat, long, FirstName, LastName}) => {
                    return {
                        id: +id,
                        name: FirstName + " " + LastName,
                        date: Timestamp.split(" ")[0],
                        time: Timestamp.split(" ")[1],
                        lat: lat,
                        long: long,
                    };
                })
                .filter((d) => d.id)
                .filter((d) => d.id < 36);

            d3.flatGroup(credit_card, (d) => d.location).forEach((el) => {
                this.places_for_heatmap.push(el[0]);
            });

            //Merging tra i dataset credit_card e loyalty card
            this.merge_data_cards(credit_card, loyalty_card);

            //Inizializzo crossfilter e le diverse dimensioni
            cf = crossfilter(transactions_credit_loyalty);
            dDateLoc = cf.dimension((d) => [d.date, d.location]);
            dLoc = cf.dimension((d) => d.location);
            dDate = cf.dimension((d) => d.date);

            let transformator = [
                {text: "All", value: "everything"},
                {text: "Only credit cards", value: "credit"},
                {text: "Only loyalty cards", value: "loyalty"},
            ];

            //Gestione delle opzioni per il formgroup dell'heatmap
            transformator.forEach((el) => {
                this.radio_heatmap.options.push(el);
            });
            this.radio_heatmap.selected = this.radio_heatmap.options[0].value;

            //Gestione delle opzioni per i due formgroup
            this.select_focus.options = dLoc
                .group()
                .reduceCount()
                .all()
                .map((v) => v.key);
            this.select_focus.selected = this.select_focus.options[0];

            transformator = [{text: "All", value: "All"}];
            let accumulator = dDate
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

            transformator = transformator.slice(1);
            this.radio_map.options = transformator;
            this.radio_map.selected = this.radio_map.options[0].value;

            this.map_data();
        });
    },
    watch: {
        radio_map: {
            handler(newVal) {
                this.initialize_map(newVal.selected);
            },
            deep: true,
        },
        radio_heatmap: {
            handler(newVal) {
                if (newVal.selected === "everything") {
                    cf = crossfilter(transactions_credit_loyalty);
                } else if (newVal.selected === "credit") {
                    cf = crossfilter(
                        transactions_credit_loyalty.filter((d) => d.loid === null)
                    );
                } else {
                    cf = crossfilter(
                        transactions_credit_loyalty.filter((d) => d.ccid === null)
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
        set_map(selector1, selector3) {
            console.log(selector3)
            this.radio_map.selected = selector1
            setTimeout(() => {
                this.hide_legend()
                for (let i = 0; i < selector3.length; i++) {
                    let el = document.getElementById("id" + selector3[i])
                    el.setAttribute("aria-current", false)
                    el.classList.remove("active")
                    if (d3.selectAll("g.id" + selector3[i]).size() > 0) {
                        d3.selectAll("g.id" + selector3[i])
                            .transition()
                            .duration(700)
                            .style("opacity", 1);
                    }
                }
            }, 1000)

        },
        set_focus(selector1, selector2) {
            this.radio_focus.selected = selector1
            this.select_focus.selected = selector2
        },
        set_radioMap(selector) {
            this.radio_heatmap.selected = selector
        },
        hide_legend() {
            let test = document.getElementsByClassName("legendItem")
            for (let i = 0; i < test.length; i++) {
                test[i].setAttribute("aria-current", true)
                test[i].classList.add("active")
                if (d3.selectAll("g." + test[i].id).size() > 0) {
                    d3.selectAll("g." + test[i].id)
                        .transition()
                        .duration(700)
                        .style("opacity", 0);
                }
            }
        },
        show_legend() {
            let test = document.getElementsByClassName("legendItem")
            for (let i = 0; i < test.length; i++) {
                test[i].setAttribute("aria-current", false)
                test[i].classList.remove("active")
                if (d3.selectAll("g." + test[i].id).size() > 0) {
                    d3.selectAll("g." + test[i].id)
                        .transition()
                        .duration(700)
                        .style("opacity", 1);
                }
            }
        },
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
                        mergedObj = {
                            date: data1[i].date,
                            hour: data1[i].hour,
                            time: data1[i].time,
                            location: data1[i].location,
                            price: data1[i].price,
                            ccid: data1[i].id,
                            loid: data2[j].id,
                        };
                        transactions_credit_loyalty.push(mergedObj);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    mergedObj = {
                        date: data1[i].date,
                        hour: data1[i].hour,
                        time: data1[i].time,
                        location: data1[i].location,
                        price: data1[i].price,
                        ccid: data1[i].id,
                        loid: null,
                    };
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
                    mergedObj = {
                        date: data2[i].date,
                        hour: null,
                        time: null,
                        location: data2[i].location,
                        price: data2[i].price,
                        ccid: null,
                        loid: data2[i].id,
                    };
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

            this.data_for_sankey = {nodes: [], links: []};
            first_filter = first_filter
                .filter((d) => d.time)
                .sort((a, b) => (a.time > b.time ? 1 : -1));
            let time = d3.flatGroup(first_filter, (d) => d.time);
            let cc = d3.flatGroup(first_filter, (d) => d.ccid);
            let lc = d3.flatGroup(first_filter, (d) => d.loid);
            time.forEach((el) => {
                let i = this.data_for_sankey.nodes.length;
                this.data_for_sankey.nodes.push({node: i, name: el[0]});
            });
            cc.forEach((el) => {
                let i = this.data_for_sankey.nodes.length;
                this.data_for_sankey.nodes.push({node: i, name: el[0]});
            });
            lc.forEach((el) => {
                let i = this.data_for_sankey.nodes.length;
                this.data_for_sankey.nodes.push({node: i, name: el[0]});
            });
            first_filter.forEach((el) => {
                let time, cc, lc;
                this.data_for_sankey.nodes.forEach((el2) => {
                    if (el.time === el2.name) {
                        time = el2.node;
                    }
                    if (el.ccid === el2.name) {
                        cc = el2.node;
                    }
                    if (el.loid === el2.name) {
                        lc = el2.node;
                    }
                });

                let data1 = {source: cc, target: lc, value: 0.5};
                let data2 = {source: lc, target: time, value: 0.5};
                let flag1 = false;
                let flag2 = false;

                this.data_for_sankey.links.forEach((el) => {
                    if (el.source === data1.source && el.target === data1.target) {
                        el.value += 0.5;
                        flag1 = true;
                    }
                    if (el.source === data2.source && el.target === data2.target) {
                        el.value += 0.5;
                        flag2 = true;
                    }
                });

                if (!flag1) {
                    this.data_for_sankey.links.push({
                        source: cc,
                        target: lc,
                        value: 0.5,
                    });
                }
                if (!flag2) {
                    this.data_for_sankey.links.push({
                        source: lc,
                        target: time,
                        value: 0.5,
                    });
                }
            });
            this.data_for_sankey.links.sort((a, b) => (a.target > b.target ? 1 : -1));
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
                (d) => d.ccid !== null && d.loid !== null
            );
            this.data_for_piechart["Transactions with both loyalty and credit card"] =
                second_filter.length;

            second_filter = first_filter.filter((d) => d.ccid === null);
            this.data_for_piechart["Transactions with only loyalty card"] =
                second_filter.length;

            second_filter = first_filter.filter((d) => d.loid === null);
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

        get_geojson_from_gps(val) {
            return {
                type: "FeatureCollection",
                features: gps
                    .filter((d) => d.date === String(val))
                    .map((d) => ({
                        type: "Feature",
                        properties: {
                            id: d.id,
                            name: d.name,
                            time: d.time,
                            date: d.date,
                            seconds:
                                +d.time.split(":")[0] * 3600 +
                                +d.time.split(":")[1] * 60 +
                                +d.time.split(":")[2],
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [d.lat, d.long],
                        },
                    })),
            };
        },

        map_data() {
            let temp_gps = d3.flatGroup(gps, (d) => d.id);
            temp_gps.forEach((value) => {
                this.data_for_listgroup.push([value[0], value[1][0].name]);
            });
        },

        initialize_map(val) {
            this.point_collection = this.get_geojson_from_gps(val);

            this.cc_data_for_map = credit_card.filter((d) => d.date === val);
        },
    },
};
</script>

<style scoped></style>
