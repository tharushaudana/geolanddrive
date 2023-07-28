<script setup>
import { useRouter } from 'vue-router';
import { storage, selectedDir } from '../storage';
import { onMounted, ref } from 'vue';
import geomap from '../map';

const router = useRouter();
const dirname = router.currentRoute.value.params.dirname;

const lands = ref([]);

storage.selectDir(dirname);

const files = selectedDir.value.files;

selectedDir.value.loadFiles();

onMounted(() => {
    geomap.init("map");
    geomap.loadKmlFiles(files);
    lands.value = geomap.lands;
});

function enableLandEditing(land, b) {
    land.enableEditing(b);
}

</script>

<template>
    <table class="w-100 h-100">
        <tr>
            <td style="width: 280px; padding: 20px 0px;">
                <div class="container h-100">
                    <a href="/"
                        class="d-flex align-items-center pb-3 mb-3 link-body-emphasis text-decoration-none border-bottom">
                        <span class="fs-5 fw-semibold">Collapsible</span>
                    </a>
                    <ul class="list-unstyled ps-0">
                        <li v-for="land in lands">
                            <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                                data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                                <span :class="{'text-danger' : land.editingEnabled,}">{{ land.file.name }}</span>
                            </button>
                            <div class="mb-1">
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;"
                                    @click="land.fitBounds()">View</a> | 
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;"
                                    v-if="!land.editingEnabled" @click="enableLandEditing(land, true)">Edit</a>
                                <a class="fst-italic text-decoration-none" style="font-size: 10px; cursor: pointer;" v-else
                                    @click="enableLandEditing(land, false)">Cancel Edit</a>
                            </div>
                            <div class="collapse show" id="home-collapse">
                                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li v-for="layer in land.drawnItems._layers">
                                        <a href="#" class="link-body-emphasis d-inline-flex text-decoration-none rounded">{{ layer.feature.properties.name }}</a>
                                    </li>
                                </ul>
                            </div>
                            {{ land.notify }}
                            <div class="border-top my-3"></div>
                        </li>
                    </ul>
                </div>
            </td>
            <td>
                <div class="h-100 w-100" id="map"></div>
            </td>
        </tr>
    </table>
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