import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VRButton } from "three/addons/webxr/VRButton.js";
import * as Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer, delta, clock;
var carousel, innerRing, middleRing, outerRing;
var geometry, mesh;
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const collumnHeight = 20;
const ringHeight = 2;
const ringSpeed = 10;
const carouselRotationSpeed = 0.2;


/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene() {
  "use strict";

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7195a3);

  createCarousel(0, 0, 0);
  addSkydome(0, 0, 0);
  addFloor(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera(x, y, z, lookPosition) {
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

function createLight(x, y, z) {
  "use strict";
  var pointLight = new THREE.PointLight("0xfffff", 19000, 1000);

  pointLight.position.set(x, y, z);
  scene.add(pointLight);
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

function createRing(obj, x, y, z, innerRadius, outerRadius, startHeight) {
  "use strict";

  const ring = new THREE.Object3D();

  ring.userData = {moving: true, way: 1};

  ring.position.set(x, startHeight + ringHeight/2, z);
  addRing(ring, 0, 0, 0, innerRadius, outerRadius);

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

    // Extrude settings
    const extrudeSettings = {
        depth: 2,
        bevelEnabled: false
    };

    // Create extruded geometry
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotateX(Math.PI/2);
    obj.add(mesh);
}


function createCarousel(x, y, z) {
  "use strict";

  carousel = new THREE.Object3D();

  addColumn(carousel, 0, collumnHeight/2, 0);
  innerRing = createRing(carousel, 0, 0, 0, 1, 4, 2 * ringHeight);
  middleRing = createRing(carousel, 0, 0, 0, 4, 7, ringHeight);
  outerRing = createRing(carousel, 0, 0, 0, 7, 10, 0);

  scene.add(carousel);
}

function addSkydome(x, y, z) {

  const texture = new THREE.TextureLoader().load('./img/background.png');

  geometry = new THREE.SphereGeometry(45, 32, 32);
  material = new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: texture });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  scene.add(mesh);
}

function addFloor(x, y, z) {
  geometry = new THREE.PlaneGeometry(100, 100); // width, height
  material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotateX(Math.PI/2);

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
}

function rotateCarousel() {
  carousel.rotateY(delta * carouselRotationSpeed);
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
        ring.position.y += delta* ringSpeed * ring.userData.way;
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
  document.body.appendChild(renderer.domElement);

  createScene();

  clock = new THREE.Clock();

  createCamera(30, 20, 5, new THREE.Vector3(0, 10, 0));

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

  render();

  requestAnimationFrame(animate);
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

  switch(e.key) {
    // Move Inner Ring
    case '1':
      console.log("toggleInnerRing");
      toggleRing(innerRing);
      break;
    // Move Middle Ring
    case '2':
      toggleRing(middleRing);
      break;
    // Move Outer Ring
    case '3':
      toggleRing(outerRing);
      break;
  }
}

function toggleRing(ring) {
  ring.userData.moving = !ring.userData.moving;
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
  "use strict";

}

init();
animate();
