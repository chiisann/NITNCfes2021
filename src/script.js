//------------------------------------------------------------
// ThreeJS
//------------------------------------------------------------
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLightHelper, SphereBufferGeometry } from 'three';

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
//scene.background = light;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//-----------------------------CAMERA-------------------------------
// CAMERA
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

//-----------------------------OBJECTS-------------------------------
// OBJECTS
let tl1 = gsap.timeline({
    defaults: { 
        ease: "power1.inOut", duration: 1,immediateRender: false,
        scrollTrigger: {
            trigger: ".title h1",
            start: "top 50%",
            end: "top top",
            toggleActions: "restart none reverse none",
            scrub: 1,
        },
    },
})

tl1.to(camera.position, {y: -2})

let japan;
gltfLoader.load('/objects/japan2.gltf', function(gltf){
    japan = gltf.scene;
    for(let i = 0; i < japan.children.length; i++){
        let mesh = japan.children[i];
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }
    scene.add(japan);
    japan.position.set(0, 0, 0);
    japan.rotation.set(Math.PI/6, Math.PI/6, 0);
    japan.scale.set(.2, .2, .2);

    // GSAP Animation
    for(let i=0;i<=6;i++){
        let x, z;
        if(i<3){
            x = -1 + i*0.6;
            z = 11;
        }else if(3<=i && i<6){
            x = -1 + (i-3)*0.6;
            z = 12;
        }else{
            x = -1 + 0.6;
            z = 13;
        }
        tl1.to(japan.children[i].position, {x: x, y: 0, z: z,},)
        tl1.to(japan.children[i].rotation, {x: -Math.PI/3, z: 0, y: 0, }, "<")
    }
});

tl1.to(camera.position, {y: -5, ease: "power1.inOut", duration: 2,
    scrollTrigger: {
        markers: true,
        trigger: ".cam2",
        start: "top 50%",
        end: "top top",
        toggleActions: "restart none reverse none",
        scrub: 1,
    },
})

// let tl2 = gsap.timeline({
//     defaults: { 
//         ease: "power1.inOut", duration: 1,
//         scrollTrigger: {
//             markers: true,
//             trigger: ".cam2",
//             start: "top 50%",
//             end: "top top",
//             toggleActions: "restart none reverse none",
//             scrub: 1,
//         },
//     },
// })

// tl2.to(camera.position, {y: -5})

var box;
gltfLoader.load('/objects/temple.gltf', function(gltf){
    box = gltf.scene;
    for(let i = 0; i < box.children.length; i++){
        let mesh = box.children[i];
        mesh.castShadow = true;
    }
    scene.add(box);
    box.position.set(0, -5, 0);
    box.scale.set(.3, .3, .3);
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


//-----------------------------LIGHTS-------------------------------
const hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 3 );
scene.add( hemiLight );

// const ambientLight = new THREE.AmbientLight('#2900af', 1);
// const ambientLight = new THREE.AmbientLight('#FEED01', 1);
// scene.add(ambientLight);

// const spotLight1 = new THREE.SpotLight(0xffa95c,4);
const spotLight1 = new THREE.SpotLight('#F8F8F8', 3, 1000);
//spotLight1.castShadow = true;
scene.add(spotLight1)
const spotLight1Helper = new THREE.SpotLightHelper(spotLight1, 1)
scene.add(spotLight1Helper)

const rectLight = new THREE.RectAreaLight('#0077ff', 1.5, 2000, 2000);
rectLight.position.set(5, 50, 50);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

const pointLight = new THREE.PointLight('#FEED01', 3, 1000, 1);
pointLight.position.set(5, 50, 50);
//pointLight.castShadow = true;
scene.add(pointLight);
const pointH = new THREE.PointLightHelper(pointLight, 1)
scene.add(pointH)

// pointLight = gui.addFolder('pointLight')
// pointLight.add(pointLight3.position, 'x').min(-6).max(6).step(0.01)
// pointLight.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
// pointLight.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
// pointLight.add(pointLight3, 'intensity').min(0).max(10).step(0.01)


//-----------------------------SIZES-------------------------------


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
// renderer.gammaOutput = true;


renderer.outputEncoding = THREE.GammaEncoding;
//renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//-----------------------------ANIMATION-------------------------------
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


const clock = new THREE.Clock()
const tick = () =>
{
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // ----- Update objects -----

    // japan
    if(camera.position.y>-.3){
        if(japan){
            japan.rotation.x += 0.05 * (Math.PI/3- targetY -japan.rotation.x)
            japan.rotation.y += 0.5 * (targetX -japan.rotation.y)
        }
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

gsap.from('body',{
    backgroundColor: "rgba( 254, 237, 1, 1)", ease: 'Power3.easeOut',
    scrollTrigger: {
        trigger: ".title h1",
        start: "top 50%",
        end: "top top",
        toggleActions: "restart none reverse none",
        scrub: 1,
    },
})

gsap.from('header', {
    opacity: 0, duration: 1, y: -50, ease: 'Power2.easeInOut'
});


// gsap.to(camera.position, {y: -5, ease: "power1.inOut", duration: 2,
//     scrollTrigger: {
//         markers: true,
//         trigger: ".cam2",
//         start: "top 50%",
//         end: "top top",
//         toggleActions: "restart none reverse none",
//         scrub: 1,
//     },
// })




gsap.to('blockquote .bl-wrap',{
    left: "100%", 
    width: "150%",
    ease: 'Power1.easeInOut',
    scrollTrigger: {
        trigger: 'blockquote .bl-wrap',
        start: 'top 60%',
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
        start: 'top 70%',
        end: 'top 50%',
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