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
    camera.position.x = 40;
    camera.position.y = 80;
    camera.position.z = 40;
    camera.lookAt(scene.position);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

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

    geometry = new THREE.CylinderGeometry(0, 1.2, 4, 4, 1);
    //material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4);
    mesh.position.set(x, y + 2, z);
    obj.add(mesh);
}

function addCraneHolderTower(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(1.697, 2.5, 1.697);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 1.25, z);
    obj.add(mesh);
}

function addRotatingCylinder(obj, x, y ,z) {
    'use strict'

    geometry = new THREE.CylinderGeometry(1.2, 1.25, 0.5, 32);
    // material = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 0.25, z);
    obj.add(mesh);
}

function addUpperCraneBoom(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(15, 2.5, 1.697);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x - 7.5, y + 1.25, z);
    obj.add(mesh);
}

function addUpperCraneBoomBack(obj, x, y, z) {
    'use strict'

    geometry = new THREE.BoxGeometry(8, 2.5, 1.697);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x + 4, y + 1.25, z);
    obj.add(mesh);
}

function createCrane(x, y, z) {
    'use strict';

    var crane = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addBase(crane, 0, 0, 0);
    addTower(crane, 0, 3, 0);
    addCraneHolder(crane, 0, 51, 0);
    addRotatingCylinder(crane, 0, 48, 0);
    addCraneHolderTower(crane, 0, 48.5, 0);
    addUpperCraneBoom(crane, 0, 48.5, 0)
    addUpperCraneBoomBack(crane, 0, 48.5, 0)


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