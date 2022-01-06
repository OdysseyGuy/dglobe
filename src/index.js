import * as THREE from "three";
import { Vector3 } from "three";

import { OrbitCamera } from "./camera/orbit_camera";
import { convertLatLongAltToVector3 } from "./utils/coordinates";

const CAMERA_FOV = 45;
const Z_NEAR = 0.1;
const Z_FAR = 1000;
const CLEAR_COLOR = 0xc8c8c8;
const GLOBE_RADIUS = 50;
const MIN_ZOOM_DISTANCE = 12;
const MAX_ZOOM_DISTANCE = 90;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  CAMERA_FOV,
  window.innerWidth / window.innerHeight,
  Z_NEAR,
  Z_FAR
);

const webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
webGLRenderer.setSize(window.innerWidth, window.innerHeight);
webGLRenderer.setClearColor(new THREE.Color(CLEAR_COLOR));
webGLRenderer.toneMapping = THREE.ACESFilmicToneMapping;
webGLRenderer.toneMappingExposure = 0.8;

document.body.appendChild(webGLRenderer.domElement);

const size = 30;
const divisions = 30;

// Frame Clock
var clock = new THREE.Clock();

// Grid and axes gizmos
const gridHelper = new THREE.GridHelper(size, divisions);
var axes = new THREE.AxesHelper(20);

// scene.add(gridHelper);
// scene.add(axes);

camera.position.y = 0;
camera.position.z = GLOBE_RADIUS + MAX_ZOOM_DISTANCE;

// Set Camera direction to required location
// Dover [51.1262791, 1.2658841]
// Weymouth [50.4020499, -2.5087742]
const testLocation = new Vector3(50.4020499, -2.5087742);
var location = convertLatLongAltToVector3(
  testLocation.x,
  testLocation.y,
  0,
  GLOBE_RADIUS
);
var location_higher = convertLatLongAltToVector3(
  testLocation.x,
  testLocation.y,
  0.01,
  GLOBE_RADIUS
);

var direction = location.normalize();
var cameraLocation = direction.normalize().multiplyScalar(140);
// console.log(direction.normalize());
var sphereLocation = direction.multiplyScalar(GLOBE_RADIUS);
// console.log(sphereLocation);

var linePoints = [];
linePoints.push(location);
linePoints.push(location_higher);
linePoints.push(location);
const locationLineGeometry = new THREE.BufferGeometry().setFromPoints(
  linePoints
);
const line = new THREE.Line(
  locationLineGeometry,
  new THREE.LineBasicMaterial({ color: 0x0000ff })
);
scene.add(line);

// console.log(cameraLocation);

const locationSphere = new THREE.SphereGeometry(0.4, 6, 6);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(locationSphere, material);

sphere.position.x = location.x;
sphere.position.y = location.y;
sphere.position.z = location.z;
// scene.add(sphere);

// console.log(sphere.position);

camera.position.x = cameraLocation.x;
camera.position.y = cameraLocation.y;
camera.position.z = cameraLocation.z;

let textureLoader = new THREE.TextureLoader();

// Globe
const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 40);
const globeMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color(0xffffff),
});
/*jshint -W024 */
globeMaterial.map = textureLoader.load(
  new URL("../assets/earthdiff10k.jpg", import.meta.url)
);
globeMaterial.bumpMap = textureLoader.load(
  new URL("../assets/earthbump10k.jpg", import.meta.url)
);
globeMaterial.map.anisotropy = 1;
globeMaterial.bumpScale = 1;
globeMaterial.reflectivity = 0;
globeMaterial.shininess = 0;

let globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globeMesh);

// TODO: Use HDR map
// Lighting
const PointLightColor = new THREE.Color(0xdfdfdf);

const ambientLight = new THREE.AmbientLight(0xfff1d4, 1);
const pointLight = new THREE.PointLight(PointLightColor, 1);
const pointLight2 = new THREE.PointLight(PointLightColor, 1);
const pointLight3 = new THREE.PointLight(PointLightColor, 1);
const pointLight4 = new THREE.PointLight(PointLightColor, 1);

pointLight.position.y = 200;
pointLight2.position.y = -200;
pointLight3.position.x = 200;
pointLight4.position.x = -200;

scene.add(ambientLight);
scene.add(pointLight);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);

// Orbit camera
const orbitCamera = new OrbitCamera(camera, webGLRenderer.domElement);
orbitCamera.target = new THREE.Vector3(0, 0, 0);
orbitCamera.enableDamping = false; // remember to call update in animate() if true
orbitCamera.dampingFactor = 0.01;
orbitCamera.zoomSpeed = 0.3;
orbitCamera.rotateSpeed = 0.2;
orbitCamera.minDistance = GLOBE_RADIUS + MIN_ZOOM_DISTANCE;
orbitCamera.maxDistance = GLOBE_RADIUS + MAX_ZOOM_DISTANCE;

// TODO: Stop rendering when there is no user interaction
const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  // console.log(delta === 0 ? 0 : (1 / delta));

  webGLRenderer.render(scene, camera);
};

animate();
