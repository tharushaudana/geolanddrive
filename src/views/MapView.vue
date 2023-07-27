<script setup>
import { useRouter } from 'vue-router';
import { storage, selectedDir } from '../storage';
import { onMounted } from 'vue';
import geomap from '../map';

const router = useRouter();
const dirname = router.currentRoute.value.params.dirname;

storage.selectDir(dirname);

const files = selectedDir.value.files;

selectedDir.value.loadFiles();

onMounted(() => {
    geomap.init("map");
    geomap.loadKmlFiles(files);
});

</script>

<template>
    <div class="h-100 w-100" id="map"></div>
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