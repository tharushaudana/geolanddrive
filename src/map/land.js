import createDrawControl from "./drawcontrol";
import geotokml from "./geotokml";

class Land {
  constructor(handler) {
    this.drawnItems = new L.FeatureGroup();
    this.drawControl = createDrawControl(this);
    this.file = null;
    this.handler = handler;
    this.notify = 0;

    this.editingEnabled = false;
  }

  addLayer(layer, name) {
    var geojsonData = layer.toGeoJSON();

    geojsonData.properties["name"] = name;

    var geojsonLayer = Land.#createGeoJsonLayer(geojsonData);

    Land.#addNonGroupLayers(geojsonLayer, this.drawnItems);

    this.showToolTips();
    this.save();
  }

  highlightLayer(layer, b) {
    layer.setStyle({ fillColor: b ? "yellow" : "#3388ff" });
  }

  fitBounds() {
    this.handler.map.fitBounds(this.drawnItems.getBounds());
  }

  enableEditing(b) {
    if (!this.editingEnabled && b)
      this.handler.addDrawControlAndRemoveOlds(this.drawControl, this);
    else this.handler.removeCurrentDrawControls();

    this.editingEnabled = b;
  }

  showToolTips() {
    this.drawnItems.eachLayer(function (layer) {
      //layer.setStyle({ color: 'red', fillColor: 'blue', fillOpacity: 0.5 });

      layer.bindTooltip(layer.feature.properties.name, {
        permanent: true,
        direction: "center",
        className: "custom-tooltip",
      });
    });
  }

  save() {
    var geojson = this.drawnItems.toGeoJSON();

    var kmlStr = geotokml(geojson, this.file.name.replace(".kml", ""));

    //console.log(kmlStr);

    this.file.rewriteContent(kmlStr);
  }

  static fromFile(file, handler) {
    const land = new Land(handler);

    land.file = file;

    handler.map.addLayer(land.drawnItems);

    file.reloadContent();

    //### for empty files
    if (file.content.trim().length == 0) return land;

    var geojsonData = toGeoJSON.kml(
      new DOMParser().parseFromString(file.content, "text/xml")
    );

    var geojsonLayer = this.#createGeoJsonLayer(geojsonData);

    this.#addNonGroupLayers(geojsonLayer, land.drawnItems);

    land.showToolTips();

    return land;
  }

  static #createGeoJsonLayer(geojsonData) {
    var geojsonLayer = L.geoJSON(geojsonData, {
      /*onEachFeature: function (feature, layer) {
        var properties = feature.properties;

        layer.bindTooltip(properties.name, {
          permanent: true,
          direction: "center",
          className: "custom-tooltip",
        });

        layer.on("click", function (event) {
          var properties = event.target.feature.properties;
          console.log("Clicked Feature Properties:", properties);
        });
      },*/
    });

    return geojsonLayer;
  }

  static #addNonGroupLayers(layer, group) {
    if (layer instanceof L.LayerGroup) {
      layer.eachLayer(function (layer) {
        Land.#addNonGroupLayers(layer, group);
      });
    } else {
      if (Land.#isOuterBoundaryAndInnerBoundaryAreEqual(layer)) {
        layer.feature.geometry.coordinates.splice(1);
        layer.editing.latlngs[0].splice(1);
      }
      group.addLayer(layer);
    }
  }

  static #isOuterBoundaryAndInnerBoundaryAreEqual(layer) {
    if (layer.feature.geometry.coordinates.length < 2) return false;

    if (
      layer.feature.geometry.coordinates[0].length !==
      layer.feature.geometry.coordinates[1].length
    )
      return false;

    const outer = layer.feature.geometry.coordinates[0];
    const inner = layer.feature.geometry.coordinates[1];

    for (var i = 0; i < outer.length; i++) {
      if (outer[i][0] !== inner[i][0] || outer[i][1] !== inner[i][1])
        return false;
    }

    return true;
  }
}

export default Land;
