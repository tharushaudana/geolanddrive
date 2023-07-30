<script setup>
import { useRouter } from 'vue-router';
import { storage, selectedDir } from '../storage';
import { onMounted, reactive, ref } from 'vue';
import { geomap, lands } from '../map';
import { area } from '@turf/turf';
import { calculateMeasureData, calculateAcres } from '../map/measure';

const router = useRouter();
const dirname = router.currentRoute.value.params.dirname;

const measureData = ref({
    acres: 1.5,
    arp: {
        a: 1,
        r: 2,
        p: 3
    },
});

const measureAreaAllLayers = ref('N/A');

const layerOnClickListeners = [];

const clickedLayer = ref({ filename: null, leafletId: null, });

storage.selectDir(dirname);

const files = selectedDir.value.files;

selectedDir.value.loadFiles();

onMounted(() => {
    geomap.init("map");
    geomap.loadKmlFiles(files);
});

function enableLandEditing(land, b) {
    land.enableEditing(b);
}

function createLand() {
    var name = prompt("Enter land name");
    if (name === null || name.trim().length === 0) return;
    geomap.createLand(name, selectedDir.value);
}

function renameLayer(layer, land) {
    console.log(area(layer.toGeoJSON()));

    var name = prompt("Enter land name", layer.feature.properties.name);
    if (name === null || name.trim().length === 0) return;

    layer.feature.properties.name = name;
    layer.setTooltipContent(name);

    land.save();
}

function measureLayer(layer) {
    measureData.value = calculateMeasureData(layer.toGeoJSON());
}

function measureAllLayers() {
    var area = 0;

    for (const land of lands.value) {
        const layers = land.drawnItems.getLayers();

        for (const layer of layers) {
            area += calculateAcres(layer.toGeoJSON());
        }
    }

    measureAreaAllLayers.value = area.toFixed(2);
}

function getAllLayersCount() {
    var c = 0;

    for (const land of lands.value) {
        const layers = land.drawnItems.getLayers();

        c += layers.length;

        //### onclick listener
        for (const layer of layers) {
            if (layerOnClickListeners.includes(layer._leaflet_id)) continue;

            layer.on("click", function (event) {
                clickedLayer.value = {
                    filename: land.file.name,
                    leafletId: layer._leaflet_id,
                }
            });

            layerOnClickListeners.push(layer._leaflet_id);
        }
    }

    return c;
}

function landIsClicked(land, i) {
    if (land.file.name !== clickedLayer.value.filename) return;

    const elem = document.getElementById(`land-collapse-${i}`);

    if (!elem.classList.contains('show')) elem.classList.add('show');

    elem.scrollIntoView({ behavior: 'smooth' });

    clickedLayer.value = { filename: null, leafletId: null, };

    return true;
}

function viewLayer(layer) {
    geomap.fitBounds(layer.getBounds());
}

</script>

<template>
    <div class="d-flex h-100 w-100" style="position: relative;">
        <div class="flex-shrink-1" style="height: calc(100% - 50px); width: 300px; overflow-y: scroll; overflow-x: hidden;">
            <div>
                <nav class="navbar bg-dark">
                    <div class="container-fluid">
                        <span class="navbar-brand mb-0 h1 text-light">GeoLand</span>

                        <div class="dropdown">
                            <a href="#" class="text-decoration-none text-secondary" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false" @click="measureAllLayers()">
                                <span class="text-white-50" style="font-size: 13px;">
                                    <i class="fa-solid fa-circle-info"></i>
                                    &nbsp;
                                    {{ dirname }}
                                </span>
                            </a>
                            <div class="dropdown-menu p-2" style="font-size: 12px;">
                                <b>Total Area: {{ measureAreaAllLayers }} Acres</b>
                            </div>
                        </div>

                    </div>
                </nav>
                <div class="p-3 border-bottom">
                    <button class="btn btn-sm btn-outline-primary" @click="createLand"><i
                            class="fa-solid fa-plus"></i>&nbsp;Create Land</button>
                </div>
                <ul class="list-unstyled ps-0">
                    <li v-for="(land, i) in lands">
                        <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                            data-bs-toggle="collapse" :data-bs-target="'#land-collapse-' + i" aria-expanded="true">
                            <span :class="{ 'text-danger': land.editingEnabled, }" style="white-space: nowrap;">
                                <i class="fa-solid fa-map"></i>&nbsp;&nbsp;
                                {{ land.file.name.replace(".kml", "") }}
                            </span>
                        </button>
                        <div class="collapse" :data="landIsClicked(land, i)" :id="'land-collapse-' + i">
                            <div class="px-2 py-1 bg-body-secondary" style="border-top: 1px dashed #000;">
                                <div class="mb-1">
                                    <a v-if="land.drawnItems.getLayers().length > 0" class="fst-italic text-decoration-none"
                                        style="font-size: 10px; cursor: pointer;" @click="land.fitBounds()">View</a> |
                                    <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;"
                                        v-if="!land.editingEnabled" @click="enableLandEditing(land, true)">Edit</a>
                                    <a class="fst-italic text-decoration-none text-danger"
                                        style="font-size: 10px; cursor: pointer;" v-else
                                        @click="enableLandEditing(land, false)">Cancel Edit</a> |
                                    <a v-if="land.drawnItems.getLayers().length > 0" class="fst-italic text-decoration-none"
                                        style="font-size: 10px; cursor: pointer;"
                                        @click="geomap.downloadLandKml(land)">Download</a>
                                </div>
                                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li v-for="(layer, j) in land.drawnItems.getLayers()"
                                        @mouseenter="land.highlightLayer(layer, true)"
                                        @mouseleave="land.highlightLayer(layer, false)">
                                        <div class="d-flex">
                                            <div class="dropdown">
                                                <a href="#" class="text-decoration-none text-secondary" type="button"
                                                    data-bs-toggle="dropdown" aria-expanded="false"
                                                    @click="measureLayer(layer)">
                                                    <i class="fa-solid fa-circle-info"></i>
                                                </a>
                                                <div class="dropdown-menu p-2" style="font-size: 12px;">
                                                    <b>Acres: {{ measureData.acres }}</b>
                                                    <div style="height: 5px;"></div>
                                                    <table>
                                                        <tr>
                                                            <td>acres:</td>
                                                            <td>{{ measureData.arp.a }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>roods:</td>
                                                            <td>{{ measureData.arp.r }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>perchs:</td>
                                                            <td>{{ measureData.arp.p }}</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                            &nbsp;&nbsp;
                                            <div class="dropdown">
                                                <a href="#" class="text-decoration-none text-secondary"
                                                    @click="geomap.downloadLayerKml(layer)">
                                                    <i class="fa-solid fa-download"></i>
                                                </a>
                                                &nbsp;
                                                <a href="#"
                                                    class="link-body-emphasis d-inline-flex text-decoration-none rounded"
                                                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    {{ layer.feature.properties.name }}
                                                </a>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" href="#" @click="viewLayer(layer)">View</a>
                                                    </li>
                                                    <li><a class="dropdown-item" href="#"
                                                            @click="renameLayer(layer, land)">Rename</a></li>
                                                    <li><a class="dropdown-item text-danger" href="#">Delete</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="p-2" style="position: absolute; bottom: 0; font-size: 10px;">
                <table class="w-100">
                    <tr>
                        <td>Directories:&nbsp;</td>
                        <td>{{ lands.length }}</td>
                    </tr>
                    <tr>
                        <td>Layers:&nbsp;</td>
                        <td>{{ getAllLayersCount() }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="w-100 h-100">
            <div class="h-100 w-100" id="map"></div>
        </div>
    </div>
</template>

<style>
.custom-tooltip {
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
}
</style>