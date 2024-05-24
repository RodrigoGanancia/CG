import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var normalCamera, VRCamera, scene, renderer, delta, clock, directionalLight;
var carousel, innerRing, middleRing, outerRing, mobiusStrip;
var geometry, mesh;

var spotlights = [];
var parametricShapes = [];

const parametricFunctions = [
  torusParametricFunction,
  saddleParametricFunction,
  cylinderParametricFunction,
  coneParametricFunction,
  paraboloidParametricFunction,
  squareParametricFunction,
  hyperboloidParametricFunction,
  sphereParametricFunction,
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
  createMobiusStrip();
  addFloor(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createNormalCamera(x, y, z, lookPosition) {
  "use strict";

  normalCamera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  normalCamera.position.x = x;
  normalCamera.position.y = y;
  normalCamera.position.z = z;

  normalCamera.lookAt(lookPosition);
}

function createVRCamera(x, y, z) {
  VRCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const VRCameraGroup = new THREE.Group();
  VRCameraGroup.add(VRCamera);
  scene.add(VRCameraGroup);
  VRCameraGroup.position.set(x, y, z);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createSpotlight(x, y, z) {
  "use strict ";

  var spotlight = new THREE.SpotLight(0xffffff, 10);
  spotlight.position.set(x, y, z);
  spotlight.target.position.set(x, y + 1, z);
  scene.add(spotlight);
  scene.add(spotlight.target);

  spotlights.push(spotlight);
}

function createDirectionalLight(x, y, z) {
  "use strict";

  directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(x, y, z);

  const target = new THREE.Object3D();
  target.position.set(0, 0, 0);
  directionalLight.target = target;

  scene.add(directionalLight);
  scene.add(target);
}

function createAmbientLight() {
  scene.add(ambientLight);
  ambientLight.visible = true;
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

// Torus
function torusParametricFunction(u, v, target) {
  const R = 0.9;
  const r = 0.5;

  const x = (R + r * Math.cos(2 * Math.PI * u)) * Math.cos(2 * Math.PI * v);
  const y = (R + r * Math.cos(2 * Math.PI * u)) * Math.sin(2 * Math.PI * v);
  const z = r * Math.sin(2 * Math.PI * u);

  target.set(x, y, z);
}

// Saddle
function saddleParametricFunction(u, v, target) {
  const a = 1;
  const b = 1;

  const x = u;
  const y = v;
  const z = (u * u) / (a * a) - (v * v) / (b * b);

  target.set(x, y, z);
}

// "Squashed" cylinder
function cylinderParametricFunction(u, v, target) {
  const r = 1;
  const h = 2;
  const s = 0.5;

  const x = r * Math.cos(2 * Math.PI * u);
  const y = s * r * Math.sin(2 * Math.PI * u);
  const z = h * (v - 0.5);

  target.set(x, y, z);
}

// Truncated cone
function coneParametricFunction(u, v, target) {
  const r1 = 1;
  const r2 = 0.5;
  const h = 2;

  const radius = r1 + (r2 - r1) * v;
  const x = radius * Math.cos(2 * Math.PI * u);
  const y = radius * Math.sin(2 * Math.PI * u);
  const z = h * v;

  target.set(x, y, z);
}

// Paraboloid
function paraboloidParametricFunction(u, v, target) {
  const a = 1.3;
  const b = 1.3;

  const x = a * u * Math.cos(v * 2 * Math.PI);
  const y = a * u * Math.sin(v * 2 * Math.PI);
  const z = b * (u * u);

  target.set(x, y, z);
}

// Square
function squareParametricFunction(u, v, target) {
  const x = (u - 0.5) * 2;
  const y = (v - 0.5) * 2;
  const z = 0;

  target.set(x, y, z);
}

// Hyperboloid
function hyperboloidParametricFunction(u, v, target) {
  const a = 0.8;
  const b = 0.8;
  const vMin = -0.8;
  const vMax = 0.8;

  u = u * 2 * Math.PI;
  v = vMin + v * (vMax - vMin);

  const x = a * Math.cosh(v) * Math.cos(u);
  const y = a * Math.cosh(v) * Math.sin(u);
  const z = b * Math.sinh(v);

  target.set(x, y, z);
}

// Sphere
function sphereParametricFunction(u, v, target) {
  const radius = 1;
  const phi = u * 2 * Math.PI;
  const theta = v * Math.PI;

  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);

  target.set(x, y, z);
}

function addParametricShape(obj, x, y, z, ParametricFunc) {
  "use strict";

  const randomScalar = 0.6 + Math.random() * 0.4;

  geometry = new ParametricGeometry(ParametricFunc);
  material = new THREE.MeshPhongMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
    side: THREE.DoubleSide,
    shading: THREE.FlatShading,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.scale.x *= randomScalar;
  mesh.scale.y *= randomScalar;
  mesh.scale.z *= randomScalar;
  mesh.rotateX(Math.random() * 100);
  mesh.rotateY(Math.random() * 100);
  mesh.rotateZ(Math.random() * 100);
  parametricShapes.push(mesh);

  obj.add(mesh);
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
function createPoint(x, y, z, mat, size) {
  "use strict";
  geometry = new THREE.SphereGeometry(size);
  mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(x, y, z);
  scene.add(mesh);
}

function createMobiusStrip() {
  "use strict";

  geometry = new THREE.BufferGeometry();

  const count = 128;
  const c = new THREE.Vector3(0, collumnHeight + 3, 0);
  const r = 3;
  const size = new THREE.Vector3(1, 0.7, 3);
  let vArray = [];
  let iArray = [];

  for (let i = 0; i < 2 * count; i++) {
    const a = (Math.PI / count) * 2 * i;
    const x = c.x + r * size.x * (1 + 0.5 * Math.cos(a / 2)) * Math.cos(a); // x
    const y = c.y - r * size.y * 0.5 * Math.sin(a / 2); // y
    const z = c.z + r * size.z * (1 + 0.5 * Math.cos(a / 2)) * Math.sin(a); // z
    vArray.push(x); // x
    vArray.push(y); // y
    vArray.push(z); // z
  }
  const vertices = new Float32Array(vArray);

  for (let i = 0; i < count - 1; i++) {
    iArray.push(i, count + i, count + i + 1);
    iArray.push(count + i + 1, i, i + 1);
  }
  iArray.push(count - 1, 2 * count - 1, 0);
  iArray.push(0, count - 1, count);

  material.side = THREE.DoubleSide;

  geometry.setIndex(iArray);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  mobiusStrip = new THREE.Mesh(geometry, material);
  scene.add(mobiusStrip);
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
  var currentCamera = normalCamera;

  if (renderer.xr.isPresenting) {
    currentCamera = VRCamera;
  } else {
    currentCamera = normalCamera;
  }

  renderer.render(scene, currentCamera);
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

  createNormalCamera(25, 30, 5, new THREE.Vector3(0, 10, 0));
  createVRCamera(5, 20, 20);
  createDirectionalLight(20, 30, 5);
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

  normalCamera.aspect = window.innerWidth / window.innerHeight;
  normalCamera.updateProjectionMatrix();
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
      directionalLight.visible = !directionalLight.visible;
      ambientLight.visible = true;
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
  newMaterial.side = THREE.DoubleSide;

  carousel.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material = newMaterial;
    }
  });
  mobiusStrip.material = newMaterial;
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";
}

init();
animate();
