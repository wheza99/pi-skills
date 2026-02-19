# Three.js Examples/Addons Reference

Daftar modul tambahan yang tersedia di `three/addons/`. Import dengan:

```javascript
import { NamaClass } from 'three/addons/path/to/NamaClass.js';
```

## Controls

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
```

## Loaders

```javascript
// 3D Models
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { 3DSLoader } from 'three/addons/loaders/3DSLoader.js';
import { AMFLoader } from 'three/addons/loaders/AMFLoader.js';
import { AssimpLoader } from 'three/addons/loaders/AssimpLoader.js';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { GCodeLoader } from 'three/addons/loaders/GCodeLoader.js';
import { KMZLoader } from 'three/addons/loaders/KMZLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';
import { LUT3dlLoader } from 'three/addons/loaders/LUT3dlLoader.js';
import { LUTCubeLoader } from 'three/addons/loaders/LUTCubeLoader.js';
import { MD2Loader } from 'three/addons/loaders/MD2Loader.js';
import { MDDLoader } from 'three/addons/loaders/MDDLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { NRRDLoader } from 'three/addons/loaders/NRRDLoader.js';
import { OBJLoader2 } from 'three/addons/loaders/OBJLoader2.js';
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js';
import { PVRLoader } from 'three/addons/loaders/PVRLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { RGBMLoader } from 'three/addons/loaders/RGBMLoader.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { TDSLoader } from 'three/addons/loaders/TDSLoader.js';
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { USDZLoader } from 'three/addons/loaders/USDZLoader.js';
import { VOXLoader } from 'three/addons/loaders/VOXLoader.js';
import { VRMLLoader } from 'three/addons/loaders/VRMLLoader.js';
import { VTKLoader } from 'three/addons/loaders/VTKLoader.js';
import { XLoader } from 'three/addons/loaders/XLoader.js';

// Compression
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
```

## Post-Processing

```javascript
// Core
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js';
import { ClearPass } from 'three/addons/postprocessing/ClearPass.js';
import { MaskPass } from 'three/addons/postprocessing/MaskPass.js';
import { ClearMaskPass } from 'three/addons/postprocessing/ClearMaskPass.js';

// Effects
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { CubeTexturePass } from 'three/addons/postprocessing/CubeTexturePass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { LUTPass } from 'three/addons/postprocessing/LUTPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { SavePass } from 'three/addons/postprocessing/SavePass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { WaterPass } from 'three/addons/postprocessing/WaterPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { AdaptiveToneMappingPass } from 'three/addons/postprocessing/AdaptiveToneMappingPass.js';
import { SSRrPass } from 'three/addons/postprocessing/SSRrPass.js';
```

## Shaders

```javascript
// Shader materials
import { ShaderMaterial } from 'three';

// Predefined shaders (for ShaderPass)
import { CopyShader } from 'three/addons/shaders/CopyShader.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { ConvolutionShader } from 'three/addons/shaders/ConvolutionShader.js';
import { DOFMipMapShader } from 'three/addons/shaders/DOFMipMapShader.js';
import { DigitalGlitch } from 'three/addons/shaders/DigitalGlitch.js';
import { FocusShader } from 'three/addons/shaders/FocusShader.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { HorizontalTiltShiftShader } from 'three/addons/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/addons/shaders/VerticalTiltShiftShader.js';
import { KaleidoShader } from 'three/addons/shaders/KaleidoShader.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { MirrorShader } from 'three/addons/shaders/MirrorShader.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { SepiaShader } from 'three/addons/shaders/SepiaShader.js';
import { SobelOperatorShader } from 'three/addons/shaders/SobelOperatorShader.js';
import { TechnicolorShader } from 'three/addons/shaders/TechnicolorShader.js';
import { ToneMapShader } from 'three/addons/shaders/ToneMapShader.js';
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js';
import { ColorifyShader } from 'three/addons/shaders/ColorifyShader.js';
import { BleachBypassShader } from 'three/addons/shaders/BleachBypassShader.js';
import { BrightnessContrastShader } from 'three/addons/shaders/BrightnessContrastShader.js';
import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js';
import { FreiChenShader } from 'three/addons/shaders/FreiChenShader.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';
import { HueSaturationShader } from 'three/addons/shaders/HueSaturationShader.js';
import { PixelShader } from 'three/addons/shaders/PixelShader.js';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import { TriangleBlurShader } from 'three/addons/shaders/TriangleBlurShader.js';

// Custom shader materials
import { CustomShaderMaterial } from 'three/addons/materials/CustomShaderMaterial.js';
import { LDrawConditions } from 'three/addons/materials/LDrawConditions.js';
import { LDrawUtils } from 'three/addons/materials/LDrawUtils.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
```

## WebXR

```javascript
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/addons/webxr/XRHandModelFactory.js';
import { XREstimatedLight } from 'three/addons/webxr/XREstimatedLight.js';
import { XRPlanes } from 'three/addons/webxr/XRPlanes.js';
import { XRPrimitiveLayer } from 'three/addons/webxr/XRPrimitiveLayer.js';
```

## Helpers

```javascript
import { ArrowHelper } from 'three/src/helpers/ArrowHelper.js';
import { AxesHelper } from 'three/src/helpers/AxesHelper.js';
import { BoxHelper } from 'three/src/helpers/BoxHelper.js';
import { CameraHelper } from 'three/src/helpers/CameraHelper.js';
import { DirectionalLightHelper } from 'three/src/helpers/DirectionalLightHelper.js';
import { GridHelper } from 'three/src/helpers/GridHelper.js';
import { HemisphereLightHelper } from 'three/src/helpers/HemisphereLightHelper.js';
import { PlaneHelper } from 'three/src/helpers/PlaneHelper.js';
import { PointLightHelper } from 'three/src/helpers/PointLightHelper.js';
import { PolarGridHelper } from 'three/src/helpers/PolarGridHelper.js';
import { SkeletonHelper } from 'three/src/helpers/SkeletonHelper.js';
import { SpotLightHelper } from 'three/src/helpers/SpotLightHelper.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/addons/helpers/VertexTangentsHelper.js';
import { PositionalAudioHelper } from 'three/addons/helpers/PositionalAudioHelper.js';
import { ViewHelper } from 'three/addons/helpers/ViewHelper.js';
```

## Exporters

```javascript
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ColladaExporter } from 'three/addons/exporters/ColladaExporter.js';
import { DRACOExporter } from 'three/addons/exporters/DRACOExporter.js';
import { EXRExporter } from 'three/addons/exporters/EXRExporter.js';
import { MDDExporter } from 'three/addons/exporters/MDDExporter.js';
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js';
```

## Geometry Generators

```javascript
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { ConvexHull } from 'three/addons/geometries/ConvexHull.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { ParametricGeometries } from 'three/addons/geometries/ParametricGeometries.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
```

## Modifiers

```javascript
import { EdgeSplitModifier } from 'three/addons/modifiers/EdgeSplitModifier.js';
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
```

## Math Extensions

```javascript
import { Capsule } from 'three/addons/math/Capsule.js';
import { ColorConverter } from 'three/addons/math/ColorConverter.js';
import { ConvexHull } from 'three/addons/math/ConvexHull.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { Lut } from 'three/addons/math/Lut.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { OBB } from 'three/addons/math/OBB.js';
import { Octree } from 'three/addons/math/Octree.js';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
import { Triangle } from 'three/src/math/Triangle.js';
```

## Environment & Sky

```javascript
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DebugEnvironment } from 'three/addons/environments/DebugEnvironment.js';
import { Sky } from 'three/addons/objects/Sky.js';
```

## Misc Objects

```javascript
import { Lensflare } from 'three/addons/objects/Lensflare.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
import { Refractor } from 'three/addons/objects/Refractor.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';
import { Water2 } from 'three/addons/objects/Water2.js';
```

## Lines

```javascript
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
```

## Physics

```javascript
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js';
```

## Utils

```javascript
import { BufferGeometryUtils } from 'three/addons/utils/BufferGeometryUtils.js';
import { GeometryCompressionUtils } from 'three/addons/utils/GeometryCompressionUtils.js';
import { GeometryUtils } from 'three/addons/utils/GeometryUtils.js';
import { SceneUtils } from 'three/addons/utils/SceneUtils.js';
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';
import { SphericalReflectionMapping } from 'three/addons/utils/SphericalReflectionMapping.js';
import { UVsDebug } from 'three/addons/utils/UVsDebug.js';
```
