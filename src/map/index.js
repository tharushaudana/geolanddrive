import MapHandler from "./handler";
import Land from "./land";

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

var lands = [];

var drawnItems = new L.FeatureGroup();
//map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    circle: false,
    marker: false,
    circlemarker: false,
    polygon: {
      allowIntersection: false, // Set to true if you want to allow intersecting edges
      drawError: {
        color: "#b00b00", // Error color for overlapping edges
        timeout: 1000, // Time in milliseconds for displaying the error
      },
      shapeOptions: {
        color: "#3388ff", // Color of the polygon
      },
    },
  },
  edit: {
    featureGroup: drawnItems,
  },
});

function init(id) {
  map = L.map(id).setView([51.505, -0.09], 13);

  googleHybrid.addTo(map);
  googleSat.addTo(map);

  map.on("draw:edited", function (event) {
    console.log(event);
  });

  map.on('zoom', updateTooltipScale);

  mapHandler = new MapHandler(map);

  //map.addControl(drawControl);
  //map.removeControl(drawControl);
}

function loadKmlFiles(files) {
  for (var i = 0; i < files.length; i++) {
    const file = files[i];
    lands.push(Land.fromFile(file, mapHandler));
  }
  
  updateTooltipScale();
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
};

export default geomap;
