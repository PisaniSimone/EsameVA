<template>
    <svg id="ciao" height="900" width="1200" style="background-color: yellow">
        <g class="abila" ref="abila" ></g>
    </svg>
</template>

<script>

import MapWithLayers from "@/assets/js/Layers";

const d3 = require("d3");
const map = MapWithLayers(); // component to handle the map

export default {
    name: "MC2Map",
    mounted() {
        const gAbila = d3.select(this.$refs.abila);

        d3.json("/data/Abila_map.geojson").then((abiladata) => {
            const abila = abiladata;
            const fAbila = {
                ...abila,
                features: abila.features,
            };

            const extentX = d3.extent(fAbila.features, function(d){
                if(d.geometry != null){
                    return d.geometry.coordinates[0][0]
                }
            });
            const extentY = d3.extent(fAbila.features, function(d){
                if(d.geometry != null){
                    return d.geometry.coordinates[0][1]
                }
            });
            const centroid = [(extentX[0] + extentX[1]) / 2, (extentY[0] + extentY[1]) / 2];

            map.center(centroid)
                .scale(700000)

            gAbila.datum(fAbila).call(map);
        });
    },
};
</script>

<style scoped></style>
