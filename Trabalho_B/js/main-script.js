import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var geometry, material, material2, mesh;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(10));

    createCrane(0,0,0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 0;
    camera.position.y = 70;
    camera.position.z = 70;
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addFrontBoom(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(45, 2.5, 2.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x + 22.5, y, z);
    obj.add(mesh);
}

function addBackBoom(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(10, 2.5, 2.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - 5, y, z);
    obj.add(mesh);
}

function addCounterWeight(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(3, 2, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x , y - 1, z);
    obj.add(mesh);
}

function addUpperCrane(obj, x, y, z) {
    'use strict'

    addFrontBoom(obj, x + 1.25, y + 1.5, z);
    addBackBoom(obj, x - 1.25, y + 1.5, z);
    addCounterWeight(obj, x - 6.75, y, z);
    addCraneHolder(obj, x, y, z);
}

function addBase(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.BoxGeometry(5, 3, 5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 1.5, z);
    obj.add(mesh);
}

function addTower(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(2.5, 45, 2.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 22.5, z);
    obj.add(mesh);
}

function addCraneHolder(obj, x, y, z) {
    'use strict'

    geometry = new THREE.CylinderGeometry(0, 1.768, 6, 4, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    mesh.position.set(x, y + 2, z);
    obj.add(mesh);
}

function createCrane(x, y, z) {
    'use strict';

    var crane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBase(crane, 0, 0, 0);
    addTower(crane, 0, 3, 0);
    addUpperCrane(crane, 0, 48, 0);

    scene.add(crane);

    crane.position.x = x;
    crane.position.y = y;
    crane.position.z = z;
}





//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////

function render() {
    'use strict';

    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();