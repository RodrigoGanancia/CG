import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { VRButton } from 'three/addons/webxr/VRButton.js';
// import * as Stats from 'three/addons/libs/stats.module.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer, clock, delta;
var material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
var camera, scene, renderer;
var material  = new THREE.MeshToonMaterial({ color: 0xd47bc6});
var material2 = new THREE.MeshToonMaterial({ color: 0xACA6A5});
var material3 = new THREE.MeshToonMaterial({ color: 0x0091a3});
var material4 = new THREE.MeshToonMaterial({ color: 0xff4370});
var material5 = new THREE.MeshToonMaterial({ color: 0x43c5ff});

var geometry, mesh;
var cart, upperCrane, cable, hook;
var current_camera = "Perspective Camera";
var cameras = {};
var loads = [], claws = [];
var colisionLoad;
var isInAnimation = false, endAnimation;
const n_loads = 6;
const defaultCartX = 30;
const maxHookClawY = -0.5;
const minHookClawY = -0.75;

// Speeds
const cartSpeed = 7;
const rotSpeedCrane = 1;
const rotSpeedHook = 1;
const cableSpeed = 0.3;

// Lengths
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
    var groundTexture = loader.load('grass.webp');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(5, 5);
    var groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
    var groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = - Math.PI / 2; 
    scene.add(ground);
    ground.position.y = -2;

    // Sky
    var skyTexture = loader.load('toy-story.jpg');
    skyTexture.wrapS = skyTexture.wrapT = THREE.RepeatWrapping;
    skyTexture.repeat.set(20, 20); 
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
    camera.position.z = 70; // esta linha está repetida
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
    var pointLight = new THREE.PointLight('0xfffff', 19000, 1000);

    pointLight.position.set(x, y, z);
    scene.add(pointLight);
}
////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function addBoom(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(57.5, 2.5, 2.5);
    mesh = new THREE.Mesh(geometry, material4);
    mesh.position.set(x + 16.5, y, z);
    obj.add(mesh);
}

function addCounterWeight(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(3, 2, 3);
    mesh = new THREE.Mesh(geometry, material3);
    mesh.position.set(x , y - 1, z);
    obj.add(mesh);
}

function addBase(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.BoxGeometry(5, 3, 5);
    mesh = new THREE.Mesh(geometry, material4);
    mesh.position.set(x, y + 1.5, z);
    obj.add(mesh);
}

function addTower(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(2.5, 45, 2.5);
    mesh = new THREE.Mesh(geometry, material5);
    mesh.position.set(x, y + 22.5, z);
    obj.add(mesh);
}

function addCraneHolder(obj, x, y, z) {
    'use strict'

    geometry = new THREE.CylinderGeometry(0, 1.768, 6, 4, 1);
    mesh = new THREE.Mesh(geometry, material5);
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    mesh.position.set(x, y + 3, z);
    obj.add(mesh);
}

function addCabin(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(3, 3, 3);
    mesh = new THREE.Mesh(geometry, material4);
    mesh.position.set(x, y, z + 1.5);
    obj.add(mesh);
}

function addHookClaw(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(0.5, 0, 2, 4);
    var claw = new THREE.Mesh(geometry, material3);
    //  claw.rotateY(Math.PI/4);
    claw.position.set(x, y - 0.5, z);

    obj.add(claw);
    claws.push(claw);
}

function addHookBlock(obj, x, y, z) {
    'use strict';

    geometry = new THREE.BoxGeometry(2, 1, 2);
    mesh = new THREE.Mesh(geometry, material4);
    mesh.position.set(x, y, z);

    obj.add(mesh);
}

function createHook(obj, x, y, z) {
    'use strict';

    hook = new THREE.Object3D();
    hook.userData = { rotSpeed: rotSpeedHook, rotating: false, moving: false};
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
    mesh = new THREE.Mesh(geometry, material3);
    mesh.position.set(x, y - 0.5, z);
    obj.add(mesh);
}

function addCable(obj, x, y, z) {
    geometry = new THREE.CylinderGeometry(0.3, 0.3, cableHeight);
    mesh = new THREE.Mesh(geometry, material4);
    mesh.position.set(x, y - cableHeight/2, z);
    obj.add(mesh);
}

function createCable(obj, x, y, z) {
    'use strict';

    cable = new THREE.Object3D();
    cable.userData = { speed: cableSpeed, moving: false };
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

    cart.userData = { speed: cartSpeed, moving: false };

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

    upperCrane.userData = { rotSpeed: rotSpeedCrane, rotating: false};

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
    mesh = new THREE.Mesh(geometry, material4);
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
    mesh = new THREE.Mesh(geometry, material3);
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
             (x > - 7 && x < 7 && z > -7 && z < 7) ||
             (x**2 + z**2 > 40**2));

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
    'use strict'

    const radius = 1.5;

    return (2*radius)**2 >= (loadPos.x - hookPos.x)**2 + 
                            (loadPos.y - hookPos.y)**2 +
                            (loadPos.z - hookPos.z)**2;
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld = false){
  
    if(pointIsWorld){
        obj.parent.localToWorld(obj.position);
    }
  
    obj.position.sub(point);
    obj.position.applyAxisAngle(axis, theta);
    obj.position.add(point);
  
    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position);
    }
  
    obj.rotateOnAxis(axis, theta);
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

    scene.remove(colisionLoad);
    colisionLoad.position.set(0, -3, 0);
    hook.add(colisionLoad);

    isInAnimation = true;
    upperCrane.userData.moving = true;
    upperCrane.userData.rotating = true;
    cart.userData.moving = true;
    cable.userData.moving = true;
    
    if(upperCrane.rotation.y > 0) {
        upperCrane.userData.rotSpeed = (upperCrane.rotation.y % (2*Math.PI)) > Math.PI ? rotSpeedCrane : -rotSpeedCrane;
    }  else {
        upperCrane.userData.rotSpeed = (upperCrane.rotation.y % (2*Math.PI)) > -Math.PI ? rotSpeedCrane : -rotSpeedCrane;
    }
    cable.userData.speed = -cableSpeed;
    cart.userData.speed = cart.position.x < defaultCartX ? cartSpeed : -cartSpeed;
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
    clock = new THREE.Clock();
    createLight(20, 50, 60);
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
    delta = clock.getDelta();
    if (isInAnimation) {
        if (cable.userData.moving && cable.scale.y > 1.90) {
            // Decrease cable scale to avoid colliding with container wall
            cable.scale.y += -cableSpeed *  delta;
            hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
        } else {
            if (cable.userData.moving && cable.scale.y > 1.5) {
                cable.scale.y += -cableSpeed *  delta;
                hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            } else {
                cable.userData.moving = false;  
            }
            if(upperCrane.userData.rotating &&
                Math.abs(upperCrane.rotation.y % (2*Math.PI)) > Math.abs(upperCrane.userData.rotSpeed * delta)) {
                upperCrane.rotation.y += upperCrane.userData.rotSpeed * delta;
            } else {
                upperCrane.userData.rotating = false;
            }
            if (cart.userData.moving &&
                Math.abs(cart.position.x + cart.userData.speed * delta - defaultCartX) < Math.abs(cart.position.x - defaultCartX)) {
                cart.position.x += cart.userData.speed * delta;
            } else {
                cart.userData.moving = false;
            }
            if (!upperCrane.userData.rotating && !cart.userData.moving && !cable.userData.moving) {
                if (cable.scale.y < 1.95) {
                    cable.scale.y += cableSpeed *  delta;
                    hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
                } else {
                    colisionLoad.parent.remove(colisionLoad);
                    colisionLoad = null;
                    isInAnimation = false;
                }
            }
        }
    }
    else {
        if (upperCrane.userData.rotating) {
            upperCrane.rotation.y += upperCrane.userData.rotSpeed * delta;
        }
        if (cart.userData.moving) {
            if (cart.position.x >= 3.5 ) {
                cart.position.x += cart.userData.speed * delta;
            } else {
                cart.position.x = 3.5;
            }
            if (cart.position.x <= 45.25) {
                cart.position.x += cart.userData.speed * delta;
            } else {
                cart.position.x = 45.25;
            }
        }
        if (cable.userData.moving) {
            if (cable.scale.y >= 0) {
                cable.scale.y += cable.userData.speed * delta;
                hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            } else {
                cable.scale.y = 0;
            }
            if (cable.scale.y <= 2.3) {
                cable.scale.y += cable.userData.speed *  delta;
                hook.position.y = -(cartHeight/2 + cable.scale.y * cableHeight);
            } else {
                cable.scale.y = 2.3;
            }
        }
        if (hook.userData.rotating && ((hook.userData.rotSpeed > 0 && (claws[0].position.y > minHookClawY))
            || (hook.userData.rotSpeed < 0 && (claws[0].position.y < maxHookClawY)))) {
            var axisToRotate = new THREE.Vector3();
            const pivotPoint = new THREE.Vector3(0,1,0); // middle of hook
            for (var i = 0; i < 4; i++) {
                axisToRotate.set(claws[i].position.z, 0, -claws[i].position.x); 
                axisToRotate.normalize();
                rotateAboutPoint(claws[i], pivotPoint, axisToRotate, hook.userData.rotSpeed * delta, false);
            }
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
    if (isInAnimation) return;
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
            material2.wireframe = !material2.wireframe;
            material3.wireframe = !material3.wireframe;
            material4.wireframe = !material4.wireframe;
            material5.wireframe = !material5.wireframe;
            break;
        // 'a' and 'A'
        case 65:
        case 97:
            upperCrane.userData.rotSpeed = -rotSpeedCrane;    
            upperCrane.userData.rotating = true;
            break;
        // 'q' and 'Q'
        case 81:
        case 113:
            upperCrane.userData.rotSpeed = rotSpeedCrane;
            upperCrane.userData.rotating = true;
            break;
        // 's' and 'S'
        case 83:
        case 115:       
            if (cart.userData.speed > 0) {
                cart.userData.speed = -cart.userData.speed;
            }
            cart.userData.moving = true;
            break;
        // 'w' and 'W'
        case 87:
        case 119:
            if (cart.userData.speed < 0) {
                cart.userData.speed = -cart.userData.speed;
            }
            cart.userData.moving = true;
            break;
        // 'E' and 'E'
        case 69:
        case 101:
            if (cable.userData.speed > 0) {
                cable.userData.speed = -cable.userData.speed;
            }
            cable.userData.moving = true;
            break;
        // 'D' and 'd'
        case 68:
        case 100:
            if (cable.userData.speed < 0) {
                cable.userData.speed = -cable.userData.speed;
            }
            cable.userData.moving = true;
            break;
        // 'R' and 'r'
        case 82:
        case 114:
            hook.userData.rotSpeed = rotSpeedHook;
            hook.userData.rotating = true;
            break;
         // 'F' and 'f'
        case 70:
        case 102:
            hook.userData.rotSpeed = -rotSpeedHook;
            hook.userData.rotating = true;
            break;    
         // 'P' and 'p'
        case 80:
        case 112:
            console.log(cable.scale.y);
            break;
            
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    if (isInAnimation) return;
    
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
        // 'R', 'r', 'F', 'f'
        case 82:
        case 114:
        case 70:
        case 102:
            hook.userData.rotating = false;
            break;
    }
}

init();
animate();
