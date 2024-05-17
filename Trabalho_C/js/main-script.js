import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var column, innerRing;
var geometry, mesh;
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
  "use strict";

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7195a3);

  createCarousel(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera(x, y, z) {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.x = x;
  camera.position.y = y;
  camera.position.z = z;
  camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLight(x, y, z) {
  "use strict";
  var pointLight = new THREE.PointLight("0xfffff", 19000, 1000);

  pointLight.position.set(x, y, z);
  scene.add(pointLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createColumn(obj, x, y, z) {
  "use strict";

  column = new THREE.Object3D();

  column.position.set(x, y, z);
  addColumn(column, x, y, z);

  obj.add(column);
}

function addColumn(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(5, 5, 100, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createInnerRing(obj, x, y, z) {
  "use strict";

  innerRing = new THREE.Object3D();

  innerRing.position.set(x, y, z);
  addInnerRing(innerRing, x, y, z);

  obj.add(innerRing);
}

function addInnerRing(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(10, 10, 20, );
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createCarousel(x, y, z) {
  "use strict";

  var carousel = new THREE.Object3D();

  createColumn(carousel, x, y, z);
  createInnerRing(carousel, x, y, z);
  //createMiddleRing(carousel, x, y, z);
  //createOuterRing(carousel, x, y, z);
  //createMiddleRing(carousel, x, y, z);

  scene.add(carousel);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////

function checkCollisions() {
  "use strict";
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////

function handleCollisions() {
  "use strict";
}

////////////
/* UPDATE */
////////////

function update() {
  "use strict";
}

/////////////
/* DISPLAY */
/////////////

function render() {
  "use strict";

  renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
  "use strict";

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createScene();
  createCamera(20, 70, 70);

  render();
  window.addEventListener("resize", onResize, false);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
  "use strict";
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////

function onResize() {
  "use strict";

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
  "use strict";
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";
}

init();
animate();

