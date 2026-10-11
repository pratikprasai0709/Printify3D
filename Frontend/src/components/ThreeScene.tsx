import { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, Environment, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useMemo } from "react";
import { getBackendAssetUrl } from "../shared/config/api";

import type { GLTF } from 'three-stdlib'


function Bottle({ customization, modelPath }: any) {
  const fullModelUrl = getBackendAssetUrl(modelPath);
  const { scene: loadedScene } = useGLTF(fullModelUrl) as GLTF;

  // Keep editor changes local to this view instead of mutating Drei's cached GLTF scene.
  const scene = useMemo(() => {
    const model = loadedScene.clone(true);
    model.traverse((obj: any) => {
      if (!obj.isMesh) return;
      obj.material = Array.isArray(obj.material)
        ? obj.material.map((material: THREE.Material) => material.clone())
        : obj.material.clone();
    });
    return model;
  }, [loadedScene]);

  // Dynamically identify which meshes should receive the printable custom texture
  const printableMeshes = useMemo(() => {
    if (!scene) return [];
    const namedMeshes: any[] = [];

    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        // If the 3D artist explicitly named the body/label:
        const n = (obj.name || "").toLowerCase();
        if (n.includes("body") || n.includes("bottle") || n.includes("label")) {
          namedMeshes.push(obj);
        }
      }
    });

    if (namedMeshes.length > 0) return namedMeshes;

    // Fallback: If meshes have generic names (e.g. "Cylinder001"), the main body is almost always the largest mesh by surface area.
    let largestMesh = null;
    let maxArea = -1;
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        if (!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
        const box = obj.geometry.boundingBox;
        if (box) {
          const w = box.max.x - box.min.x;
          const h = box.max.y - box.min.y;
          const d = box.max.z - box.min.z;
          // Surface area heuristic is much safer than volume, handling perfectly thin planes or wrappers.
          const area = 2 * (w * h + h * d + w * d);
          if (area > maxArea) {
            maxArea = area;
            largestMesh = obj;
          }
        }
      }
    });

    return largestMesh ? [largestMesh] : [];
  }, [scene]);

  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const lastTextureRef = useRef<THREE.Texture | null>(null);

  const { camera }: { camera: THREE.PerspectiveCamera } = useThree();


  // 1) Rotate model upright
  useEffect(() => {
    if (!groupRef.current) return;

    // Remove the Math.PI / 2 rotation so the texture's center (front) faces the camera directly
    groupRef.current.rotation.set(0, 0, 0);

    groupRef.current.updateMatrixWorld(true);
  }, []);

  // 2) Frame camera to model
  useEffect(() => {
    if (!groupRef.current || !controlsRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitDistance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)));

    // Put camera in front of the bottle (Z axis) and a bit above (Y)
    camera.position.set(center.x, center.y + maxSize * 0.2, center.z + fitDistance * 1.3);
    camera.near = fitDistance / 100;
    camera.far = fitDistance * 100;
    camera.updateProjectionMatrix();

    // OrbitControls should orbit around the model center
    controlsRef.current.target.copy(center);
    controlsRef.current.minDistance = fitDistance * 1;
    controlsRef.current.maxDistance = fitDistance * 2;
    controlsRef.current.update();
  }, [camera, scene]);


  useEffect(() => {
    if (!customization.color) return;

    scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const isPrintable = printableMeshes.includes(obj);

      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((mat: any) => {
        if (!mat) return;

        // remove dark base color texture so chosen color shows
        // ONLY if it's not a custom label texture
        if (mat.map && !customization.labelTexture) {
          mat.map = null;
        }

        if (mat.color) {
          // If this specific mesh is receiving a label texture, its material color
          // needs to be white (since the canvas already bakes the bottle color inside it)
          if (customization.labelTexture && isPrintable) {
            mat.color.set(0xffffff);
          } else {
            mat.color.set(customization.color);
          }
        }

        mat.needsUpdate = true;
      });
    });
  }, [customization.color, customization.labelTexture, scene, printableMeshes]);



  // 3) Apply label texture
  useEffect(() => {
    if (!customization.labelTexture) return;

    const texture = new THREE.TextureLoader().load(customization.labelTexture, (t) => {
      // Use ClampToEdgeWrapping. 
      // This prevents the texture from repeating (creating a "double image") if the user shifts the logo 
      // near the canvas boundaries and the 3D model's UV map happens to extend beyond [0, 1].
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;

      t.repeat.x = 1;
      t.offset.x = 0;

      // Provide correct color space for newer ThreeJS versions
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
    });
    texture.flipY = true;

    if (lastTextureRef.current) lastTextureRef.current.dispose();
    lastTextureRef.current = texture;

    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        // Only apply texture to the specific mesh that represents the body
        const isPrintable = printableMeshes.includes(obj);

        if (isPrintable) {
          obj.material.map = texture;

          // The canvas texture already includes the bottle color as its background.
          // Set material color to white to display the texture exactly as composed.
          if (obj.material.color) {
            obj.material.color.set(0xffffff);
          }

          obj.material.needsUpdate = true;
        }
      }
    });
  }, [customization.labelTexture, scene, printableMeshes]);






  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
      <OrbitControls ref={controlsRef} enableDamping />
    </>
  );
}

function ModelLoading() {
  const { progress } = useProgress();
  const percent = Math.min(100, Math.round(progress));

  return (
    <Html center>
      <div role="status" className="w-64 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-600 shadow-lg backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" aria-hidden="true" />
          <span>Loading bottle model · {percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-label="Bottle model download progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-1.5 overflow-hidden rounded-full bg-blue-100"
        >
          <div className="h-full rounded-full bg-blue-600 transition-[width] duration-200" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </Html>
  );
}

export default function ThreeScene({ customization, modelPath, className, capturePreview = false, enableEnvironment = true }: any) {
  return (
    <Canvas gl={{ preserveDrawingBuffer: capturePreview }} camera={{ fov: 45, position: [0, 0, 3] }} className={className}>
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 2, 2]} intensity={1.2} />
      <Suspense fallback={<ModelLoading />}>
        <Bottle customization={customization} modelPath={modelPath} />
      </Suspense>
      {enableEnvironment && (
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>
      )}
    </Canvas>
  );
}
