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
var cart, upperCrane, cable;
var current_camera = "Side Camera";
var cameras = {};

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene(){
    'use strict';

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x7195a3);

    scene.add(new THREE.AxesHelper(10));

    createCrane(0,0,0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera(x, y, z) {
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
}

function createFrontalCamera() {
    'use strict';

    createCamera(100, 50, 0);

    cameras["Frontal Camera"] = camera;
}

function createSideCamera() {
    'use strict';

    createCamera(0, 40, 100);

    cameras["Side Camera"] = camera;
}

function createTopCamera() {
    'use strict';

    createCamera(0, 100, 0);

    cameras["Top Camera"] = camera;
}

function createOrthogonalCamera() {
    'use strict';

    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    var cameraWidth = 250; // Width of the visible scene
    var cameraHeight = cameraWidth / aspectRatio; // Calculate height based on aspect ratio

    camera = new THREE.OrthographicCamera(
    cameraWidth / -2, // Left
    cameraWidth / 2,  // Right
    cameraHeight / 2, // Top
    cameraHeight / -2, // Bottom
    1, // Near
    1000 // Far
);
    camera.position.x = 20;
    camera.position.z = 70;
    camera.position.z = 70;
    camera.lookAt(scene.position);

    cameras["Orthogonal Camera"] = camera;
}

function createPerspectiveCamera() {
    'use strict';
    createCamera(20, 70, 70);

    cameras["Perspective Camera"] = camera;
}

function createHookCamera() {
    'use strict';
    createCamera(100, 100, 100);

    cameras["Hook Camera"] = camera;
}

function createCameras() {
    createFrontalCamera();
    createSideCamera();
    createTopCamera();
    createOrthogonalCamera();
    createPerspectiveCamera();
    createHookCamera();
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

function createCable(obj, x, y, z) {
    'use strict';

    cable = new THREE.Object3D();
    cable.userData = { length: 20, step: 0.7, moving: false };
    cable.position.set(x, y, z);

    cable.add(new THREE.AxesHelper(10));

    addCable(cart, 0, -1, 0);
    obj.add(cable)
}

function createCart(obj, x, y, z) {
    'use strict';

    cart = new THREE.Object3D();
    cart.position.set(x, y, z);
    cart.add(new THREE.AxesHelper(10));

    cart.userData = { step: 0.7, moving: false };

    addCart(cart, 0, 0, 0);

    createCable(cart, 0, -1, 0);

    createHook(cart)
    obj.add(cart);
}

function createUpperCrane(obj, x, y, z) {
    'use strict';

    upperCrane = new THREE.Object3D();
    upperCrane.position.set(x, y, z);
    upperCrane.add(new THREE.AxesHelper(10));
    console.log("Upper crane: ", upperCrane.position)

    addBoom(upperCrane, 1.25, 0, 0);
    addCounterWeight(upperCrane, -6.75, -1.5, 0);
    addCraneHolder(upperCrane, 0, 1, 0);
    addCabin(upperCrane, 0, -3, 1.25);

    createCart(upperCrane, 22.5, -1, 0);

    obj.add(upperCrane);
}

function createCrane(x, y, z) {
    'use strict';

    var crane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBase(crane, 0, 0, 0);
    addTower(crane, 0, 3, 0);
    createUpperCrane(crane, 0, 49.5, 0);

    crane.position.set(x, y, z);

    scene.add(crane);

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

    renderer.render(scene, cameras[current_camera]);
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
    createCameras();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    if (cart.userData.moving) {
        cart.position.x += cart.userData.step * 0.1;
    }
    render();

    requestAnimationFrame(animate);
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
        // Switch to frontal camera
        case 49:
            current_camera = "Frontal Camera";
            break;
        // Switch to side camera
        case 50:
            current_camera = "Side Camera";
            break;
        // Switch to top camera
        case 51:
            current_camera = "Top Camera";
            break;
        // Switch to orthogonal camera
        case 52:
            current_camera = "Orthogonal Camera";
            break;
        // Switch to perspective camera
        case 53:
            current_camera = "Perspective Camera";
            break;
        // Switch to perspective camera
        case 54:
            current_camera = "Hook Camera";
            break;
        // 's' and 'S'
        case 83:
        case 115:       
            if (cart.position.x > 3.5) {
                if (cart.userData.step > 0) {
                    cart.userData.step = -cart.userData.step;
                }
                cart.userData.moving = true;
            } else {
                cart.userData.moving = false;
            }
            break;
        // 'w' and 'W'
        case 87:
        case 119:
            if (cart.position.x < 45.25) {
                if (cart.userData.step < 0) {
                    cart.userData.step = -cart.userData.step;
                }
                cart.userData.moving = true;
            } else {
                cart.userData.moving = false;
            }
            break;
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        case 83:
        case 115:       
            cart.userData.moving = false
            break;
        case 87:
        case 119:
            cart.userData.moving = false;
            break;
    }
}

init();
animate();
