# Three.js Common Patterns

## Boilerplate Template

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Three.js App</title>
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module">
    import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
    import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Your objects here
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
```

## Common Geometries

```javascript
// Basic shapes
new THREE.BoxGeometry(width, height, depth)
new THREE.SphereGeometry(radius, widthSegments, heightSegments)
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)
new THREE.PlaneGeometry(width, height)
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)
new THREE.ConeGeometry(radius, height, radialSegments)
new THREE.TetrahedronGeometry(radius)
new THREE.OctahedronGeometry(radius)
new THREE.IcosahedronGeometry(radius)
new THREE.DodecahedronGeometry(radius)

// Advanced
new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q)
new THREE.LatheGeometry(points, segments, phiStart, phiLength)
new THREE.ExtrudeGeometry(shape, extrudeSettings)
new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed)

// From buffer data
new THREE.BufferGeometry().setFromPoints(points)
new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(vertices, 3))
```

## Common Materials

```javascript
// Basic (unlit)
new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })

// Standard (PBR)
new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.5,
  map: texture,
  normalMap: normalTexture,
  roughnessMap: roughnessTexture,
  metalnessMap: metalnessTexture,
  aoMap: aoTexture,
  emissive: 0xff0000,
  emissiveIntensity: 0.5
})

// Phong (legacy)
new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 100,
  specular: 0xffffff
})

// Physical (extended PBR)
new THREE.MeshPhysicalMaterial({
  color: 0x00ff00,
  metalness: 0,
  roughness: 0.5,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  transmission: 0.9, // glass
  thickness: 0.5
})

// Special
new THREE.MeshDepthMaterial()
new THREE.MeshNormalMaterial()
new THREE.ShadowMaterial({ opacity: 0.5 })
new THREE.SpriteMaterial({ map: texture })
```

## Lighting

```javascript
// Ambient - even illumination
const ambient = new THREE.AmbientLight(0x404040, 0.5);

// Directional - sun-like
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 7.5);
directional.castShadow = true;
directional.shadow.mapSize.set(2048, 2048);
directional.shadow.camera.near = 0.5;
directional.shadow.camera.far = 50;

// Point - light bulb
const point = new THREE.PointLight(0xff0000, 1, 100);
point.position.set(0, 5, 0);
point.castShadow = true;

// Spot - flashlight
const spot = new THREE.SpotLight(0xffffff, 1);
spot.position.set(0, 10, 0);
spot.angle = Math.PI / 6;
spot.penumbra = 0.1;
spot.castShadow = true;

// Hemisphere - sky/ground
const hemisphere = new THREE.HemisphereLight(0x87CEEB, 0x3d2817, 0.6);

// Rect Area - area light
const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
rectLight.position.set(0, 5, 0);
rectLight.lookAt(0, 0, 0);
```

## Camera Types

```javascript
// Perspective (most common)
const perspective = new THREE.PerspectiveCamera(
  75,                                    // FOV
  window.innerWidth / window.innerHeight, // aspect
  0.1,                                   // near
  1000                                   // far
);

// Orthographic (2D/isometric)
const frustumSize = 10;
const aspect = window.innerWidth / window.innerHeight;
const orthographic = new THREE.OrthographicCamera(
  frustumSize * aspect / -2, // left
  frustumSize * aspect / 2,  // right
  frustumSize / 2,           // top
  frustumSize / -2,          // bottom
  0.1,                       // near
  1000                       // far
);

// Cube (for reflections)
const cubeCamera = new THREE.CubeCamera(0.1, 1000, new THREE.WebGLCubeRenderTarget(256));
scene.add(cubeCamera);

// Update cube camera
cubeCamera.update(renderer, scene);
material.envMap = cubeCamera.renderTarget.texture;
```

## Animation System

```javascript
// Create animation clip
const positionKF = new THREE.VectorKeyframeTrack(
  '.position',
  [0, 1, 2],
  [0, 0, 0, 1, 2, 0, 0, 0, 0]
);

const rotationKF = new THREE.QuaternionKeyframeTrack(
  '.quaternion',
  [0, 1, 2],
  [0, 0, 0, 1, 0, Math.sin(Math.PI/4), 0, Math.cos(Math.PI/4), 0, 0, 0, 1]
);

const clip = new THREE.AnimationClip('spin', 2, [positionKF, rotationKF]);

// Play animation
const mixer = new THREE.AnimationMixer(mesh);
const action = mixer.clipAction(clip);
action.play();

// In animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
}
```

## Raycasting (Mouse Picking)

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  
  if (intersects.length > 0) {
    console.log('Clicked:', intersects[0].object);
    intersects[0].object.material.color.set(0xff0000);
  }
});
```

## Loading Models

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// GLTF/GLB (recommended)
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('model.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.set(0, 0, 0);
  
  // Play animations
  if (gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
  }
  
  scene.add(model);
});

// FBX
const fbxLoader = new FBXLoader();
fbxLoader.load('model.fbx', (fbx) => {
  scene.add(fbx);
});

// OBJ
const objLoader = new OBJLoader();
objLoader.load('model.obj', (obj) => {
  scene.add(obj);
});
```

## Post-Processing Setup

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

const composer = new EffectComposer(renderer);

// Render pass (required)
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // strength
  0.4,  // radius
  0.85  // threshold
);
composer.addPass(bloomPass);

// SSAO
const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
composer.addPass(ssaoPass);

// Anti-aliasing
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(fxaaPass);

// In animation loop
function animate() {
  requestAnimationFrame(animate);
  composer.render(); // Instead of renderer.render()
}
```

## Memory Management

```javascript
// Dispose properly when removing objects
function disposeObject(obj) {
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => disposeMaterial(m));
    } else {
      disposeMaterial(obj.material);
    }
  }
}

function disposeMaterial(material) {
  material.dispose();
  // Dispose textures
  if (material.map) material.map.dispose();
  if (material.normalMap) material.normalMap.dispose();
  if (material.roughnessMap) material.roughnessMap.dispose();
  if (material.metalnessMap) material.metalnessMap.dispose();
  if (material.aoMap) material.aoMap.dispose();
  if (material.emissiveMap) material.emissiveMap.dispose();
}

// Remove from scene
scene.remove(mesh);
disposeObject(mesh);
```

## WebXR (VR/AR)

```javascript
if (navigator.xr) {
  // VR
  navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
    if (supported) {
      const vrButton = VRButton.createButton(renderer);
      document.body.appendChild(vrButton);
      renderer.xr.enabled = true;
    }
  });

  // AR
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (supported) {
      const arButton = ARButton.createButton(renderer);
      document.body.appendChild(arButton);
      renderer.xr.enabled = true;
    }
  });
}

// XR controllers
const controller1 = renderer.xr.getController(0);
controller1.addEventListener('selectstart', onSelectStart);
controller1.addEventListener('selectend', onSelectEnd);
scene.add(controller1);

const controller2 = renderer.xr.getController(1);
scene.add(controller2);
```
