<script setup>
import { useRouter } from 'vue-router';
import { storage, selectedDir } from '../storage';
import { onMounted, reactive, ref } from 'vue';
import { geomap, lands } from '../map';

const router = useRouter();
const dirname = router.currentRoute.value.params.dirname;

//const lands = ref([]);

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

</script>

<template>
    <div class="d-flex h-100 w-100">
        <div class="flex-shrink-1 h-100" style="width: 300px; overflow-y: scroll;">
            <div>
                <nav class="navbar bg-dark">
                    <div class="container-fluid">
                        <span class="navbar-brand mb-0 h1 text-light">GeoLand<br><span class="text-white-50" style="font-size: 13px;">{{ dirname }}</span></span>
                    </div>
                </nav>
                <div class="p-3 border-bottom">
                    <button class="btn btn-sm btn-outline-primary" @click="createLand"><i class="fa-solid fa-plus"></i>&nbsp;Create Land</button>
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
                        <div class="collapse bg-body-secondary px-2 py-1" :id="'land-collapse-' + i">
                            <div class="mb-1">
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;"
                                    @click="land.fitBounds()">View</a> |
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;"
                                    v-if="!land.editingEnabled" @click="enableLandEditing(land, true)">Edit</a>
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;" v-else
                                    @click="enableLandEditing(land, false)">Cancel Edit</a> |
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;"
                                    @click="land.fitBounds()">Download</a>
                            </div>
                            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li v-for="layer in land.drawnItems._layers">
                                    <i class="fa-solid fa-globe"></i>&nbsp;&nbsp;
                                    <a href="#" class="link-body-emphasis d-inline-flex text-decoration-none rounded">{{
                                        layer.feature.properties.name }}</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
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