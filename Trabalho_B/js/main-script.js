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
var cart;

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

function addBoom(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(57.5, 2.5, 2.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x + 16.5, y, z);
    obj.add(mesh);
}

function addCounterWeight(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(3, 2, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x , y - 1, z);
    obj.add(mesh);
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
    mesh.position.set(x, y + 3, z);
    obj.add(mesh);
}

function addCabin(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(3, 3, 3);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z + 1.5);
    obj.add(mesh);
}

function createHook(obj, x, y, z) {
    'use strict';

    var hook = new THREE.Object3D();
    obj.add(hook);
}

function addCart(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(2.5, 1, 2.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 0.5, z);
    obj.add(mesh);
}

function addCable(obj, x, y, z) {
    geometry = new THREE.CylinderGeometry(0.3, 0.3, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 10, z);
    obj.add(mesh);
}

function createCart(obj, x, y, z) {
    'use strict';

    cart = new THREE.Object3D();
    cart.userData = { step: 0.0 };
    addCart(cart, x + 22.5, y, z);
    addCable(cart, x + 22.5, y - 1, z);
    createHook(cart)
    obj.add(cart);
}

function createUpperCrane(obj, x, y, z) {
    'use strict';

    var upperCrane = new THREE.Object3D();
    addBoom(upperCrane, x + 1.25, y + 1.5, z);
    addCounterWeight(upperCrane, x - 6.75, y, z);
    addCraneHolder(upperCrane, x, y + 2.5, z);
    addCabin(upperCrane, x, y - 1.5, z + 1.25);

    createCart(upperCrane, x, y, z);

    obj.add(upperCrane);
}

function createCrane(x, y, z) {
    'use strict';

    var crane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBase(crane, 0, 0, 0);
    addTower(crane, 0, 3, 0);
    createUpperCrane(crane, 0, 48, 0);

    scene.add(crane);

    crane.position.x = x;
    crane.position.y = y;
    crane.position.z = z;
}

function createCable(x, y, z) {
    'use strict';

    var cable = new THREE.Object3D();

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

    if (cart.userData.step > 0) {

    }
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
    
    switch(e.keyCode) {
        case 83:
        case 115:       
            cart.userData.step += 0.1;
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

init();
animate();