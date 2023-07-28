function geotokml(geojson, documentName=null) {
    const type = geojson.type;

    var kml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2">',
    ];

    switch (type) {
        case "FeatureCollection":
            kml = kml.concat(featureCollectionToKml(geojson.features, documentName));
            break;

        default:
            break;
    }

    kml.push("</kml>");

    return kml.join('\n');
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
    const kml = [];

    const { name, ...properties } = feature.properties;
    const coordinates = feature.geometry.coordinates;

    const coordinatesStr = [];

    for (const coordinate of coordinates) {
        for (const arr of coordinate) {
            coordinatesStr.push(arr.join(','));
        }
    }

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
    kml.push("<outerBoundaryIs>");
    kml.push("<LinearRing>");
    kml.push(`<coordinates>${coordinatesStr.join(' ')}</coordinates>`);
    kml.push("</LinearRing>");
    kml.push("</outerBoundaryIs>");
    kml.push("</Polygon>");

    // Add other properties as custom data fields
    for (const key in properties) {
        kml.push(`<${key}>${properties[key]}</${key}>`);
    }

    kml.push("</Placemark>");

    return kml;
}

export default geotokml;
