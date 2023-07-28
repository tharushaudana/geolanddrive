import { area } from "@turf/turf";

const SQUARE_METERS_FOR_PERCH = 25.2928526;
const PERCHS_FOR_ACRE = 160;
const PERCHS_FOR_ROOD = 40;

function calculateMeasureData(geojson) {
  const perchs = squareMeetersToPerchs(area(geojson));
  const acres = perchs / PERCHS_FOR_ACRE;

  return {
    acres: acres.toFixed(2),
    arp: calculateARP(perchs),
  };
}

function calculateARP(perchs) {
  const acres = parseInt(perchs / PERCHS_FOR_ACRE);
  perchs -= acres * PERCHS_FOR_ACRE;

  const roods = parseInt(perchs / PERCHS_FOR_ROOD);
  perchs -= roods * PERCHS_FOR_ROOD;

  return {
    a: acres,
    r: roods,
    p: perchs.toFixed(2),
  };
}

function squareMeetersToPerchs(squareMeeters) {
  return squareMeeters / SQUARE_METERS_FOR_PERCH;
}

export default calculateMeasureData;
