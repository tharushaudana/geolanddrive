import createDrawControl from "./drawcontrol";
import tokml from "tokml";

//https://github.com/mapbox/tokml

class Land {
  constructor(handler) {
    this.drawnItems = new L.FeatureGroup();
    this.drawControl = createDrawControl(this.drawnItems);
    this.file = null;
    this.handler = handler;
  }

  save() {
    var combinedGeoJSON = {
      type: "FeatureCollection",
      features: [],
    };

    //console.log(this.drawnItems.toGeoJSON());

    this.drawnItems.eachLayer(function (layer) {
        
      var geojsonData = layer.toGeoJSON();
      
      console.log(geojsonData);

      /*geojsonData.features.forEach(function (feature) {
        combinedGeoJSON.features.push(feature);
      });*/
      combinedGeoJSON.features.push(geojsonData);
    });

    var kmlData = tokml(this.drawnItems.toGeoJSON(), { name: "Combined KML Layers" });

    console.log(kmlData);
  }

  static fromFile(file, handler) {
    const land = new Land(handler);

    file.reloadContent();

    var geojsonData = toGeoJSON.kml(
      new DOMParser().parseFromString(file.content, "text/xml")
    );

    var geojsonLayer = L.geoJSON(geojsonData, {
      onEachFeature: function (feature, layer) {
        var properties = feature.properties;
        layer.bindTooltip(properties.name, {
          permanent: true,
          direction: "center",
          className: "custom-tooltip",
        });

        layer.on("click", function (event) {
          var properties = event.target.feature.properties;
          console.log("Clicked Feature Properties:", properties);
          //layer.editing.enable();
          //handler.addDrawControlAndRemoveOlds(land.drawControl);
          land.save();
        });
      },
    });

    land.file = file;

    this.#addNonGroupLayers(geojsonLayer, land.drawnItems);

    handler.map.addLayer(land.drawnItems);

    return land;
  }

  static #addNonGroupLayers(layer, group) {
    if (layer instanceof L.LayerGroup) {
      layer.eachLayer(function (layer) {
        Land.#addNonGroupLayers(layer, group);
      });
    } else {
      //console.log(sourceLayer['_leaflet_id']);
      group.addLayer(layer);
      //makeLayerEditableOnClick(layer);
    }
  }
}

export default Land;
