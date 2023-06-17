<template>
    <b-row class="mt-2">
        <b-col cols="2">
            <b-list-group
                    style="max-height: 733px; overflow: auto"
                    class="shadow-lg"
            >
                <b-list-group-item
                        v-for="elem in data_for_listgroup"
                        :key="elem.listgroup"
                        :id="'id' + elem[0]"
                        class="legendItem"
                        button
                        variant="secondary"
                        @click="click_list"
                >{{ elem[1] }}
                    <b-badge pill variant="dark">{{ elem[0] }}</b-badge>
                </b-list-group-item>
            </b-list-group>
        </b-col>
        <b-col cols="8" style="overflow: auto">
            <svg ref="svg_map" style="height: 733px; width: 1020px;" class="border border-dark shadow-md">
                <image
                        xlink:href="@/assets/MC2-tourist-nuova.jpg"
                        class="image_mappa"
                ></image>
                <g class="abila" ref="abila"></g>
            </svg>
            <b-form-input
                class="mt-2"
                    v-model="value"
                    type="range"
                    min="0"
                    max="86399"
                    @click="stop"
            ></b-form-input>
            <div class="mb-2">Time: <strong>{{ new Date(value * 1000).toISOString().slice(11, 19) }}</strong></div>
            <div>
                <b-button size="sm" class="me-1" variant="secondary" @click="backx2"
                ><img src="../../public/frewind.png"
                /></b-button>
                <b-button size="sm" class="mx-1" variant="secondary" @click="back"
                ><img src="../../public/rewind.png"
                /></b-button>
                <b-button size="sm" class="mx-1" variant="danger" @click="stop"
                ><img src="../../public/pause.png"
                /></b-button>
                <b-button size="sm" class="mx-1" variant="secondary" @click="forward"
                ><img src="../../public/froward.png"
                /></b-button>
                <b-button size="sm" class="ms-1" variant="secondary" @click="forwardx2"
                ><img src="../../public/fforward.png"
                /></b-button>
            </div>
        </b-col>
        <b-col cols="2">
            <b-col cols="12">
                <b-card
                        no-body
                        header="People in movement"
                        header-tag="header"
                        style="height: 355px"
                        class="shadow-lg"
                >
                    <b-card-body class="ps-2 pe-0 pt-0 pb-0">
                        <b-card-text
                                style="overflow: auto; height: 310px; text-align: start"
                        >
                            <p
                                    v-for="elem in in_the_last_hour_gps"
                                    :key="elem.list"
                                    style="font-size: 13px"
                                    class="mt-1"
                            >
                                Name: {{ elem.name }} - Car id: {{ elem.id }}.
                            </p>
                        </b-card-text>
                    </b-card-body>
                </b-card>
            </b-col>
            <b-col cols="12" class="mt-4">
                <b-card
                        no-body
                        header="Transactions in the last 30 minutes"
                        header-tag="header"
                        style="height: 355px"
                        class="shadow-lg"
                >
                    <b-card-body class="ps-2 pe-0 pt-0 pb-0">
                        <b-card-text
                                style="overflow: auto; height: 290px; text-align: start"
                        >
                            <p
                                    v-for="elem in in_the_last_hour_cc"
                                    :key="elem.list"
                                    style="font-size: 13px"
                                    class="mt-1"
                            >
                                Time {{ elem.time }} at {{ elem.location }}. <br/>
                                Price: {{ elem.price }} - Last 4 digit numbers:
                                {{ elem.id }}
                            </p>
                        </b-card-text>
                    </b-card-body>
                </b-card>
            </b-col>
        </b-col>
    </b-row>
</template>

<script>
import MapWithLayers from "@/assets/js/Layers";

const d3 = require("d3");
const map = MapWithLayers(); // component to handle the map

let centroid;
let gAbila;
let scale = 680000;
let boundaries;
let projection;

export default {
    name: "MC2Map",
    data() {
        return {
            in_the_last_hour_cc: [],
            in_the_last_hour_gps: [],
            data_rearranged: [],
            gps_mapping: [],
            value: "0",
            moving: false,
        };
    },
    props: {
        data_for_listgroup: Array,
        cc_data_for_map: Array,
        feature_collection: {
            type: Object,
            default: () => ({
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            name: "Default point",
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [0, 0],
                        },
                    },
                ],
            }),
        },
    },
    mounted() {
        gAbila = d3.select(this.$refs.abila);

        setTimeout(()=>{
            d3.json("/data/Abila_map.geojson").then((abiladata) => {
                const abila = abiladata;
                const fAbila = {
                    ...abila,
                    features: abila.features,
                };

                const extentX = d3.extent(fAbila.features, function (d) {
                    if (d.geometry != null) {
                        return d.geometry.coordinates[0][0];
                    }
                });
                const extentY = d3.extent(fAbila.features, function (d) {
                    if (d.geometry != null) {
                        return d.geometry.coordinates[0][1];
                    }
                });
                centroid = [(extentX[0] + extentX[1]) / 2, (extentY[0] + extentY[1]) / 2];

                map.center(centroid).scale(scale);
                boundaries = d3.select(this.$refs.svg_map).node().getBBox();

                projection = d3
                    .geoMercator()
                    .center(centroid)
                    .scale(scale)
                    .translate([boundaries.width / 2, boundaries.height / 2]);

                d3.select(".image_mappa")
                    .attr("width", boundaries.width)
                    .attr("height", boundaries.height)
                    .attr("x", boundaries.x)
                    .attr("y", boundaries.y);

                gAbila.datum(fAbila).call(map);
        },200)

        });
    },
    watch: {
        value(newVal) {
            this.check_time(newVal);
            this.modify_map(newVal);
        },
        feature_collection() {
            this.moving = false
            setTimeout(() => {
                this.refresh_legendlist()
                this.value = 0;
                this.gps_mapping = this.feature_collection.features.map(
                    (d) => d.properties
                );

                this.check_time(this.value);

                this.data_rearranged = d3.flatGroup(
                    this.feature_collection.features,
                    (d) => d.properties.id
                );

                this.initialize_map()
            },500)

        },
    },
    methods: {
        refresh_legendlist(){
            let test = document.getElementsByClassName("legendItem")
            for (let i = 0; i < test.length; i++){
                test[i].setAttribute("aria-current", false)
                test[i].classList.remove("active")
            }
        },
        click_list(event){
            let active = event.target.ariaCurrent
            if(active === "true"){
                event.target.setAttribute("aria-current", false)
                event.target.classList.remove("active")
            }
            else if (active === "false" || !active){
                event.target.setAttribute("aria-current", true)
                event.target.classList.add("active")
            }
            if(d3.selectAll("g." + event.target.id).size() > 0){
                let currentOpacity = d3.selectAll("g." + event.target.id).style("opacity");
                d3.selectAll("g." + event.target.id)
                    .transition()
                    .duration(700)
                    .style("opacity", currentOpacity == 1 ? 0 : 1);
            }
        },
        modify_map(newVal){
            this.data_rearranged.forEach((el) => {
                let line = ""
                let el2;
                for (let i = 0; i < el[1].length; i++) {
                    if (el[1][i].properties.seconds >= newVal-45 && el[1][i].properties.seconds < newVal){
                        let temp_point = [
                            +el[1][i].geometry.coordinates[1], +el[1][i].geometry.coordinates[0]
                        ];
                        line+= projection(temp_point)[0]+","+projection(temp_point)[1]+" "
                    }
                    if (el[1][i].properties.seconds >= newVal && i > 0) {
                        el2 = el[1][i - 1];
                        let gPoint = gAbila
                            .select("g.id"+el[0])
                            .data([el2])
                            .join("g.id"+el[0])

                        gPoint
                            .selectAll("circle")
                            .data((d) => [d])
                            .join("circle")
                            .attr("cx", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[0];
                            })
                            .attr("cy", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[1];
                            });

                        gPoint
                            .selectAll("text")
                            .data((d) => [d])
                            .join("text")
                            .attr("x", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[0];
                            })
                            .attr("y", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[1];
                            });

                        gPoint
                            .selectAll("polyline")
                            .data((d) => [d])
                            .join("polyline")
                            .attr("points", line)
                        break;
                    }
                    if (el[1][i].properties.seconds < newVal && i === el[1].length - 1) {
                        el2 = el[1][el[1].length - 1];
                        let gPoint = gAbila
                            .select("g.id"+el[0])
                            .data([el2])
                            .join("g.id"+el[0])

                        gPoint
                            .selectAll("circle")
                            .data((d) => [d])
                            .join("circle")
                            .attr("cx", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[0];
                            })
                            .attr("cy", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[1];
                            });

                        gPoint
                            .selectAll("text")
                            .data((d) => [d])
                            .join("text")
                            .attr("x", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[0];
                            })
                            .attr("y", (d) => {
                                let temp_point = [
                                    +d.geometry.coordinates[1],
                                    +d.geometry.coordinates[0],
                                ];
                                return projection(temp_point)[1];
                            });

                        gPoint
                            .selectAll("polyline")
                            .data((d) => [d])
                            .join("polyline")
                            .attr("points", line)
                        break;
                    }
                }
            });
        },

        initialize_map(){
            gAbila.selectAll("g").remove();

            let gPoint = gAbila
                .selectAll("myCircles")
                .data(this.data_rearranged)
                .join("g")
                .attr("class", (d) => "id" + d[1][0].properties.id);

            gPoint
                .selectAll("polyline")
                .data((d) => [d])
                .join("polyline")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", "6")
                .attr("points", (d) => {
                    let stringa = ""
                    let temp_point = [
                        +d[1][0].geometry.coordinates[1],
                        +d[1][0].geometry.coordinates[0],
                    ];
                    stringa+= projection(temp_point)[0]+","+projection(temp_point)[1]
                    return stringa
                })

            gPoint
                .selectAll("circle")
                .data((d) => [d])
                .join("circle")
                .attr("cx", (d) => {
                    let temp_point = [
                        +d[1][0].geometry.coordinates[1],
                        +d[1][0].geometry.coordinates[0],
                    ];
                    return projection(temp_point)[0];
                })
                .attr("cy", (d) => {
                    let temp_point = [
                        +d[1][0].geometry.coordinates[1],
                        +d[1][0].geometry.coordinates[0],
                    ];
                    return projection(temp_point)[1];
                })
                .attr("r", 14)
                .attr("stroke-width", 3)
                .attr("stroke", "black")
                .attr("fill", "lightgrey");

            gPoint
                .selectAll("text")
                .data((d) => [d])
                .join("text")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("x", (d) => {
                    let temp_point = [
                        +d[1][0].geometry.coordinates[1],
                        +d[1][0].geometry.coordinates[0],
                    ];
                    return projection(temp_point)[0];
                })
                .attr("y", (d) => {
                    let temp_point = [
                        +d[1][0].geometry.coordinates[1],
                        +d[1][0].geometry.coordinates[0],
                    ];
                    return projection(temp_point)[1];
                })
                .style("font","bold 14px sans-serif")
                .text((d) => d[1][0].properties.id);
        },

        check_time(newVal) {
            this.in_the_last_hour_cc = this.cc_data_for_map.filter(
                (d) => d.seconds > +newVal - 1800 && d.seconds <= +newVal
            );

            this.in_the_last_hour_gps = []

            let test = d3.flatGroup(this.gps_mapping.filter((d) => d.seconds > +newVal-5 && d.seconds < +newVal+5), d => d.name)
            test.forEach(el => {
                this.in_the_last_hour_gps.push(el[1][0]);
            })
        },

        forward() {
            this.moving = false;
            setTimeout(() => {
                this.moving = true;
                let x = +this.value;
                let a = setInterval(() => {
                    x += 1;
                    this.value = x.toString();
                    if (this.moving === false) {
                        clearInterval(a);
                    }
                    if (x + 1 > 86399) {
                        clearInterval(a);
                        this.value = "86399";
                        this.moving = false;
                    }
                }, 50);
            }, 200);
        },

        forwardx2() {
            this.moving = false;
            setTimeout(() => {
                this.moving = true;
                let x = +this.value;
                let a = setInterval(() => {
                    x += 60;
                    this.value = x.toString();
                    if (this.moving === false) {
                        clearInterval(a);
                    }
                    if (x + 60 > 86399) {
                        clearInterval(a);
                        this.value = "86399";
                        this.moving = false;
                    }
                }, 200);
            }, 200);
        },

        back() {
            this.moving = false;
            setTimeout(() => {
                this.moving = true;
                let x = +this.value;
                let a = setInterval(() => {
                    x -= 1;
                    this.value = x.toString();
                    if (this.moving === false) {
                        clearInterval(a);
                    }
                    if (x - 1 < 0) {
                        clearInterval(a);
                        this.value = "0";
                        this.moving = false;
                    }
                }, 50);
            }, 200);
        },

        backx2() {
            this.moving = false;
            setTimeout(() => {
                this.moving = true;
                let x = +this.value;
                let a = setInterval(() => {
                    x -= 60;
                    this.value = x.toString();
                    if (this.moving === false) {
                        clearInterval(a);
                    }
                    if (x - 60 < 0) {
                        clearInterval(a);
                        this.value = "0";
                        this.moving = false;
                    }
                }, 200);
            }, 200);
        },

        stop() {
            this.moving = false;
        },
    },
};
</script>

<style scoped></style>
