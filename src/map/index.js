import { ref } from "vue";
import MapHandler from "./handler";
import Land from "./land";
import geotokml from "./geotokml";

const googleHybrid = L.tileLayer(
  "http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

const googleSat = L.tileLayer(
  "http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

var map = null;

var mapHandler = null;

var mapData = {
  /*"dirname": {
        drawnItems
    }*/
};

var lands = ref([]);

function init(id) {
  map = L.map(id).setView([5.991659323751306, 80.72153689607822], 18);

  googleHybrid.addTo(map);
  googleSat.addTo(map);

  map.on("draw:edited", (e) => {
    mapHandler.currentDrawControl.land.save();
  });

  map.on('draw:created', (e) => {
    var name = prompt("Enter layer name:");
    mapHandler.currentDrawControl.land.addLayer(e.layer, name);
  });

  map.on('zoom', updateTooltipScale);

  mapHandler = new MapHandler(map);

  //map.addControl(drawControl);
  //map.removeControl(drawControl);
}

function loadKmlFiles(files) {
  for (var i = 0; i < files.length; i++) {
    const file = files[i];
    lands.value.push(Land.fromFile(file, mapHandler));
  }
  
  updateTooltipScale();
}

function createLand(name, dir) {
  const file = dir.createFile(name + ".kml");
  lands.value.push(Land.fromFile(file, mapHandler));
}

function fitBounds(bouds) {
  map.fitBounds(bouds);
}

function downloadLandKml(land) {
  const kmlData = geotokml(land.drawnItems.toGeoJSON(), land.file.name.replace(".kml", ""));
  downloadKmlFile(land.file.name, kmlData);
}

function downloadLayerKml(layer) {
  const kmlData = geotokml(layer.toGeoJSON(), layer.feature.properties.name);
  downloadKmlFile(layer.feature.properties.name + ".kml", kmlData);
}

function downloadKmlFile(name, kmlData) {
  var blob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml;charset=utf-8' });
  var url = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();

  // Cleanup
  URL.revokeObjectURL(url);
}

function updateTooltipScale() {
  var zoom = map.getZoom();

  var scale = (1 / 21) * zoom;

  var tooltips = document.getElementsByClassName("custom-tooltip");

  for (var i = 0; i < tooltips.length; i++) {
    tooltips[i].style.fontSize = 10 * scale + "px";
  }
}

const geomap = {
  init: init,
  loadKmlFiles: loadKmlFiles,
  createLand: createLand,
  fitBounds: fitBounds,
  downloadLandKml: downloadLandKml,
  downloadLayerKml: downloadLayerKml,
  lands: lands,
};

export { geomap, lands };
