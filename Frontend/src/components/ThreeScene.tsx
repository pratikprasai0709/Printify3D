import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment} from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";

function Bottle({ customization }: any) {
  const { scene } = useGLTF("/balen.glb");
  
    useEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        console.log("Mesh:", obj.name);
      }
    });
  }, [scene]);


  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const lastTextureRef = useRef<THREE.Texture | null>(null);

  const { camera }: { camera: THREE.PerspectiveCamera } = useThree();


  // 1) Rotate model upright
  useEffect(() => {
    if (!groupRef.current) return;

    
    //groupRef.current.rotation.set(-Math.PI / 2, 0, 0);
    //groupRef.current.rot  ation.set(Math.PI / 2, 0, 0);
     //groupRef.current.rotation.set(0, 0, Math.PI / 2);
     groupRef.current.rotation.set(0, Math.PI / 2, 0);


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
    controlsRef.current.update();
  }, [camera, scene]);


useEffect(() => {
  if (!customization.color) return;

  scene.traverse((obj: any) => {
    if (!obj.isMesh) return;

    const name = (obj.name || "").toLowerCase();

    // label planes keep textures
    if (name.startsWith("plane")) return;

    obj.material = obj.material?.clone?.() ?? obj.material;

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats.forEach((mat: any) => {
      if (!mat) return;

      // remove dark base color texture so chosen color shows
      if (mat.map) {
        mat.map = null;
      }

      if (mat.color) {
        mat.color.set(customization.color);
      }

      mat.needsUpdate = true;
    });
  });
}, [customization.color, scene]);

  

  // 3) Apply label texture
  useEffect(() => {
    if (!customization.labelTexture) return;

    const texture = new THREE.TextureLoader().load(customization.labelTexture, (t) => {
      t.needsUpdate = true;
    });
    texture.flipY = false;

    if (lastTextureRef.current) lastTextureRef.current.dispose();
    lastTextureRef.current = texture;

    scene.traverse((obj: any) => {
      if (obj.isMesh && obj.name.includes("body")) {
        obj.material = obj.material?.clone?.() ?? obj.material;
        obj.material.map = texture;
        obj.material.needsUpdate = true;
      }
    });
  }, [customization.labelTexture, scene]);




  

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
      <OrbitControls ref={controlsRef} enableDamping />
    </>
  );
}

export default function ThreeScene({ customization }: any) {
  return (
    <Canvas camera={{ fov: 45, position: [0, 0, 3] }}>
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 2, 2]} intensity={1.2} />
      <Environment preset="studio" />
      <Bottle customization={customization} />
    </Canvas>
  );
}
