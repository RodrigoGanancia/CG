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
var current_camera = "Hook Camera";
var cameras = {};
var hook_world_position = new THREE.Vector3();
var loads = [];
var colisionLoad;
var isInAnimation = false;
const n_loads = 6;
const cartSpeed = 0.07;
const rotStepCrane = 0.01;
const rotStepHook = 0.01;
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

    // Create a texture loader
    var loader = new THREE.TextureLoader();

    // Ground
    var groundTexture = loader.load('image.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    var groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
    var groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = - Math.PI / 2; 
    scene.add(ground);
    ground.position.y = -2;

    // Sky
    var skyTexture = loader.load('image copy.png');
    var skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture });
    var skyGeometry = new THREE.SphereGeometry(500, 60, 40);

  
    var sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.material.side = THREE.BackSide; 
    scene.add(sky);

    createCrane(0, 0, 0);
    createContainer(30, 0, 0);
    createLoads(0, 0, 0);
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

    var x = hook.position.x;
    var y = hook.position.y;
    var z = hook.position.z;

    camera.position.set(0, 0, 0);
    camera.lookAt(x, y, z);

    cameras["Hook Camera"] = camera;
    hook.add(camera);
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
function createLight(x, y, z) {
    'use strict';
    var pointLight = new THREE.PointLight('0x0000ff', 10, 1000);

    pointLight.position.set(x, y, z);
    scene.add(pointLight);
}
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
    hook.userData = { rotStep: rotStepHook, rotating: false, moving: false};
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

    cart.userData = { step: cartSpeed, moving: false };

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

    upperCrane.userData = { rotStep: rotStepCrane, rotating: false};

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

function generateRandomLocationLoad() {
    var x,z;

    do {
        x = (Math.random() * 81) - 40;
        z = (Math.random() * 81) - 40;
    } while ((x > 16 && x < 44 && z > -12 && z < 12) ||
             (x > - 7 && x < 7 && z > -7 && z < 7));

    return new THREE.Vector3(x, 1, z);
}

function createLoadGeometry() {
    'use strict'

    switch(Math.floor(Math.random() * 5)) {
        case 0:
            geometry = new THREE.BoxGeometry(2, 2, 2);
            break;
        case 1:
            geometry = new THREE.DodecahedronGeometry(2);
            break;
        case 2:
            geometry = new THREE.IcosahedronGeometry(2);
            break;
        case 3:
            geometry = new THREE.TorusGeometry(2);
            break;
        case 4:
            geometry = new THREE.TorusKnotGeometry(2);
            break;
    }
}

function createLoads() {
    'use strict'

    for (var i = 0; i < n_loads; i++) {
        createLoadGeometry();
        var load = new THREE.Mesh(geometry, material);
        const pos = generateRandomLocationLoad()
        load.position.set(pos.x, pos.y, pos.z);;
        loads.push(load);
        scene.add(load);
    }
}
//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

    var hookPosition = new THREE.Vector3();
    hook.getWorldPosition(hookPosition);
    for (var i = 0; i < n_loads; i++) {
        if (hookLoadColisionCalculate(loads[i].position, hookPosition)) {
            colisionLoad = loads[i];
            return true;
        }
    }
    return false;
}

function hookLoadColisionCalculate(loadPos, hookPos) {
    const radius = 1.5;

    return (2*radius)**2 >= (loadPos.x - hookPos.x)**2 + 
                            (loadPos.y - hookPos.y)**2 +
                            (loadPos.z - hookPos.z)**2;
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

    scene.remove(colisionLoad);
    colisionLoad.position.set(0, -3, 0);
    hook.add(colisionLoad);
    upperCrane.userData.rotStep = (upperCrane.rotation.y % (2*Math.PI)) < Math.PI ? 
                        rotStepCrane : -rotStepCrane;
    cart.userData.step = cart.position.x < 30 ? cartSpeed : -cartSpeed;
    isInAnimation = true;

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
    createLight(0, 70, 70);
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

    if(checkCollisions()) {
        handleCollisions();
    }
    if (isInAnimation) {
        if(Math.abs(upperCrane.rotation.y % (2*Math.PI)) > Math.abs(upperCrane.userData.rotStep)) {
            upperCrane.rotation.y += upperCrane.userData.rotStep;
        } else {
            isInAnimation = false;
        }
        if (Math.abs(cart.position.x + cart.userData.step - 30) < Math.abs(cart.position.x - 30)) {
            cart.position.x += cart.userData.step;
            isInAnimation = true;
        }
    }
    else {
        if (upperCrane.userData.rotating) {
            upperCrane.rotation.y += upperCrane.userData.rotStep;
        }
        if (cart.userData.moving) {
            if (cart.position.x >= 3.5 ) {
                cart.position.x += cart.userData.step;
            } else {
                cart.position.x = 3.5;
            }
            if (cart.position.x <= 45.25) {
                cart.position.x += cart.userData.step;
            } else {
                cart.position.x = 45.25;
            }
        }
        if (cable.userData.moving) {
            if (cable.scale.y >= 0) {
                cable.scale.y += cable.userData.step * 0.1;
                hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            } else {
                cable.scale.y = 0;
            }
            if (cable.scale.y <= 2.3) {
                cable.scale.y += cable.userData.step * 0.1;
                hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            } else {
                cable.scale.y = 2.3;
            }
        }
        if (hook.userData.rotating) {
        
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
        // '7' Switch tocalternate between wireframe and solid
        case 55:
            material.wireframe = !material.wireframe;
            break;
        // 'a' and 'A'
        case 65:
        case 97:
            upperCrane.userData.rotStep = -rotStepCrane;    
            upperCrane.userData.rotating = true;
            break;
        // 'q' and 'Q'
        case 81:
        case 113:
            upperCrane.userData.rotStep = rotStepCrane;
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
        // 'R' and 'r'
        case 82:
        case 114:
            hook.userData.rotStep = rotStepHook;
            hook.userData.rotating = true;
            break;
         // 'F' and 'f'
        case 70:
        case 102:
            hook.userData.rotStep = -rotStepHook;
            hook.userData.rotating = true;
            break;    
         // 'P' and 'p'
        case 80:
        case 112:
            console.log(upperCrane.rotation.y);
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
