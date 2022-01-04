/** 3d cubic bezier curve for each route */
class AirRoute extends THREE.CubicBezierCurve3 {
  constructor(startLat, startLong, destLat, destLong, pathResolution) {
    this.startLat = startLat;
    this.startLong = startLong;
    this.destLat = destLat;
    this.destLong = destLong;
    this.pathResolution = pathResolution;

    this.calcCurve = () => {};
  }
}