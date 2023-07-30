function geotokml(geojson, documentName = null) {
  const type = geojson.type;

  var kml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<kml xmlns="http://www.opengis.net/kml/2.2">',
  ];

  console.log(type);

  switch (type) {
    case "FeatureCollection":
      kml = kml.concat(featureCollectionToKml(geojson.features, documentName));
      break;
    case "Feature":
      kml = kml.concat(featureToKml(geojson));
      break;
    default:
      break;
  }

  kml.push("</kml>");

  return kml.join("\n");
}

function featureCollectionToKml(features, documentName) {
  var kml = [];

  kml.push("<Document>");

  if (documentName !== null) {
    kml.push(`<name>${documentName}</name>`);
  }

  for (const feature of features) {
    kml = kml.concat(featureToKml(feature));
  }

  kml.push("</Document>");

  return kml;
}

function featureToKml(feature) {
  const geometryType = feature.geometry.type;

  switch (geometryType) {
    case "Polygon":
      return polygonToKml(feature);
    default:
      return [];
  }
}

function polygonToKml(feature) {
  var kml = [];

  const { name, ...properties } = feature.properties;

  const altitude = 100; // 100 meters

  /*const coordinates = feature.geometry.coordinates;
  const coordinatesStr = [];

  for (const coordinate of coordinates) {
    for (const arr of coordinate) {
      if (arr.length < 3) arr.push(altitude);
      coordinatesStr.push(arr.join(","));
    }
  }*/

  //console.log(coordinates);

  if (feature.id !== undefined) {
    kml.push(`<Placemark id="${feature.id}">`);
  } else {
    kml.push("<Placemark>");
  }

  kml.push(`<name>${name}</name>`);
  kml.push("<Polygon>");
  kml.push("<extrude>1</extrude>");
  kml.push(`<altitudeMode>relativeToGround</altitudeMode>`);
  //kml.push("<outerBoundaryIs>");
  //kml.push("<LinearRing>");
  //kml.push(`<coordinates>${coordinatesStr.join(" ")}</coordinates>`);
  //kml.push("</LinearRing>");
  //kml.push("</outerBoundaryIs>");
  kml = kml.concat(polygonCoordinatesToKml(feature.geometry.coordinates, altitude));
  kml.push("</Polygon>");

  // Add other properties as custom data fields
  for (const key in properties) {
    kml.push(`<${key}>${properties[key]}</${key}>`);
  }

  kml.push("</Placemark>");

  return kml;
}

function polygonCoordinatesToKml(coordinates, altitude) {
  const kml = [];

  for (var i = 0; i < 2; i++) {
    if (i > coordinates.length - 1) break;

    const data = [];
    
    for (const point of coordinates[i]) {
      if (point.length < 3) point.push(altitude);
      data.push(point.join(","));
    }

    kml.push(i == 0 ? "<outerBoundaryIs>" : "<innerBoundaryIs>")
    kml.push("<LinearRing>");
    kml.push(`<coordinates>${data.join(" ")}</coordinates>`);
    kml.push("</LinearRing>");
    kml.push(i == 0 ? "</outerBoundaryIs>" : "</innerBoundaryIs>")
  }

  return kml;
}

export default geotokml;
