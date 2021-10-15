//------------------------------------------------------------
// ThreeJS
//------------------------------------------------------------
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Path, PointLightHelper, SphereBufferGeometry } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import luxy from 'luxy.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(MotionPathPlugin, TextPlugin);

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
// const spotLight1Helper = new THREE.SpotLightHelper(spotLight1, 1)
// scene.add(spotLight1Helper)

const rectLight = new THREE.RectAreaLight('#0077ff', 1.5, 2000, 2000);
rectLight.position.set(5, 50, 50);
rectLight.lookAt(0, 0, 0);
scene.add(rectLight);

const pointLight = new THREE.PointLight('#FEED01', 3, 1000, 1);
pointLight.position.set(5, 50, 50);
//pointLight.castShadow = true;
scene.add(pointLight);
// const pointH = new THREE.PointLightHelper(pointLight, 1)
// scene.add(pointH)

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
renderer.toneMappingExposure = 3;
// renderer.gammaOutput = true;


renderer.outputEncoding = THREE.GammaEncoding;
//renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//----------------------------- BACKGROUND OBJECTS -------------------------------
// const geometry = new THREE.PlaneGeometry( 3, 1 );
// const material = new THREE.MeshBasicMaterial( {color: "#F8F8F8"} );
// const p1 = new THREE.Mesh( geometry, material );
// scene.add( p1 );
// p1.position.set(3, -3, -1)


//----------------------------- OBJECTS AND ANIMATIONS -------------------------------
let tl = gsap.timeline({
    defaults: { 
        ease: "power1.inOut", duration: 1, immediateRender: false,
        scrollTrigger: {
            trigger: ".title h1",
            start: "top 50%",
            end: "top top",
            toggleActions: "play pause resume reset",
            scrub: 1,
        },
    },
})

tl.to(camera.position, {y: -2,})

let japan;
gltfLoader.load('/objects/japan3.gltf', function(gltf){
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
        tl.to(japan.children[i].position, {x: x, y: 0, z: z})
        tl.to(japan.children[i].rotation, {x: -Math.PI/3, z: 0, y: 0, }, "<")
    }
});

// to trip
tl.to(camera.position, {y: -5, ease: "power1.inOut",
    scrollTrigger: {
        trigger: ".cam1",
        start: "top 90%",
        end: "top 40%",
        toggleActions: "play pause resume reset",
        scrub: 1,
    },
})

// [0] 1car
// [1] 0earth
// [2] 2cloud
var trip;
gltfLoader.load('/objects/trip1.gltf', function(gltf){
    trip = gltf.scene;
    for(let i = 0; i < trip.children.length; i++){
        let mesh = trip.children[i];
        mesh.castShadow = true;
    }
    scene.add(trip);
    trip.position.set(0, -5.8, 0);
    trip.scale.set(.8, .8, .8);
    // trip.children[1].rotateY(Math.PI/2)
});

// to temple
tl.to(camera.position, {y: -9, ease: "power1.inOut",
    scrollTrigger: {
        trigger: ".cam2",
        start: "top 80%",
        end: "top 40%",
        toggleActions: "play pause resume reset",
        scrub: 1,
    },
})

var temple;
gltfLoader.load('/objects/temple3.gltf', function(gltf){
    temple = gltf.scene;
    for(let i = 0; i < temple.children.length; i++){
        let mesh = temple.children[i];
        mesh.castShadow = true;
    }
    scene.add(temple);
    temple.position.set(0, -9, 0);
    temple.scale.set(.3, .3, .3);
    // temple.children[1].rotation.set(Math.PI, 0, 0)
    // temple.children[2].rotation.set(Math.PI, 0, 0)
    //[6] candy
});

// to truck
tl.to(camera.position, {y: -12, ease: "power0.easeNone",
    scrollTrigger: {
        trigger: ".cam3",
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume reset",
        scrub: 1,
    },
})

// [0]: 2car
// [1]: 0road
// [2]: 1truck
var truck;
gltfLoader.load('/objects/truck3.gltf', function(gltf){
    truck = gltf.scene;
    for(let i = 0; i < truck.children.length; i++){
        let mesh = truck.children[i];
        mesh.castShadow = true;
    }
    scene.add(truck);
    truck.position.set(2, -17, -1);
    // truck.position.set(2, -12.5, -.5);
    truck.scale.set(.3, .3, .3);
    truck.rotation.set(0, Math.PI/4, 0)

    tl.to(truck.position, {y: -12.5, z: -.5, ease: "power0.easeNone",
        scrollTrigger: {
            trigger: ".cam3",
            start: "top bottom",
            end: "top 50%",
            toggleActions: "play pause resume reset",
            scrub: 1,
        },
    })

    tl.to(truck.rotation, {y: 0,ease: "power1.easeOut",
        scrollTrigger: {
            trigger: ".cam4",
            start: "top bottom",
            end: "top top",
            toggleActions: "play pause resume reset",
            scrub: 1,
        },
    })

    // truck.children[2].position.set(0, 0, 0)
    
    // move X
    tl.to(truck.children[2].position, {x: 10, ease: "power4.easeIn",
        scrollTrigger: {
            trigger: ".cam4",
            start: "top 50%",
            end: "bottom top",
            toggleActions: "play pause resume reset",
            scrub: 1,
        },
    })
    tl.to(truck.children[0].position, {x: -5, ease: "power0.easeNone",
        scrollTrigger: {
            trigger: ".cam4",
            start: "top 50%",
            end: "bottom top",
            toggleActions: "play pause resume reset",
            scrub: 1,
        },
    })
});

tl.to(camera.position, {x: 5, ease: "power0.easeNone",
    scrollTrigger: {
        trigger: ".cam4",
        start: "top 50%",
        end: "bottom top",
        toggleActions: "play pause resume reset",
        scrub: 1,
    },
})

// to action
tl.to(camera.position, {y: -18, ease: "power1.inOut",
    scrollTrigger: {
        trigger: ".cam5",
        start: "top bottom",
        end: "top 10%",
        toggleActions: "play pause resume reset",
        scrub: 1,
    },
})

var action;
gltfLoader.load('/objects/action.gltf', function(gltf){
    action = gltf.scene;
    for(let i = 0; i < action.children.length; i++){
        let mesh = action.children[i];
        mesh.castShadow = true;
    }
    scene.add(action);
    action.position.set(5, -19, -1);
    action.scale.set(2, 2, 2);

    //[6] candy
});

// to end
tl.to(camera.position, {y: -25, ease: "power1.inOut",
    scrollTrigger: {
        trigger: ".cam6",
        start: "top bottom",
        end: "top top",
        toggleActions: "play pause resume reset",
        scrub: 1,   
    },
})

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
    const radius = 2;
    const w = Math.PI/9;
    const x = radius * Math.cos(w * elapsedTime);
    const y = radius * Math.sin(w * elapsedTime);  
    // https://ics.media/entry/10657/

    if(camera.position.y>-.3){
        if(japan){
            japan.rotation.x += 0.05 * (Math.PI/3- targetY -japan.rotation.x)
            japan.rotation.y += 0.05 * (targetX -japan.rotation.y)
            // japan.position.z += -0.05 * (targetY -japan.rotation.x)
            japan.children[8].position.x = -x;
            japan.children[7].position.x = x;
        }
    }

    // [0] 1car
    // [1] 0earth
    // [2] 2cloud
    if(-10<camera.position.y&&camera.position.y<-3){
        if(trip){
            trip.children[1].rotation.z = -0.5 * elapsedTime
            trip.children[2].rotation.x = 0.2 * elapsedTime

            trip.children[0].rotation.x += 0.05 * (Math.PI- targetY -trip.children[0].rotation.x)
            trip.children[0].rotation.y += 0.05 * (targetX -trip.children[0].rotation.y)
            trip.children[0].position.x += 0.02 * (targetX - trip.children[0].rotation.y)
        }
    }

        // temple
    // [1] hand
    // [2] hand
    // [3] spiral candy
    // [4] box
    // [5] pack
    // [6] candy
    if(-10<camera.position.y&&camera.position.y<-8){
        if(temple){
            // temple.children[1].rotation.x = .5 * Math.cos(w * elapsedTime)
            // temple.children[2].rotation.x = .5 * Math.cos(w * elapsedTime)
            temple.children[3].rotation.z = -0.5 * elapsedTime
            temple.children[4].rotation.z = 0.4 * elapsedTime
            temple.children[5].rotation.y = 0.2 * elapsedTime
            temple.rotation.x += 0.05 * (targetY -temple.rotation.x)
            temple.rotation.y += 0.05 * (targetX -temple.rotation.y)
            // for(const t of temple.children){
            // }
        }
    }

    if(-19<camera.position.y&&camera.position.y<-15){
        if(action){
            action.children[0].rotation.y = .5 * Math.cos(w * elapsedTime)
            action.rotation.x += 0.05 * (targetY -action.rotation.x)
            action.rotation.y += 0.05 * (targetX -action.rotation.y)
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
// https://reiwinn-web.net/2020/12/25/luxy/

//------------------------------------------------------------
// GSAP(Animation)
//------------------------------------------------------------

// gsap.to('body',{
//     backgroundColor: "#F8F8F8", ease: 'Power3.easeOut',
//     scrollTrigger: {
//         trigger: ".bl-wrap1",
//         start: 'top bottom',
//         end: 'top top',
//         toggleActions: "restart none reverse none",
//         scrub: 1,
//     },
// })

gsap.from('header', {
    opacity: 0, duration: 1, y: -50, ease: 'Power2.easeInOut'
});

//-----------------------------BLOCKQUOTE-------------------------------
gsap.to('.bl-wrap1',{
    left: "100%", 
    width: "150%",
    ease: 'Power1.easeInOut',
    scrollTrigger: {
        trigger: '.bl-wrap1',
        start: 'top 60%',
    }
});
gsap.to('.bl-text1', {
    opacity: 1, 
    delay: 0.1,
    scrollTrigger: {
        trigger: '.bl-wrap1',
        start: 'top 60%',
    }
});

gsap.to('.bl-wrap2',{
    left: "100%", 
    width: "150%",
    ease: 'Power1.easeInOut',
    scrollTrigger: {
        trigger: '.bl-wrap2',
        start: 'top 60%',
    }
});
gsap.to('.bl-text2', {
    opacity: 1, 
    delay: 0.1,
    scrollTrigger: {
        trigger: '.bl-wrap2',
        start: 'top 60%',
    }
});

gsap.to('.bl-wrap3',{
    left: "100%", 
    width: "150%",
    ease: 'Power1.easeInOut',
    scrollTrigger: {
        trigger: '.bl-wrap3',
        start: 'top 60%',
    }
});
gsap.to('.bl-text3', {
    opacity: 1, 
    delay: 0.1,
    scrollTrigger: {
        trigger: '.bl-wrap3',
        start: 'top 60%',
    }
});

gsap.to('.bl-wrap4',{
    left: "100%", 
    width: "150%",
    ease: 'Power1.easeInOut',
    scrollTrigger: {
        trigger: '.bl-wrap4',
        start: 'top 60%',
    }
});
gsap.to('.bl-text4', {
    opacity: 1, 
    delay: 0.1,
    scrollTrigger: {
        trigger: '.bl-wrap4',
        start: 'top 60%',
    }
});

gsap.to('.bl-text5', {
    opacity: 1, 
    delay: 0.1,
    scrollTrigger: {
        trigger: '.bl-wrap5',
        start: 'top 60%',
    }
});

//-----------------------------CARD-------------------------------
gsap.from('.card1', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card1',
        start: 'top 70%',
        end: 'top 60%',
        scrub: 1,
    }
});

gsap.from('.graph-container', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.graph-container',
        start: 'top 70%',
        end: 'top 40%',
        scrub: 1,
    }
});

gsap.from('.card-trip', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card-trip',
        start: 'top 70%',
        end: 'top 60%',
        scrub: 1,
    }
});

gsap.from('.card2', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card2',
        start: 'top 70%',
        end: 'top 60%',
        scrub: 1,
    }
});

gsap.from('.card3', {
    opacity: 0, x: -50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card3',
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1,
    }
});

gsap.from('.card4', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card4',
        start: 'top 70%',
        end: 'top 60%',
        scrub: 1,
    }
});

gsap.from('.card5', {
    opacity: 0, duration: 1, y: 50,ease: 'Power2.easeOut',
    scrollTrigger: {
        trigger: '.card5',
        start: 'top 70%',
        end: 'top 60%',
        scrub: 1,
    }
});

// Background Animation
gsap.to('body',{
    backgroundColor: "#FEED01", ease: 'Power3.easeOut',
    scrollTrigger: {
        trigger: ".backToggle",
        start: "top 60%",
        end: "top 10%",
        scrub: 1,
        toggleActions: "restart none reverse none",
    },
})