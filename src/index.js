import * as THREE from 'three';

import {OrbitCamera} from './camera/orbit_camera';

const CAMERA_FOV = 45;
const Z_NEAR = 0.1;
const Z_FAR = 1000;
const CLEAR_COLOR = 0xC8C8C8;
const GLOBE_RADIUS = 1;
const MIN_ZOOM_DISTANCE = 0.2;
const MAX_ZOOM_DISTANCE = 3;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV, window.innerWidth / window.innerHeight, Z_NEAR, Z_FAR);

const webGLRenderer = new THREE.WebGLRenderer({antialias: true});
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
camera.position.z = MAX_ZOOM_DISTANCE;

let textureLoader = new THREE.TextureLoader();

// Globe
const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 40, 40);
const globeMaterial =
    new THREE.MeshPhongMaterial({color: new THREE.Color(0xFFFFFF)});
/*jshint -W024 */
globeMaterial.map =
    textureLoader.load(new URL('../assets/earthdiff10k.jpg', import.meta.url));
globeMaterial.bumpMap =
    textureLoader.load(new URL('../assets/earthbump10k.jpg', import.meta.url));
globeMaterial.bumpScale = 0.02;
globeMaterial.reflectivity = 0;
globeMaterial.shininess = 0;

let globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globeMesh);

// TODO: Use HDR map
// Lighting
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
const directionalLight = new THREE.PointLight(0xD6D6D6, 1);
const directionalLight2 = new THREE.PointLight(0xD6D6D6, 1);
const directionalLight3 = new THREE.PointLight(0xD6D6D6, 1);
const directionalLight4 = new THREE.PointLight(0xD6D6D6, 1);

directionalLight.position.y = 30;
directionalLight2.position.y = -30;
directionalLight3.position.x = 30;
directionalLight4.position.x = -30;

scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLight2);
scene.add(directionalLight3);
scene.add(directionalLight4);

// Orbit camera
const orbitCamera = new OrbitCamera(camera, webGLRenderer.domElement);
orbitCamera.target = new THREE.Vector3(0, 0, 0);
orbitCamera.enableDamping =
    false;  // remember to call update in animate() if true
orbitCamera.dampingFactor = 0.01;
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