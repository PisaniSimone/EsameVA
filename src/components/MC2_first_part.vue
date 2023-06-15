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

            <b-col cols="8" class="offset-2 mb-3" style="text-align: start">
                <p>
                    Come possiamo vedere da questa panoramica iniziale, tra gli esercizi
                    commerciali presenti all'interno dell'isola di Abila possiamo notarne
                    alcuni decisamente più frequentati di altre: principalmente si parla
                    di café e ristoranti come per esempio
                    <strong>Katerina's Cafè</strong>, <strong>Hippokampos</strong>,
                    <strong>Brew've Been Served</strong>,
                    <strong>Hallowed Grounds</strong> o <strong>Guy's Gyros</strong>.
                    Importante è anche porre l'attenzione nel fatto che, in quasi tutti i
                    negozi precedentemente elencati, è possibile notare una più o meno
                    leggera inflessione durante i weekend, giorni nei quali invece tendono
                    ad aumentare le transazioni effettuate nei pressi di località di svago
                    o culturali come <strong>Ahaggo Museum</strong> o
                    <strong>Desafio Golf Course</strong>, generalmente assenti nei giorni
                    infrasettimanali.
                </p>

                <p>
                    Un ulteriore aspetto interessante è rappresentato dalle analisi
                    statistiche effettuate sui dati, facendo riferimento ad indici quali
                    media, modia e deviazione standard. L'analisi, svolta a partire dagli
                    esercizi commerciali prima e sui giorni poi, ha messo in luce una
                    grande disparità circa le transazioni tra i diversi negozi: il fatto
                    che la moda e, soprattutto, la deviazione standard abbiano dei valori
                    superiori alla media aritmetica, identifica una grande dispersione dei
                    diversi valori rispetto ad essa.
                </p>

                <p>
                    D'altro canto, queste anomalie non si presentano in maniera così netta
                    nel caso dell'analisi effettuata sui giorni: qui i patterns sembrano
                    essere decisamente più stabili, con dei trend che tendono a ripetersi
                    come, ad esempio, quello già descritto in precedenza dei fine
                    settimana.
                </p>

                <p>
                    I filtri ci permettono anche di avere una panoramica sulle transazioni
                    effettuate usando solo <b-link @click="set_radioMap('credit')">carta di credito</b-link> o solo <b-link @click="set_radioMap('loyalty')">tessera fedeltà</b-link>. <br/>
                    L'algoritmo su cui si è basato il matching dei dati tra i dataset
                    delle carte di credito e delle tessere fedeltà è, purtroppo,
                    tutt'altro che affidabile per diversi motivi, primo tra tutti, la
                    struttura dei dati.
                </p>

                <p>
                    Il matching è stato effettuato sulla base di tre campi: luogo, prezzo
                    e data della transazione. Tra questi tre dati, solo il primo non
                    presenta particolari problemi: sia il dataset delle carte di credito
                    che quello delle tessere fedeltà, riportavano un campo "data", con la
                    differenza che nel primo caso era presente anche il dato dell'orario
                    della transazione, assente invece nel secondo caso. Per quanto
                    riguarda invece il prezzo, l'algoritmo non tiene conto delle sue sue
                    possibili variazioni come, ad esempio, nel caso di eventuali cashback
                    o di sconti per la tessera fedeltà che in questo modo renderebbero
                    differente lo spostamento di denaro di una stessa transazione.
                </p>

                <p>
                    L'algoritmo, tutto sommato, ha dato dei buoni risultati mostrando che
                    possa esser possibile effettuare una transazione tramite contanti o
                    senza l'utilizzo di una tessera fedeltà. <br/>
                    Il matching però non è riuscito a tracciare delle relazioni 1:1 tra le
                    carte di credito e le tessere fedeltà, sia a causa della già descritta
                    scarsa affidabilità dell'algoritmo ma anche del fatto che le ultime
                    cifre delle carte di credito (usate come id) non siano necessariamente
                    univoche.
                </p>
            </b-col>
        </b-row>

        <b-row class="plots pt-3 section2">
                    <b-col cols="12">
                        <h1>Focused View</h1>
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

            <b-col cols="8" class="offset-2 mb-3" style="text-align: start">
                <p>
                    In questa sezione, l'obiettivo fondamentale è quello di dare una
                    visione più "focus oriented" dei dati, analizzando le transazioni nei
                    diversi esercizi commerciali durante i vari giorni coperti dallo
                    studio.
                </p>

                <p>
                    L'analisi viene condotta tramite l'inserzione di quattro diversi
                    grafici.<br/>
                    Il primo è un diagramma di Sankey che serve per tracciare la relazione
                    [carta di credito-tessera fedeltà-orario transazione] relativamente
                    alle transazioni effettuate durante i vari giorni.<br/>
                    Il secondo è un piechart utilizzato per mostrare le percentuali delle
                    transazioni condotte sia con la carta di credito che con la tessera
                    fedeltà, quelle effettuate utilizzando solo la carta di credito e,
                    infine, quelle riportanti solo l'id della tessera fedeltà.<br/>
                    Il terzo è un barchart che, in un certo senso, semplifica l'analisi
                    condotta all'interno del diagramma di Sankey, rendendo una
                    visualizzazione che ci permette in maniera più rapida di comprendere i
                    vari trend relativi agli orari delle diverse operazioni
                    commerciali.<br/>
                    L'ultimo è uno scatterplot che permette di visualizzare i picchi
                    massimi e minimi di prezzo sia per giorno che per ora nei diversi
                    esercizi commerciali.
                </p>

                <p>
                    L'osservazione dei grafici, oltre a confermare la sensazione circa alcuni trend caratterizzanti gli esercizi commerciali,
                    ha portato alla luce diverse anomalie presenti all'interno dei dati
                </p>

                <ol>
                    <li>Nelle locazioni Bean There Done That, Brewed Awakenings, Coffee Shack e Jack's Magical Beans, tutte le transazioni
                    sembrano esser state fatte esattamente alle ore 12:00.</li>
                    <li>Al Kronos Mart, le transazioni sembrano esser state effettuate in orari decisamente insoliti rispetto a quelli
                    di un normale mercato, probabilmente a causa di un errore esse sono state shiftate di un certo quantitativo di ore.</li>
                    <li>Osservando i minimi e i massimi dei prezzi delle transazioni, nel giorno 13 gennaio alle ore 19:20, al Frydos Autosupply n' More
                        sembra esser stata effettuata una transazione il cui prezzo si distacca in maniera spropositata dalla media.</li>
                </ol>
            </b-col>
        </b-row>
        <b-row class="maps pt-3">
            <b-col cols="12" class="mb-3">
                <h1>Geo-Spatial View</h1>
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
                class="obs pt-3 my-3"
                style="background-color: #001427; color: whitesmoke"
        >
            <b-col cols="8" class="my-3 offset-2">
                <h1>Observations:</h1>
            </b-col>

            <b-col cols="8" class="offset-2 mb-3" style="text-align: start">
                <p>
                    In questa ultima sezione, il focus principale è stato quello di analizzare i dati geospaziali relativi soprattutto
                    agli spostamenti dei diversi abitanti dell'isola all'interno della città.
                    La sezione si compone di un filtro sui giorni ed uno sugli orari, permettendo di corprire tutti i secondi presenti all'interno dell'arco
                    di una giornata.
                </p>
                <p>

                </p>
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
import MC2_sankey from "@/components/MC2_sankey.vue";

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

            gpsdata.forEach(el => {
                delete el.CurrentEmploymentType;
                delete el.CurrentEmploymentTitle;
            })

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
            let accumulator = [];
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
        set_radioMap(selector){
            this.radio_heatmap.selected = selector
        },
        hide_legend(){
            let test = document.getElementsByClassName("legendItem")
            for(let i = 0; i<test.length; i++){
                test[i].setAttribute("aria-current", true)
                test[i].classList.add("active")
                if(d3.selectAll("g." + test[i].id).size() > 0){
                    d3.selectAll("g." + test[i].id)
                        .transition()
                        .duration(700)
                        .style("opacity", 0);
                }
            }
        },
        show_legend(){
            let test = document.getElementsByClassName("legendItem")
            for(let i = 0; i<test.length; i++){
                test[i].setAttribute("aria-current", false)
                test[i].classList.remove("active")
                if(d3.selectAll("g." + test[i].id).size() > 0){
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
                return;
            });
            cc.forEach((el) => {
                let i = this.data_for_sankey.nodes.length;
                this.data_for_sankey.nodes.push({node: i, name: el[0]});
                return;
            });
            lc.forEach((el) => {
                let i = this.data_for_sankey.nodes.length;
                this.data_for_sankey.nodes.push({node: i, name: el[0]});
                return;
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
                        return;
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
            const fc = {
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
            return fc;
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
