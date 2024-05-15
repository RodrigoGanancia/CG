import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer, column;
var geometry, mesh;
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7195a3);


    createColumn(0, 0, 0);
    
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
    camera.position.y = 70;
    camera.position.z = 70;
    camera.lookAt(scene.position);

    cameras["Orthogonal Camera"] = camera;
}

function createPerspectiveCamera() {
    'use strict';
    createCamera(20, 70, 70);

    cameras["Perspective Camera"] = camera;
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

function createColumn(x, y, z) {
    'use strict';

    var obj = new THREE.Object3D();
    geometry = new THREE.CylinderGeometry(5, 5, 100, 32);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
    obj.position.set(x, y, z);
    scene.add(obj);
    
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
    window.addEventListener('resize', onResize, false);
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

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
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


window.addEventListener('keydown', function(event) {
    if (isInAnimation) {
        return;
    }

    var numberDisplay = document.getElementById('number-display');

    if (!isNaN(event.key) && event.key >= 1 && event.key <= 6) {
        numberDisplay.textContent = "Camera: " + event.key;
        numberDisplay.style.color = 'yellow';  

        setTimeout(function() {
            numberDisplay.style.color = 'rgba(122, 227, 225)';
        }, 500);
}
    if (event.key === 'R' || event.key === 'r') {
        var close_claw = document.getElementById('close-claw');
        close_claw.style.color = 'yellow'; 
    }
    if (event.key === 'F' || event.key === 'f') {
        var open_claw = document.getElementById('open-claw');
        open_claw.style.color = 'yellow'; 
    }
    if (event.key === 'E' || event.key === 'e') {
        var lineUp = document.getElementById('line-up');
        lineUp.style.color = 'yellow'; 
    }
    if (event.key === 'D' || event.key === 'd') {
        var lineDown = document.getElementById('line-down');
        lineDown.style.color = 'yellow'; 
    }
    if (event.key === 'W' || event.key === 'w') {
        var lineForward = document.getElementById('line-forward');
        lineForward.style.color = 'yellow'; 
    }
    if (event.key === 'S' || event.key === 's') {
        var lineBackward = document.getElementById('line-backward');
        lineBackward.style.color = 'yellow'; 
    }
    if (event.key === 'Q' || event.key === 'q') {
        var lineMovement = document.getElementById('line-movement-left');
        lineMovement.style.color = 'yellow'; 
    }
    if (event.key === 'A' || event.key === 'a') {
        var lineMovement = document.getElementById('line-movement-right');
        lineMovement.style.color = 'yellow'; 
    }
});
window.addEventListener('keyup', function(event) {
    if (isInAnimation) {
        return;
    }

    if (event.key === 'R' || event.key === 'r') {
        var close_claw = document.getElementById('close-claw');
        close_claw.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'F' || event.key === 'f') {
        var open_claw = document.getElementById('open-claw');
        open_claw.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'E' || event.key === 'e') {
        var lineUp = document.getElementById('line-up');
        lineUp.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'D' || event.key === 'd') {
        var lineDown = document.getElementById('line-down');
        lineDown.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'W' || event.key === 'w') {
        var lineForward = document.getElementById('line-forward');
        lineForward.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'S' || event.key === 's') {
        var lineBackward = document.getElementById('line-backward');
        lineBackward.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'Q' || event.key === 'q') {
        var lineMovement = document.getElementById('line-movement-left');
        lineMovement.style.color = 'rgba(122, 227, 225)'; 
    }
    if (event.key === 'A' || event.key === 'a') {
        var lineMovement = document.getElementById('line-movement-right');
        lineMovement.style.color = 'rgba(122, 227, 225)'; 
    }

});

init();
animate();