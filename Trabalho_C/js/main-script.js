import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer, delta, clock, pointLight;
var carousel, innerRing, middleRing, outerRing;
var geometry, mesh;

var spotlights = [];
var parametricShapes = [];

var parametricFunctions = [
  parametricFunction1,
  parametricFunction2,
  parametricFunction3,
  parametricFunction4,
  parametricFunction5,
];
const ambientLight = new THREE.AmbientLight(0xffa500, 0.5);

const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 100,
});
const toonMaterial = new THREE.MeshToonMaterial({ color: 0x0000ff });
const normalMaterial = new THREE.MeshNormalMaterial();
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

var material = basicMaterial;

const collumnHeight = 20;
const ringHeight = 2;
const ringSpeed = 10;
const carouselRotationSpeed = 0.5;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
  "use strict";

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7195a3);

  addSkydome();
  createCarousel(0, 0, 0);
  addFloor(0, 0, 0);

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera(x, y, z, lookPosition) {
  "use strict";

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.x = x;
  camera.position.y = y;
  camera.position.z = z;

  camera.lookAt(lookPosition);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createSpotlight(x, y, z) {
  'use strict '

  var spotlight = new THREE.SpotLight(0xffffff, 10);
  spotlight.position.set(x, y, z);
  spotlight.target.position.set(x, y + 1, z);
  scene.add(spotlight);
  scene.add(spotlight.target);

  spotlights.push(spotlight);
}

function createLight(x, y, z) {
  "use strict";

  pointLight = new THREE.PointLight(0xffffff, 100, 300);
  pointLight.position.set(x, y, z);
  scene.add(pointLight);
}

function createAmbientLight() {
  scene.add(ambientLight);
  ambientLight.visible = false;
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addColumn(obj, x, y, z) {
  "use strict";
  geometry = new THREE.CylinderGeometry(1, 1, 20, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function parametricFunction1(u, v, target) {
  u = u * 2 * Math.PI - Math.PI;
  v = v * 2 * Math.PI - Math.PI;

  var x = Math.sin(u) * Math.sin(v) + 0.05 * Math.cos(20 * v);
  var y = Math.cos(u) * Math.sin(v) + 0.05 * Math.cos(20 * u);
  var z = Math.cos(v);

  target.set(x, y, z);
}

function parametricFunction2(u, v, target) {
  var u = u * 2 * Math.PI;
  var v = v * 2 * Math.PI - Math.PI;

  var x = Math.cos(u);
  var y = Math.sin(u) + Math.cos(v);
  var z = Math.sin(v);

  target.set(x, y, z);
}

function parametricFunction3(u, v, target) {
  var u = u * 2;
  var v = v * 4 * Math.PI;

  var x = Math.cos(v) * Math.sin(u);
  var y = Math.sin(v) * Math.sin(u);
  var z = 0.2 * v + (Math.cos(u) + Math.log(Math.tan(u / 2)));

  target.set(x, y, z);
}

function parametricFunction4(u, v, target) {
  var a = 1;
  var n = 1;
  var m = 1;

  var u = u * 2 * Math.PI;
  var v = v * 2 * Math.PI;

  var x =
    (a +
      Math.cos((n * u) / 2.0) * Math.sin(v) -
      Math.sin((n * u) / 2.0) * Math.sin(2 * v)) *
    Math.cos((m * u) / 2.0);
  var y =
    (a +
      Math.cos((n * u) / 2.0) * Math.sin(v) -
      Math.sin((n * u) / 2.0) * Math.sin(2 * v)) *
    Math.sin((m * u) / 2.0);
  var z =
    Math.sin((n * u) / 2.0) * Math.sin(v) +
    Math.cos((n * u) / 2.0) * Math.sin(2 * v);

  target.set(x, y, z);
}

function parametricFunction5(u, v, target) {
  var u = u * Math.PI;
  var v = v * 4 * Math.PI;

  var x = Math.pow(1, v) * Math.pow(Math.sin(u), 0.3) * Math.sin(v);
  var y = v * Math.sin(u * 0.5) * Math.cos(u * 0.6);
  var z = Math.pow(1, v) * Math.pow(Math.sin(u), 0.1) * Math.cos(v);

  target.set(x, y, z);
}

function addParametricShape(obj, x, y, z, ParametricFunc) {
  "use strict";

  geometry = new ParametricGeometry(ParametricFunc);
  material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    side: THREE.DoubleSide,
    shading: THREE.FlatShading,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  parametricShapes.push(mesh);

  obj.add(mesh);
  
  return mesh;
}

function createRing(obj, x, y, z, innerRadius, outerRadius, startHeight) {
  "use strict";

  const ring = new THREE.Object3D();

  ring.userData = { moving: true, way: 1 };

  ring.position.set(x, startHeight + ringHeight / 2, z);
  addRing(ring, x, y, z, innerRadius, outerRadius);

  obj.add(ring);

  return ring;
}

function addRing(obj, x, y, z, innerRadius, outerRadius) {
  "use strict";

  // Create outer circle
  const shape = new THREE.Shape();
  shape.moveTo(outerRadius, 0);
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

  // Create inner circle
  const holePath = new THREE.Path();
  holePath.moveTo(innerRadius, 0);
  holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(holePath);

  const extrudeSettings = {
    depth: 2,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotateX(Math.PI / 2);
  obj.add(mesh);
}

function createParametricShapes(x, y, z) {
  for (var i = 0; i < 8; i++) {
    var x = Math.cos((Math.PI / 4) * i) * 3.5;
    var z = Math.sin((Math.PI / 4) * i) * 3.5;
    addParametricShape(
      innerRing,
      x,
      y,
      z,
      parametricFunctions[
        Math.floor(Math.random() * parametricFunctions.length)
      ],
    );
    createSpotlight(x, y, z);
    


    var x = Math.cos((Math.PI / 4) * i) * 6.5;
    var z = Math.sin((Math.PI / 4) * i) * 6.5;
    addParametricShape(
      middleRing,
      x,
      y,
      z,
      parametricFunctions[
        Math.floor(Math.random() * parametricFunctions.length)
      ],
    );
    createSpotlight(x, y, z);
    


    var x = Math.cos((Math.PI / 4) * i) * 9.5;
    var z = Math.sin((Math.PI / 4) * i) * 9.5;
    addParametricShape(
      outerRing,
      x,
      y,
      z,
      parametricFunctions[
        Math.floor(Math.random() * parametricFunctions.length)
      ],
    );
    createSpotlight(x, y, z);

  }
}

function createCarousel(x, y, z) {
  "use strict";

  carousel = new THREE.Object3D();

  addColumn(carousel, 0, collumnHeight / 2, 0);
  innerRing = createRing(carousel, x, y, z, 2, 5, 2 * ringHeight);
  middleRing = createRing(carousel, x, y, z, 5, 8, ringHeight);
  outerRing = createRing(carousel, x, y, z, 8, 11, 0);
  createParametricShapes(x, 1, z);

  scene.add(carousel);
}

function addSkydome() {
  "use strict";

  var texture = new THREE.TextureLoader().load("./img/background.png");

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  var skyMaterial = new THREE.MeshBasicMaterial({ map: texture });
  var skyGeometry = new THREE.SphereGeometry(40, 40, 40);

  var sky = new THREE.Mesh(skyGeometry, skyMaterial);
  sky.material.side = THREE.BackSide;
  scene.add(sky);
}

function addFloor(x, y, z) {
  geometry = new THREE.PlaneGeometry(100, 100); // width, height
  material = new THREE.MeshBasicMaterial({
    color: 0x990000,
    side: THREE.DoubleSide,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotateX(Math.PI / 2);

  scene.add(mesh);
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

  delta = clock.getDelta();

  tryMovingRing(innerRing);
  tryMovingRing(middleRing);
  tryMovingRing(outerRing);
  rotateCarousel();
  rotateParametricShapes();
}

function rotateCarousel() {
  carousel.rotateY(delta * carouselRotationSpeed);
}

function rotateParametricShapes() {
  for (var parametricShape of parametricShapes) {
    parametricShape.rotateX(delta * carouselRotationSpeed);
    parametricShape.rotateY(delta * carouselRotationSpeed);
    parametricShape.rotateZ(delta * carouselRotationSpeed);
  }
}

function tryMovingRing(ring) {
  if (ring.userData.moving) {
    if (ring.userData.way == 1) {
      if (ring.position.y > collumnHeight) {
        ring.position.y = collumnHeight;
        ring.userData.way = -ring.userData.way;
      } else {
        ring.position.y += delta * ringSpeed * ring.userData.way;
      }
    } else {
      if (ring.position.y < ringHeight) {
        ring.position.y = ringHeight;
        ring.userData.way = -ring.userData.way;
      } else {
        ring.position.y += delta * ringSpeed * ring.userData.way;
      }
    }
  }
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
  renderer.xr.enabled = true;

  document.body.appendChild(VRButton.createButton(renderer));

  document.body.appendChild(renderer.domElement);

  createScene();

  clock = new THREE.Clock();

  createCamera(30, 20, 5, new THREE.Vector3(0, 10, 0));
  createLight(10, 20, 0);
  createAmbientLight();

  window.addEventListener("resize", onResize, false);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
  "use strict";

  update();

  renderer.setAnimationLoop(function () {
    update();
    render();
  });
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

  switch (e.key) {
    // Move Inner Ring
    case "1":
      toggleRing(innerRing);
      break;
    // Move Middle Ring
    case "2":
      toggleRing(middleRing);
      break;
    // Move Outer Ring
    case "3":
      toggleRing(outerRing);
      break;
    case "q":
    case "Q":
      setMaterial(lambertMaterial);
      break;
    case "w":
    case "W":
      setMaterial(phongMaterial);
      break;
    case "e":
    case "E":
      setMaterial(toonMaterial);
      break;
    case "r":
    case "R":
      setMaterial(normalMaterial);
      break;
    case "t":
    case "T":
      setMaterial(basicMaterial);
      break;
    case "d":
    case "D":
      pointLight.visible = !pointLight.visible;
      ambientLight.visible = ambientLight.visible = true;
      break;
    case "s":
    case "S":
      for (var i = 0; i < spotlights.length; i++) {
        spotlights[i].visible = !spotlights[i].visible;
      }
      break;
  }
}

function toggleRing(ring) {
  ring.userData.moving = !ring.userData.moving;

}

function setMaterial(newMaterial) {
  carousel.traverse(function (node) {
    if (node instanceof THREE.Mesh ) {
      node.material = newMaterial;
    }
  });
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";
}

init();
animate();
