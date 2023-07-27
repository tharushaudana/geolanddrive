<script setup>
import { useRouter } from 'vue-router';
import { storage, selectedDir } from '../storage';
import KmlFile from '../storage/kmlfile';
import { ref } from 'vue';

const router = useRouter();
const dirname = router.currentRoute.value.params.dirname;

storage.selectDir(dirname);

const files = ref(selectedDir.value.files);

selectedDir.value.loadFiles();

function handleFileChooserChange(event) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
            selectedDir.value.addFile(new KmlFile(file.name, e.target.result));
        };

        reader.readAsText(file);
    }
}

function renameFile(file) {
    //var newName = prompt("Enter new file name", file.name);
    //if (newName === null || newName.trim().length === 0) return;
    //file.rename(newName);
    alert("Not implemented yet :(");
}

function deleteFile(file) {
    if (confirm("Are you sure?")) {
        selectedDir.value.deleteFile(file);
    }
}

</script>

<template>
    <div v-if="!storage.isDirExists(dirname)" class="h-100" style="position: relative;">
        <div class="h-100 w-100" style="position: absolute; display: flex; justify-content: center; align-items: center;">
            <div class="text-center">
                <h2 class="text-muted">404 Not Found</h2>
            </div>
        </div>
    </div>
    <div v-else class="d-flex flex-column h-100">
        <div class="flex-shrink-1">
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                    <span class="navbar-brand">Dashborad | <b>{{ dirname }}</b></span>
                </div>
            </nav>
        </div>
        <div v-if="files.length === 0" class="h-100" style="position: relative;">
            <div class="h-100 w-100"
                style="position: absolute; display: flex; justify-content: center; align-items: center;">
                <div class="text-center">
                    <h2 class="text-muted">No KML Files</h2>
                    <br>
                    <input class="form-control" type="file" @change="handleFileChooserChange" multiple>
                </div>
            </div>
        </div>
        <div v-else class="container">
            <br>
            <div class="d-flex">
                <input class="form-control" type="file" @change="handleFileChooserChange" multiple>
                <div style="width: 20px;"></div>
                <RouterLink :to="{name: 'map', params: {dirname: dirname}}"><button class="btn btn-primary">View in Map</button></RouterLink>
            </div>
            <hr>
            <div v-for="file in files" class="card my-2">
                <div class="card-body d-flex w-100">
                    <div class="w-100">{{ file.name }}</div>
                    <div class="flex-shrink-1 d-flex flex-row-reverse">
                        <button class="btn btn-outline-danger" @click="deleteFile(file)">Delete</button>
                        <div style="width: 10px;"></div>
                        <button class="btn btn-outline-warning" @click="renameFile(file)">Rename</button>
                        <div style="width: 10px;"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>