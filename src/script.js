//------------------------------------------------------------
// ThreeJS
//------------------------------------------------------------
import './style.css'
import * as THREE from 'three'
// import * as THREE from './js/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import * as dat from 'dat.gui'
import { PointLightHelper, SphereBufferGeometry } from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import luxy from 'luxy.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
//-----------------------------LOADERS-------------------------------
// Loading
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();

// Debug
const gui = new dat.GUI()

//-----------------------------FUNCTIONS-------------------------------
// Random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

//-----------------------------SCENE-------------------------------

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Background Color
const light = new THREE.Color(0xF8F8F8);
const dark = new THREE.Color(0xFEED01);
scene.background = light;

//-----------------------------OBJECTS-------------------------------
// OBJECTS
// Sphere
const geometry = new THREE.SphereBufferGeometry( 0.5, 64, 64 );
// not tif but png
// const normalTexture = textureLoader.load('/textures/tex2.png');
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0;
// material.roughness = 0.2;
// material.normalMap = normalTexture;
// material.color = new THREE.Color(0xF8F8F8);
const meshParams = {
    color: '#ff00ff',
    metalness: .58,
    emissive: '#000000',
    roughness: .18,
};
// we create our material outside the loop to keep it more performant
const material = new THREE.MeshPhysicalMaterial(meshParams);
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)
sphere.position.set(0, 0, -0.5);
sphere.scale.set(0.3, 0.3, 0.3);

// SDGs Cube
// const SDGsTexture = textureLoader.load('/textures/SDGs1.png');
// const SDGs1 = new THREE.Mesh(
//     new THREE.BoxGeometry(.5, .5, .5),
//     new THREE.MeshBasicMaterial({
//         map: SDGsTexture,
//         normalMap: normalTexture
//     })
// );
// scene.add(SDGs1);
// SDGs1.position.set(0, -3, 0)


// OBJ & MTL

var japan;
gltfLoader.load('/objects/japan.gltf', function(gltf){
    japan = gltf.scene;
    for(let i = 0; i < japan.children.length; i++){
        let mesh = japan.children[i];
        mesh.castShadow = true;
    }
    scene.add(japan);
    japan.position.set(0, -.3, 0);
    japan.rotation.set(Math.PI/6, Math.PI/6, 0);
    japan.scale.set(.2, .2, .2);
});

var truck;
gltfLoader.load('/objects/track.gltf', function(gltf){
    truck = gltf.scene;
    for(let i = 0; i < truck.children.length; i++){
        let mesh = truck.children[i];
        mesh.castShadow = true;
    }
    //scene.add(truck);
    truck.position.set(0, -.5, 0);
    truck.scale.set(.3, .3, .3);
});

var box;
gltfLoader.load('/objects/box.gltf', function(gltf){
    box = gltf.scene;
    for(let i = 0; i < box.children.length; i++){
        let mesh = box.children[i];
        mesh.castShadow = true;
    }
    scene.add(box);
    box.position.set(0, -5, 0);
    box.scale.set(.3, .3, .3);

    //box.children[3].position.set(0, -10, 0);
});

//track.position.set(0, -1, 0)

// mtlLoader.load('/objects/face.mtl', (materials) => {
//     materials.preload();
//     objLoader.setMaterials(materials);
//     objLoader.load('/objects/face.obj', (object) => {
//         scene.add(object);
//         object.position.x = 0;
//         object.position.y = -1;
//         object.position.z = -4; 
//     });
// });


//-----------------------------LIGHTS-------------------------------
// const hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 4 );
// scene.add( hemiLight );

const ambientLight = new THREE.AmbientLight('#2900af', 1);
scene.add(ambientLight);

// const spotLight1 = new THREE.SpotLight(0xffa95c,4);
const spotLight1 = new THREE.SpotLight('#F7FF00', 3, 1000);
spotLight1.castShadow = true;
scene.add(spotLight1)
const spotLight1Helper = new THREE.SpotLightHelper(spotLight1, 1)
scene.add(spotLight1Helper)

const rectLight = new THREE.RectAreaLight('#0077ff', 2, 2000, 2000);
rectLight.position.set(5, 50, 50);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

const pointLight = new THREE.PointLight('#FEED01', 3, 1000, 1);
pointLight.position.set(5, 50, 50);
scene.add(pointLight);
const pointH = new THREE.PointLightHelper(pointLight, 1)
scene.add(pointH)

// const pointLight = new THREE.PointLight(0xffffff, 0.1)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// // Light 2
// const pointLight2 = new THREE.PointLight(0xC2BC2E, 2)
// pointLight2.position.set(0, 3, 0);
// pointLight2.intensity =3;
// pointLight2.castShadow = true;

// let cameraHelper = new THREE.CameraHelper(pointLight2.shadow.camera);
// scene.add(cameraHelper);

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
// //scene.add(pointLight3)

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

//-----------------------------RENDER-------------------------------
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;

//-----------------------------CAMERA-------------------------------
// CAMERA
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.userPan = false;
// controls.userPanSpeed = 0.0;
// controls.enableDamping = true;
// controls.dampingFactor = 0.1;
// controls.enableZoom = false;
// let cameraTarget = new THREE.Vector3( 0, 0, 0 )
// controls.target = cameraTarget;

//  controls.enableZoom = false;
//  controls.autoRotate = true

// controls.minPolarAngle = 0;
// controls.maxPolarAngle = 0;
// controls.minAzimuthAngle = - Math.PI;
// controls.maxAzimuthAngle = - Math.PI;




//Animation

let tl = gsap.timeline()
tl.to(camera.position, {y: -.3, duration: 1})


function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    camera.position.y = t * 0.002;
    //controls.target.y = camera.position.y;
    //SDGs1.rotation.y = t * -0.001;
    // if(truck){
    //     for(const t of truck.children){
    //         t.position.y = t * 0.002;
    //         t.rotation.y += t * -0.001;
    //     }
    // }
}

// fire every time on scroll
document.body.onscroll = moveCamera




//-----------------------------ANIMATE-------------------------------
// ANIMATE
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
// const updateByScroll = (event) => {
//     if(truck){
//         for(const t of truck.children){
//             //t.position.y = window.scrollY * 0.001
//         }
//     }
//     sphere.position.y = window.scrollY * 0.001
// }

// window.addEventListener('scroll', updateByScroll);


const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // ----- Update objects -----

    // japan
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.y += 0.5 * (targetX -sphere.rotation.y)
    sphere.rotation.x += 0.05 * (targetY -sphere.rotation.x)
    sphere.position.z += -0.05 * (targetY -sphere.rotation.x)

    //TorusKnot
    // torusKnot.rotation.y = .2 * elapsedTime
    // torusKnot.rotation.x = .2 * elapsedTime
    // torusKnot.position.z += 0.1 * (sphere.rotation.x-targetY)

    // truck
    if(japan){
        japan.rotation.y = .05 * elapsedTime
        //japan.rotation.x += 0.05 * (targetY -japan.rotation.x)
        japan.rotation.y += 0.5 * (targetX -japan.rotation.y)
        //japan.position.z += -0.05 * (targetY -japan.rotation.x)
    }

    // box
    if(box){
        for(const t of box.children){
            t.rotation.y = 0.5 * elapsedTime
        }
    }

    // initial camera pos=(0, 0, 2)

    // ----- Update lights -----
    spotLight1.position.set(
        camera.position.x + 20,
        camera.position.y + 20,
        camera.position.z + 20
    );

    rectLight.position.set(
        camera.position.x + 5,
        camera.position.y + 50,
        camera.position.z + 45
    );

    rectLight.lookAt(
        camera.position.x,
        camera.position.y,
        camera.position.z
    );

    pointLight.position.set(
        camera.position.x + 5,
        camera.position.y + 50,
        camera.position.z + 45
    );

    // Update Orbital Controls
    //controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


//------------------------------------------------------------
// LUXY
//------------------------------------------------------------
if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0) {
    // smartphone
} else if (navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
    // tablet
} else {
    // PC
    luxy.init({
        wrapper: '#luxy',
        targets : '.luxy-el',
        wrapperSpeed:  0.2
    });
}
// luxy.init({
//     wrapper: '#luxy',
//     targets : '.luxy-el',
//     wrapperSpeed:  .2
// });
// https://reiwinn-web.net/2020/12/25/luxy/

//------------------------------------------------------------
// GSAP(Animation)
//------------------------------------------------------------



gsap.from('header', {
    opacity: 0, duration: 1, y: -50, ease: 'Power2.easeInOut'
});

// let tl1 = gsap.timeline()
// tl1.to(camera.position, {y: -.2, duration: 1})


let tl2 = gsap.timeline({
    defaults: { ease: "power2.easeOut", duration: .5 },
    scrollTrigger: {
        markers: true,
        trigger: ".title h1", // この要素と交差するとイベントが発火
        start: "top 50%", // ウィンドウのどの位置を発火の基準点にするか
        end: "bottom top", // ウィンドウのどの位置をイベントの終了点にするか
        toggleActions: "restart none reverse none", // スクロールイベントで発火するアニメーションの種
        scrub: 1,
    },
})
tl2.to(sphere.position, {y: -1, duration:1} )
//tl2.to(truck.children[2].position, {y: 4, duration:1} )
//tl2.to(truck,{x: 4, duration:1} )
//tl2.to(truck.children[0].position, {y: -1, duration:1} )
if(truck){
    for(const t of truck.children){
        tl2.to(t.position, {y: -1, duration:1} )
        // t.rotation.y += 0.5 * (targetX -t.rotation.y)
        // t.rotation.x += 0.05 * (targetY -t.rotation.x)
        // t.position.z += -0.05 * (targetY -t.rotation.x)
    }
}


gsap.to('blockquote .bl-wrap',{
    left: "100%", 
    width: "150%",
    ease: 'Power1.easeInOut',
    scrollTrigger: {
        trigger: 'blockquote .bl-wrap',
        start: 'top 60%',
        // markers: true,
    }
});

gsap.to('blockquote h2', {
    opacity: 1, 
    delay: 0.1,
    scrollTrigger: {
        trigger: 'blockquote .bl-wrap',
        start: 'top 60%',
    }
});

gsap.from('.card', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card',
        start: 'top 60%',
        end: 'top 40%',
        //markers: true,
        scrub: 1,
    }
});

// Background Animation
gsap.from('.image-container', {
    backgroundColor: "rgba( 254, 237, 1, 0)", ease: 'Power3.easeOut',
    //delay: 0.1,
    scrollTrigger: {
        trigger: '.image-container',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
    }
});

// ScrollTrigger.create({
//     trigger: ".image-container",
//     start: 'top 80%',
//     end: 'bottom 20%',
//     scrub: 1,
//     delay: 1,
//     onEnter: self => {
        
//     }
// })

// ScrollTrigger.create({
//     duration: 1,
//     trigger: ".image-container",
//     start: 'top 50%',
//     end: 'bottom bottom-=300px',
//     scrub: 1,
//     onToggle: self => {
//         if(scene.background==dark){
//             scene.background = light;
//         }else{
//             scene.background = dark;
//         }
//     },
//     ease:  'Power2.easeOut',
// });