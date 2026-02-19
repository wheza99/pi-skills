---
name: threejs
description: Skill untuk development dengan Three.js - library JavaScript untuk 3D graphics di web. Gunakan ketika membuat aplikasi 3D, WebGL, animasi 3D, scene setup, geometri, material, lighting, camera, rendering, post-processing, loaders, atau WebXR.
---

# Three.js Development

Skill ini membantu development dengan Three.js, library JavaScript populer untuk membuat dan menampilkan animasi 3D di browser menggunakan WebGL.

## Setup

Install Three.js di project:

```bash
npm install three
```

Untuk TypeScript support:
```bash
npm install three @types/three
```

## Struktur API

Three.js terbagi menjadi beberapa kategori utama:

### Core Modules
- **Animation**: AnimationAction, AnimationClip, AnimationMixer, KeyframeTrack
- **Audio**: Audio, AudioAnalyser, AudioContext, AudioListener, PositionalAudio
- **Cameras**: Camera, PerspectiveCamera, OrthographicCamera, CubeCamera, StereoCamera
- **Core**: BufferGeometry, BufferAttribute, Object3D, Raycaster, RenderTarget
- **Geometries**: BoxGeometry, SphereGeometry, PlaneGeometry, dll.
- **Materials**: MeshBasicMaterial, MeshStandardMaterial, MeshPhongMaterial, dll.
- **Textures**: Texture, CubeTexture, DataTexture, VideoTexture

### Examples (Addons)
- **Controls**: OrbitControls, FlyControls, FirstPersonControls
- **Loaders**: GLTFLoader, FBXLoader, OBJLoader, TextureLoader
- **Post-processing**: EffectComposer, RenderPass, ShaderPass
- **Shaders**: Custom shader materials dan effects
- **WebXR**: VR dan AR support

## Penggunaan Dasar

### Scene Setup

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

### Membuat Object

```javascript
// Geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);
```

### Loading 3D Models

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load(
  'model.glb',
  (gltf) => {
    scene.add(gltf.scene);
  },
  (progress) => {
    console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
  },
  (error) => {
    console.error('Error:', error);
  }
);
```

### Post-Processing

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, 0.4, 0.85
));

// Di animation loop, gunakan composer.render() bukan renderer.render()
```

## Kategori API Lengkap

### Core (Built-in)
| Subkategori | Deskripsi |
|-------------|-----------|
| Animation | Keyframe animation system |
| Audio | Positional audio support |
| Cameras | Perspective & orthographic cameras |
| Core | Base classes: Object3D, BufferGeometry, dll. |
| Extras | Curves, utilities |
| Geometries | Built-in shapes (Box, Sphere, Plane, dll.) |
| Helpers | Visual debugging helpers |
| Lights | Various light types |
| Loaders | Texture & model loaders |
| Materials | Surface appearance definitions |
| Math | Vector, Matrix, Quaternion, dll. |
| Nodes | Node-based material system (TSL) |
| Objects | Mesh, Group, Points, Lines, dll. |
| Renderers | WebGLRenderer, WebGPURenderer |
| Scenes | Scene management |
| Textures | Texture types |

### Examples (Addons - import dari 'three/addons/...')
| Subkategori | Deskripsi |
|-------------|-----------|
| Controls | OrbitControls, FlyControls, dll. |
| Loaders | GLTFLoader, FBXLoader, OBJLoader, dll. |
| Postprocessing | EffectComposer, various passes |
| Shaders | Custom shader materials |
| WebXR | VR/AR support |

## Tips

1. **Import**: Core dari `'three'`, addons dari `'three/addons/...'`
2. **Memory**: Panggil `dispose()` untuk geometry, material, texture yang tidak dipakai
3. **Performance**: Gunakan `BufferGeometry` dan batch draw calls
4. **Responsive**: Handle `resize` event untuk update camera dan renderer
5. **Shadows**: Enable `renderer.shadowMap.enabled` dan set `castShadow/receiveShadow`

## TSL (Three.js Shading Language)

Three.js mendukung TSL untuk custom shaders yang lebih mudah:

```javascript
import { texture, uv, color, sin, time } from 'three/tsl';

// Custom material dengan TSL
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = color(0x00ff00).mul(sin(time).mul(0.5).add(0.5));
```

### Keunggulan TSL:
- Works dengan WebGL dan WebGPU backends
- Type-safe dan composable shader nodes
- Tidak perlu string manipulation atau onBeforeCompile
- Automatic optimization

## WebGLRenderer vs WebGPURenderer

**WebGLRenderer** (default):
- Kompatibilitas browser maksimal
- Mayoritas contoh dan tutorial pakai ini

**WebGPURenderer**:
- Untuk custom shaders/materials dengan TSL
- Compute shaders
- Advanced node-based materials

```javascript
// WebGPU dengan TSL
import * as THREE from 'three/webgpu';
const renderer = new THREE.WebGPURenderer({ antialias: true });
await renderer.init();
```

## Tips Penting

1. **Import Maps (CDN)**: Gunakan import maps, bukan script tag lama
2. **Memory Management**: Panggil `dispose()` untuk geometry, material, texture
3. **Responsive**: Handle `resize` event
4. **Shadows**: Enable `renderer.shadowMap.enabled` dan set `castShadow/receiveShadow`
5. **Animation Loop**: Gunakan `renderer.setAnimationLoop(callback)` bukan `requestAnimationFrame` manual

## Referensi

### Dokumentasi Lengkap (Baca file-file ini untuk detail)
- **[llms-full.txt](references/llms-full.txt)** - Dokumentasi lengkap Three.js + TSL untuk LLMs (2716 baris, 127KB)
- **[Common Patterns](references/common-patterns.md)** - Boilerplate, patterns, dan code snippets
- **[Examples/Addons](references/examples-addons.md)** - Daftar modul tambahan dari `three/addons/`
- **[API Reference](references/api-reference.json)** - Index 761 class/modul

### Link Eksternal
- [Three.js Docs](https://threejs.org/docs/) - Dokumentasi resmi
- [Three.js Examples](https://threejs.org/examples/) - Contoh dan demo
- [Three.js Manual](https://threejs.org/manual/) - Tutorial lengkap
- [Discover Three.js](https://discoverthreejs.com/) - Tutorial interaktif
