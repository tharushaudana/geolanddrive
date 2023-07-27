<script setup>
import { ref } from 'vue';

</script>

<template>
  <div class="container" style="margin-top: 30px;">
    <center>
      <h1 class="display-1">GeoLand Drive</h1>
      <p class="display-6">Simple tool for manage KML files.</p>
      <hr/>
      <span>Sync files with <b>Google Drive</b> [Not yet developed]</span>
      <br>
      <span>Simple and Easy</span>
      <hr/>
      <div style="height: 20px;"></div>
      <RouterLink :to="{name: 'dashboard'}">
        <button class="btn btn-primary">Go To Dashboard</button>
      </RouterLink>
      <div style="height: 50px;"></div>
      Read our <RouterLink :to="{name: 'privacy'}">Privacy Policies</RouterLink>
    </center>
  </div>
</template>
