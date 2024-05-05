import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { VRButton } from 'three/addons/webxr/VRButton.js';
// import * as Stats from 'three/addons/libs/stats.module.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
var geometry, mesh;
var cart, upperCrane, cable, hook;
var current_camera = "Side Camera";
var cameras = {};
var hook_world_position = new THREE.Vector3();
const rotStep = 0.01;
const clawRotStep = 0.01;
const cableHeight = 20;
const cartHeight = 1;
const hookBlockHeight = 1;
const containerDepth = 20;
const containerLength = 25;
const containerHeight = 5;

/////////////////////
/* CREATE SCENE(S) */
/////////////////////

function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7195a3);

    scene.add(new THREE.AxesHelper(10));

    createCrane(0, 0, 0);
    createContainer(30, 0, 0);
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

    //createCamera(30, 40, 10);
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
    var cameraWidth = 250;
    var cameraHeight = cameraWidth / aspectRatio;

    camera = new THREE.OrthographicCamera(
    cameraWidth / -2, 
    cameraWidth / 2,
    cameraHeight / 2,
    cameraHeight / -2,
    1,
    1000
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
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);

    hook.getWorldPosition(hook_world_position);

    var x = hook_world_position.x;
    var y = hook_world_position.y;
    var z = hook_world_position.z;

    camera.position.set(x, y, z);
    camera.lookAt(x, 0, z);

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

function updateHookCamera() {
    hook.getWorldPosition(hook_world_position);

    var x = hook_world_position.x;
    var y = hook_world_position.y;
    var z = hook_world_position.z;

    cameras["Hook Camera"].position.set(x, y, z);
    cameras["Hook Camera"].lookAt(x, 0, z);
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

function addHookClaw(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(0.5, 0, 2, 4);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY(Math.PI/4);
    mesh.position.set(x, y - 0.5, z);

    obj.add(mesh);
}

function addHookBlock(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(2, 1, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function createHook(obj, x, y, z) {
    'use strict';

    hook = new THREE.Object3D();
    hook.userData = { rotStep: clawRotStep, rotating: false, moving: false};
    hook.position.set(x, y, z);
    hook.add(new THREE.AxesHelper(10));

    addHookBlock(hook, 0, 0, 0);
    addHookClaw(hook, 0.7, 0, 0.7);
    addHookClaw(hook, 0.7, 0, -0.7);
    addHookClaw(hook, -0.7, 0, 0.7);
    addHookClaw(hook, -0.7, 0, -0.7);


    obj.add(hook);
}

function addCart(obj, x, y, z) {
    geometry = new THREE.BoxGeometry(2.5, 1, 2.5);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 0.5, z);
    obj.add(mesh);
}

function addCable(obj, x, y, z) {
    geometry = new THREE.CylinderGeometry(0.3, 0.3, cableHeight);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - cableHeight/2, z);
    obj.add(mesh);
}

function createCable(obj, x, y, z) {
    'use strict';

    cable = new THREE.Object3D();
    cable.userData = { step: 0.03, moving: false };
    cable.position.set(x, y, z);

    cable.add(new THREE.AxesHelper(10));

    addCable(cable, 0, 0, 0);

    obj.add(cable)
}

function createCart(obj, x, y, z) {
    'use strict';

    cart = new THREE.Object3D();
    cart.position.set(x, y - 0.5, z);
    cart.add(new THREE.AxesHelper(10));

    cart.userData = { step: 0.7, moving: false };

    addCart(cart, 0, 0, 0);
    createCable(cart, 0, -(cartHeight/2), 0);
    createHook(cart, 0, -(cableHeight + cartHeight/2 + hookBlockHeight/2), 0);

    obj.add(cart);
}

function createUpperCrane(obj, x, y, z) {
    'use strict';

    upperCrane = new THREE.Object3D();
    upperCrane.position.set(x, y, z);
    upperCrane.add(new THREE.AxesHelper(10));

    upperCrane.userData = { rotStep: rotStep, rotating: false};

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

    addBase(crane, 0, 0, 0);
    addTower(crane, 0, 3, 0);
    createUpperCrane(crane, 0, 49.5, 0);

    crane.position.set(x, y, z);

    scene.add(crane);

}

function addContainerBase(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(containerLength, 1, containerDepth);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 0.5, z);
    obj.add(mesh);
}

function addContainerWall(obj, x, y, z, len) {
    'use strict'

    if (len == containerDepth) {
        geometry = new THREE.BoxGeometry(1, containerHeight, len);
    }
    if (len == containerLength) {
        geometry = new THREE.BoxGeometry(len, containerHeight, 1);
    }
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + containerHeight/2, z);
    obj.add(mesh);
}

function createContainer(x, y, z) {
    'use strict'

    var container = new THREE.Object3D();

    addContainerBase(container, 0, 0, 0);
    addContainerWall(container, containerLength/2, 0, 0, containerDepth);
    addContainerWall(container, -containerLength/2, 0, 0, containerDepth);
    addContainerWall(container, 0, 0, containerDepth/2, containerLength);
    addContainerWall(container, 0, 0, -containerDepth/2, containerLength);

    container.position.set(x, y, z);

    scene.add(container);
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
    window.addEventListener('resize', onResize, false);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    if (upperCrane.userData.rotating) {
        upperCrane.rotation.y += upperCrane.userData.rotStep;
        updateHookCamera();
    }
    if (cart.userData.moving) {
        if (cart.position.x >= 3.5 ) {
            cart.position.x += cart.userData.step * 0.1;
            updateHookCamera();
        } else {
            cart.position.x = 3.5;
        }
        if (cart.position.x <= 45.25) {
            cart.position.x += cart.userData.step * 0.1;
            updateHookCamera();
        } else {
            cart.position.x = 45.25;
        }
    }
    if (cable.userData.moving) {
        if (cable.scale.y >= 0) {
            cable.scale.y += cable.userData.step * 0.1;
            hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            updateHookCamera();
        } else {
            cable.scale.y = 0;
        }
        if (cable.scale.y <= 2.2) {
            cable.scale.y += cable.userData.step * 0.1;
            hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            updateHookCamera();
        } else {
            cable.scale.y = 2.2;
        }
    }
    render();

    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    
    switch(e.keyCode) {
        // '1' Switch to frontal camera
        case 49:
            current_camera = "Frontal Camera";
            break;
        // '2' Switch to side camera
        case 50:
            current_camera = "Side Camera";
            break;
        // '3' Switch to top camera
        case 51:
            current_camera = "Top Camera";
            break;
        // '4' Switch to orthogonal camera
        case 52:
            current_camera = "Orthogonal Camera";
            break;
        // '5' Switch to perspective camera
        case 53:
            current_camera = "Perspective Camera";
            break;
        // '6' Switch to perspective camera
        case 54:
            current_camera = "Hook Camera";
            break;
        // Numpad 1 alternate between wireframe and solid
        case 96:
            material.wireframe = !material.wireframe;
            break;
        // 'a' and 'A'
        case 65:
        case 97:
            upperCrane.userData.rotStep = -rotStep;    
            upperCrane.userData.rotating = true;
            break;
        // 'q' and 'Q'
        case 81:
        case 113:
            upperCrane.userData.rotStep = rotStep;
            upperCrane.userData.rotating = true;
            break;
        // 's' and 'S'
        case 83:
        case 115:       
            if (cart.userData.step > 0) {
                cart.userData.step = -cart.userData.step;
            }
            cart.userData.moving = true;
            break;
        // 'w' and 'W'
        case 87:
        case 119:
            if (cart.userData.step < 0) {
                cart.userData.step = -cart.userData.step;
            }
            cart.userData.moving = true;
            break;
        // 'E' and 'E'
        case 69:
        case 101:
            if (cable.userData.step > 0) {
                cable.userData.step = -cable.userData.step;
            }
            cable.userData.moving = true;
            break;
        // 'D' and 'd'
        case 68:
        case 100:
            if (cable.userData.step < 0) {
                cable.userData.step = -cable.userData.step;
            }
            cable.userData.moving = true;
            break;
            
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    switch (e.keyCode) {
        // 'a', 'A', 'q', 'Q'
        case 65:
        case 97:
        case 81:
        case 113:
            upperCrane.userData.rotating = false;
            break;
        // 's', 'S', 'w', 'W'
        case 83:
        case 115:       
        case 87:
        case 119:
            cart.userData.moving = false;
            break;
        // 'E', 'e', 'D', 'd'
        case 68:
        case 100:
        case 69:
        case 101:
            cable.userData.moving = false;
            break;
    }
}

init();
animate();
