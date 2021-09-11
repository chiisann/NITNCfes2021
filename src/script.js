import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import * as dat from 'dat.gui'
import { PointLightHelper } from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
//import { MTLLoader } from './loader/mtl.js';
// import { OBJLoader } from './loader/obj.js';

//-----------------------------LOADERS-------------------------------
// Loading
const textureLoader = new THREE.TextureLoader();


// Debug
const gui = new dat.GUI()

//-----------------------------FUNCTIONS-------------------------------
// Random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//-----------------------------OBJECTS-------------------------------

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xF7F5D5); // background-color

//-----------------------------OBJECTS-------------------------------

// Sphere
const geometry = new THREE.SphereBufferGeometry( 0.5, 64, 64 );
// not tif but png
const normalTexture = textureLoader.load('/textures/tex2.png');
const material = new THREE.MeshStandardMaterial()
material.metalness = 0;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0xF8F8F8);
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
sphere.position.set(0, 0, -0.5);


// TorusKnot
const geoTorus1 = new THREE.TorusKnotGeometry( 10, 3, 32, 8, getRandomInt(1, 31), getRandomInt(1, 21) );
const mateTorus1 = new THREE.MeshNormalMaterial( { color: 0xffff00, wireframe: true } );
const torusKnot = new THREE.Mesh( geoTorus1, mateTorus1 );
scene.add( torusKnot );
torusKnot.scale.set(.1, .1, .1);
torusKnot.position.set(0, -5, -2);

// SDGs Cube
const SDGsTexture = textureLoader.load('/textures/SDGs1.png');
const SDGs1 = new THREE.Mesh(
    new THREE.BoxGeometry(.5, .5, .5),
    new THREE.MeshBasicMaterial({
        map: SDGsTexture,
        normalMap: normalTexture
    })
);
scene.add(SDGs1);
SDGs1.position.set(0, -3, 0)


// OBJ & MTL

let mtlLoader = new MTLLoader();
let objLoader = new OBJLoader();
mtlLoader.load('/objects/face.mtl', (materials) => {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.load('/objects/face.obj', (object) => {
        scene.add(object);
        object.position.x = 0;
        object.position.y = -1;
        object.position.z = -4; 
    });
});


//-----------------------------LIGHTS-------------------------------
const hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4 );
scene.add( hemiLight );

const spotLight1 = new THREE.SpotLight(0xffa95c,4);
spotLight1.castShadow = true;
scene.add(spotLight1)

// const pointLight = new THREE.PointLight(0xffffff, 0.1)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// // Light 2
// const pointLight2 = new THREE.PointLight(0xebebeb, 2)
// pointLight2.position.set(-1.2, 1.4, -1.5);
// pointLight2.intensity = 1;

// scene.add(pointLight2)

// const light2 = gui.addFolder('Light 2')

// light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01)
// light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
// light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
// light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

// const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1)
// scene.add(pointLightHelper2)


// // Light3
// const pointLight3 = new THREE.PointLight(0xebebeb, 2)
// pointLight3.position.set(1.2, 0, 0);
// pointLight3.intensity = 1;

// scene.add(pointLight3)

// const light3 = gui.addFolder('Light 3')

// light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
// light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
// light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
// light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

// const light3Color = {
//     color: 0xff0000
// }

// light3.addColor(light3Color, 'color')
//     .onChange(() => {
//         pointLight3.color.set(light3Color.color)
//     })

// const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1)
// scene.add(pointLightHelper3)



//-----------------------------SIZES-------------------------------
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//-----------------------------CAMERA-------------------------------
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


//Animation
function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    camera.position.y = t * 0.005;
    SDGs1.rotation.y = t * -0.001;
}

// fire every time on scroll
document.body.onscroll = moveCamera

//-----------------------------RENDER-------------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;


//-----------------------------ANIMATE-------------------------------
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

// sphere action with scroll
const updateSphere = (event) => {
    sphere.position.y = window.scrollY * 0.001
}

window.addEventListener('scroll', updateSphere);


const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // ----- Update objects -----

    // sphere
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.y += 0.5 * (targetX -sphere.rotation.y)
    sphere.rotation.x += 0.05 * (targetY -sphere.rotation.x)
    sphere.position.z += -0.05 * (targetY -sphere.rotation.x)

    //TorusKnot
    torusKnot.rotation.y = .2 * elapsedTime
    torusKnot.rotation.x = .2 * elapsedTime
    torusKnot.position.z += 0.1 * (sphere.rotation.x-targetY)

    // ----- Update lights -----
    spotLight1.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10
    );

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()