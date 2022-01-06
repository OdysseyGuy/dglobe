import { Vector3 } from "three";

/**
 * Converts spherical coordinates to cartesian coordinates.
 * @param {number} lat Latitude
 * @param {number} long Longitude
 * @param {number} altitude Altitude
 * @param {number} radius Radius of the sphere/globe
 * @returns Cartesian coorinates
 */
function convertLatLongAltToVector3(lat, long, altitude, radius) {
  var phi = (lat * Math.PI) / 180;
  // Texture mismatch with longitude (about 0.2)
  var theta = ((long - 180) * Math.PI) / 180;

  var x = -(radius + altitude) * Math.cos(phi) * Math.cos(theta);
  var y = (radius + altitude) * Math.sin(phi);
  var z = (radius + altitude) * Math.cos(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}

export { convertLatLongAltToVector3 };
