<script setup>
import { onMounted, ref } from 'vue';
import { storage, dirs } from '../storage';

function createDir() {
    var name = prompt("Enter directory name");
    if (name === null || name.trim().length === 0) return;
    storage.createDir(name);
}

function renameDir(dir) {
    var newName = prompt("Enter new directory name", dir.name);
    if (newName === null || newName.trim().length === 0) return;
    dir.rename(newName);
}

function deleteDir(dir) {
    if (confirm("Are you sure?")) {
        storage.deleteDir(dir);
    }
}

</script>

<template>
    <div class="d-flex flex-column h-100">
        <div class="flex-shrink-1">
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                    <span class="navbar-brand">GeoLand Dashborad</span>
                </div>
            </nav>
        </div>
        <div v-if="Object.keys(dirs).length === 0" class="h-100" style="position: relative;">
            <div class="h-100 w-100"
                style="position: absolute; display: flex; justify-content: center; align-items: center;">
                <div class="text-center">
                    <h2 class="text-muted">No Derectories</h2>
                    <br>
                    <button class="btn btn-outline-primary" @click="createDir">Create One</button>
                </div>
            </div>
        </div>
        <div v-else class="container">
            <br>
            <button class="btn btn-outline-primary" @click="createDir">Create New</button>
            <hr>
            <div v-for="dir in dirs" class="card my-2">
                <div class="card-body d-flex w-100">
                    <div class="w-100">{{ dir.name }}</div>
                    <div class="flex-shrink-1 d-flex flex-row-reverse">
                        <button class="btn btn-outline-danger" @click="deleteDir(dir)">Delete</button>
                        <div style="width: 10px;"></div>
                        <button class="btn btn-outline-warning" @click="renameDir(dir)">Rename</button>
                        <div style="width: 10px;"></div>
                        <RouterLink :to="{name: 'dir', params: {dirname: dir.name}}"><button class="btn btn-primary">Go</button></RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>