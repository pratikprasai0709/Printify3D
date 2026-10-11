import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

function HeroBottle() {
  const { scene } = useGLTF('/hero_stanley_tumbler_v2.glb');
  const { model, scale, position } = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const partName = object.name.toLowerCase();
      const color = partName.includes('cup')
        ? '#a9dcf2'
        : partName.includes('lid')
          ? '#e5f3f8'
          : null;
      if (!color) return;

      const tintMaterial = (material: THREE.Material) => {
        const tinted = material.clone() as THREE.MeshStandardMaterial;
        // The source albedo maps are baked bright orange, so override them with the selected light palette.
        tinted.map = null;
        tinted.color.set(color);
        tinted.needsUpdate = true;
        return tinted;
      };

      object.material = Array.isArray(object.material)
        ? object.material.map(tintMaterial)
        : tintMaterial(object.material);
    });
    model.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = 2.85 / Math.max(size.x, size.y, size.z);

    return { model, scale, position: center.multiplyScalar(-scale) };
  }, [scene]);

  return (
    <group scale={scale} position={position}>
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload('/hero_stanley_tumbler_v2.glb');

function BottleLoading() {
  return (
    <Html center>
      <span className="rounded-full bg-white/85 px-4 py-2 text-xs font-semibold text-slate-500 shadow-lg backdrop-blur">
        Loading 3D preview
      </span>
    </Html>
  );
}

const features = [
  { title: 'Real-time 3D', desc: 'Interact with your design from every angle with professional rendering.' },
  { title: 'Eco Friendly', desc: 'All our materials are sustainable and built for a lifetime of use.' },
  { title: 'Premium Quality', desc: 'Double-walled insulation keeps your drinks perfect for up to 24 hours.' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="overflow-hidden px-6 pb-20 pt-8 sm:pt-10">
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
        <div className="flex-1 space-y-7 text-center lg:text-left">
          <div className="hero-enter hero-enter-delay-1 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand-accent" />
            Design Reimagined
          </div>
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-brand-primary sm:text-6xl lg:text-7xl">
            <span className="hero-text-line">
              <span className="hero-text-reveal hero-text-delay-1">Design Your Bottle</span>
            </span>
            <span className="hero-text-line">
              <span className="hero-text-reveal hero-text-delay-2 bg-gradient-to-r from-brand-primary via-blue-700 to-brand-accent bg-clip-text text-transparent">In Stunning 3D</span>
            </span>
          </h1>
          <p className="hero-copy-reveal mx-auto max-w-xl text-lg font-light leading-relaxed text-brand-secondary lg:mx-0">
            Create unique hydration experiences with our intuitive 3D editor. Choose your model, apply your art, and see it come to life instantly.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
            <div className="hero-enter hero-enter-delay-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/selection')}
                className="group w-full rounded-2xl bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-slate-900/15 transition duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-2xl active:scale-[0.98] sm:w-auto"
              >
                Start Designing <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
            <div className="hero-enter hero-enter-delay-5 w-full sm:w-auto">
              <button
                onClick={() => navigate('/selection')}
                className="w-full rounded-2xl border-2 border-brand-border bg-white/80 px-8 py-4 text-lg font-bold text-brand-secondary transition duration-300 hover:-translate-y-1 hover:border-brand-primary hover:text-brand-primary sm:w-auto"
              >
                View Bottles
              </button>
            </div>
          </div>
          <div className="hero-enter hero-enter-delay-6 flex items-center justify-center gap-3 pt-2 text-sm text-slate-500 lg:justify-start">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="h-7 w-7 rounded-full border-2 border-white bg-blue-200" />
              <span className="h-7 w-7 rounded-full border-2 border-white bg-teal-200" />
              <span className="h-7 w-7 rounded-full border-2 border-white bg-violet-200" />
            </span>
            <span>Make it yours, down to every detail</span>
          </div>
        </div>

        <div className="hero-enter hero-enter-delay-3 relative aspect-square w-full max-w-xl flex-1 sm:max-w-2xl" role="group" aria-label="Interactive rotating 3D bottle preview">
          <div className="absolute inset-[12%] rounded-full bg-gradient-to-br from-sky-200 via-blue-100 to-teal-100 blur-3xl" />
          <div className="absolute inset-[5%] rounded-full border border-white/80 bg-white/30 shadow-[0_25px_100px_rgba(59,130,246,0.12)] backdrop-blur-sm" />
          <div className="absolute inset-[11%] rounded-full border border-blue-100/70" />
          <div className="absolute inset-[1%] rounded-full border border-dashed border-blue-200/70" aria-hidden="true" />
          <div className="absolute inset-[5%] cursor-grab overflow-hidden rounded-[3rem] active:cursor-grabbing">
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 0.02, 5.7], fov: 36 }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={1.15} />
              <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
              <directionalLight position={[-4, 1, -3]} intensity={1.35} color="#a5f3fc" />
              <pointLight position={[1, 1, 3]} intensity={1.2} color="#fda4af" />
              <Suspense fallback={<BottleLoading />}>
                <HeroBottle />
              </Suspense>
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableDamping
                dampingFactor={0.08}
                autoRotate
                autoRotateSpeed={0.65}
                minPolarAngle={Math.PI * 0.2}
                maxPolarAngle={Math.PI * 0.8}
              />
            </Canvas>
          </div>
          <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-md backdrop-blur">
            Drag to rotate
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-7xl grid-cols-1 gap-5 md:mt-32 md:grid-cols-3" aria-label="Product features">
        {features.map((feature, index) => (
          <article
            key={feature.title}
            className="hero-enter group rounded-3xl border border-brand-border bg-white/80 p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-900/5"
            style={{ animationDelay: `${500 + index * 100}ms` }}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 font-bold text-brand-accent transition duration-300 group-hover:rotate-3">
              0{index + 1}
            </div>
            <h2 className="mb-3 text-xl font-bold text-brand-primary">{feature.title}</h2>
            <p className="font-light leading-relaxed text-brand-secondary">{feature.desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default LandingPage;
