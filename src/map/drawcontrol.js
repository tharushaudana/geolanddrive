function createDrawControl(land) {
  var control = new L.Control.Draw({
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
      featureGroup: land.drawnItems,
    },
  });

  //### Custom parameter
  control["land"] = land;

  return control;
}

export default createDrawControl;
