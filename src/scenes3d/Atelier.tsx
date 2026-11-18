'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, OrbitControls, PerformanceMonitor, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Books, Box, Frame, Lantern, Plant, Rod, Sketchbook, palette } from './Objects';
import Mascot from './Mascot';
import { AtelierDetails, PortalCompass, Woodland } from './Environment';
import type { Journey } from '@/lib/journey';
import { gallerySlots, type MascotState, type RealmId } from '@/data/portfolio';

function Window({ x }: { x: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.72, 0);
    s.lineTo(0.72, 0);
    s.lineTo(0.72, 1.5);
    s.absarc(0, 1.5, 0.72, 0, Math.PI, false);
    s.closePath();
    return s;
  }, []);
  return (
    <group position={[x, 1.3, -2.7]}>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial
          color="#d3b77b"
          emissive="#ffc17b"
          emissiveIntensity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Rod from={[-0.78, 0, 0.05]} to={[-0.78, 1.5, 0.05]} color={palette.darkWood} />
      <Rod from={[0.78, 0, 0.05]} to={[0.78, 1.5, 0.05]} color={palette.darkWood} />
      <mesh position={[0, 1.5, 0.06]}>
        <torusGeometry args={[0.78, 0.055, 6, 32, Math.PI]} />
        <meshStandardMaterial color={palette.darkWood} />
      </mesh>
      <Rod from={[0, 0, 0.07]} to={[0, 2.2, 0.07]} />
      <Rod from={[-0.72, 0.9, 0.07]} to={[0.72, 0.9, 0.07]} />
      <Box size={[1.8, 0.11, 0.35]} position={[0, 0, 0.1]} color={palette.wood} />
    </group>
  );
}
function Studio({
  journey,
  reduced,
  openBook,
  setMascot,
  mascot,
  enterRealm,
}: {
  journey: Journey;
  reduced: boolean;
  openBook: () => void;
  mascot: MascotState;
  setMascot: (s: MascotState) => void;
  enterRealm: (realm: RealmId) => void;
}) {
  return (
    <group>
      <mesh position-y={-0.12} receiveShadow>
        <cylinderGeometry args={[4.8, 5, 0.28, 64]} />
        <meshStandardMaterial color="#42392a" />
      </mesh>
      {Array.from({ length: 20 }, (_, i) => {
        const z = (i - 9.5) * 0.43;
        const width = Math.sqrt(Math.max(0, 4.65 ** 2 - z ** 2)) * 2;
        return (
          <Box
            key={i}
            size={[width, 0.06, 0.41]}
            position={[0, 0.05, z]}
            color={i % 3 === 0 ? '#776047' : '#69543e'}
          />
        );
      })}
      <Box size={[8, 1.1, 0.22]} position={[0, 0.65, -2.9]} color="#384a3b" />
      <Box size={[0.65, 3.8, 0.24]} position={[0, 2.1, -2.9]} color="#46513e" />
      {[-3.7, 3.7].map((x) => (
        <group key={x}>
          <Rod
            from={[x, 0, -2.8]}
            to={[x * 0.9, 4.5, -2.8]}
            radius={0.21}
            color={palette.darkWood}
          />
          <Rod from={[x, 0, 2]} to={[x * 0.9, 4.5, 2]} radius={0.18} color={palette.darkWood} />
          <Rod from={[x * 0.9, 4.5, -2.8]} to={[0, 5.5, -2.8]} radius={0.15} color={palette.wood} />
          <Rod from={[x * 0.9, 4.5, 2]} to={[0, 5.5, 2]} radius={0.15} color={palette.wood} />
          <Rod
            from={[x * 0.9, 4.5, -2.8]}
            to={[x * 0.9, 4.5, 2]}
            radius={0.14}
            color={palette.wood}
          />
        </group>
      ))}
      <Window x={-1.9} />
      <Window x={1.9} />
      <AtelierDetails />
      <Box size={[3.35, 0.18, 1.7]} position={[0, 1.4, 0.55]} color={palette.wood} castShadow />
      {[-1.35, 1.35].flatMap((x) =>
        [-0.05, 1.15].map((z) => (
          <Rod
            key={`${x}${z}`}
            from={[x, 0.1, z]}
            to={[x * 0.9, 1.35, z]}
            radius={0.075}
            color={palette.darkWood}
          />
        )),
      )}
      <Sketchbook
        open={journey.view === 'book' || journey.view === 'hub'}
        page={journey.page}
        reduced={reduced}
        onClick={openBook}
      />
      <Lantern position={[1.1, 1.5, 0.1]} />
      <group position={[1.4, 1.5, -0.05]}>
        <mesh position-y={0.12}>
          <cylinderGeometry args={[0.1, 0.08, 0.24, 12]} />
          <meshStandardMaterial color="#b5a58b" />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => (
          <Rod
            key={i}
            from={[0, 0.12, 0]}
            to={[Math.sin(i) * 0.12, 0.6, Math.cos(i) * 0.08]}
            radius={0.013}
            color={i % 2 ? '#b99c66' : '#7b493b'}
          />
        ))}
      </group>
      <group
        position={[3, 0.1, -1.5]}
        rotation-y={-0.45}
        onClick={(e) => {
          e.stopPropagation();
          enterRealm('books');
        }}
      >
        {[0.5, 1.35, 2.2].map((y, i) => (
          <group key={y}>
            <Box size={[1.5, 0.08, 0.45]} position={[0, y, 0]} color={palette.wood} />
            <Books position={[-0.55, y + 0.05, 0]} count={i === 1 ? 5 : 7} />
          </group>
        ))}
        {[-0.75, 0.75].map((x) => (
          <Box key={x} size={[0.08, 2.7, 0.5]} position={[x, 1.35, 0]} color={palette.darkWood} />
        ))}
        <Plant position={[0.3, 2.3, 0]} scale={0.6} />
      </group>
      <group position={[-3.15, 0.1, -1.1]} rotation-y={0.5}>
        <Rod from={[-0.5, 0, 0.2]} to={[0, 2.5, 0]} />
        <Rod from={[0.5, 0, 0.2]} to={[0, 2.5, 0]} />
        <Rod from={[0, 2, 0]} to={[0, 0, -0.6]} />
        <Frame position={[0, 1.75, 0.1]} color="#5c6d55" onClick={() => enterRealm('art')} />
        <Box size={[1.8, 0.08, 0.3]} position={[0, 0.78, 0.2]} color={palette.wood} />
      </group>
      <Plant position={[-3.4, 0.1, 1.6]} scale={1.5} />
      <Plant position={[3.5, 0.1, 1.5]} scale={1.7} />
      <Plant position={[-0.5, 1.35, -2.4]} scale={0.7} />
      <group position={[1.9, 0.2, 1.75]}>
        <Box size={[0.65, 0.12, 0.65]} position-y={0.65} color={palette.wood} />
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <Rod key={`${x}${z}`} from={[x * 0.3, 0, z * 0.3]} to={[x * 0.23, 0.65, z * 0.23]} />
          )),
        )}
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          setMascot('wave');
        }}
        onPointerOver={() => setMascot('wave')}
        onPointerOut={() => setMascot('idle')}
      >
        <Mascot state={mascot} reduced={reduced} />
      </group>
      <mesh position={[0, 0.1, 0.6]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.3, 2.8, 64]} />
        <meshStandardMaterial color="#6a3e3e" roughness={1} />
      </mesh>
    </group>
  );
}
function CameraRig({
  journey,
  reduced,
  mobile,
}: {
  journey: Journey;
  reduced: boolean;
  mobile: boolean;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 1.5, 0));
  const previous = useRef('');
  const transition = useRef(true);
  const destination = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const v = journey.view;
    const key = `${v}:${journey.inspected}`;
    if (previous.current !== key) {
      previous.current = key;
      transition.current = true;
    }
    if (v === 'gallery' && journey.inspected === null && !transition.current) return;
    const index = journey.inspected ?? 0;
    const pos =
      v === 'intro'
        ? [9, 5.4, 12]
        : v === 'book'
          ? [0, mobile ? 5.4 : 4.3, mobile ? 4.5 : 3.2]
          : v === 'hub'
            ? [0, 3.6, 7.2]
            : v === 'gallery'
              ? journey.inspected === null
                ? [0, 2.2, mobile ? 6.8 : 5.2]
                : [(index - 1) * 2.8, 2.1, mobile ? 0.8 : -0.1]
              : mobile
                ? [8, 6.3, 12.5]
                : [6.8, 4.9, 9.4];
    const target =
      v === 'book'
        ? [mobile ? 0 : 0.65, 1.5, 0.5]
        : v === 'hub'
          ? [0.2, 2.1, 0]
          : v === 'gallery'
            ? [journey.inspected === null ? 0 : (index - 1) * 2.8, 2.1, -3.5]
            : [mobile ? 0 : -0.7, 1.85, 0];
    const alpha = reduced ? 1 : 1 - Math.exp(-3 * Math.min(dt, 0.5));
    destination.set(pos[0], pos[1], pos[2]);
    aim.set(target[0], target[1], target[2]);
    camera.position.lerp(destination, alpha);
    look.current.lerp(aim, alpha);
    camera.lookAt(look.current);
    if (controls.current) controls.current.target.copy(look.current);
    if (
      v === 'gallery' &&
      journey.inspected === null &&
      camera.position.distanceTo(destination) < 0.03
    ) {
      transition.current = false;
      if (controls.current) controls.current.enabled = true;
    } else if (controls.current) controls.current.enabled = false;
  });
  return journey.view === 'gallery' && journey.inspected === null ? (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={false}
      target={[0, 2.1, -3.5]}
      minDistance={3}
      maxDistance={12}
      minPolarAngle={0.8}
      maxPolarAngle={1.65}
      maxAzimuthAngle={0.7}
      minAzimuthAngle={-0.7}
      enablePan={false}
    />
  ) : null;
}
function Gallery({ realm, inspect }: { realm: RealmId; inspect: (i: number) => void }) {
  const slots = gallerySlots(realm);
  return (
    <group>
      <Box size={[11, 0.2, 9]} position={[0, -0.1, -0.5]} color="#645c49" />
      <Box size={[11, 4.8, 0.2]} position={[0, 2.3, -3.8]} color="#31463c" />
      {slots.map((entry, i) => (
        <group key={entry?.id ?? i}>
          <Frame
            position={[(i - 1) * 2.8, 2.1, -3.6]}
            onClick={() => inspect(i)}
            image={entry?.image}
            color={['#677059', '#5d5750', '#495c58'][i % 3]}
          />
          <Lantern position={[(i - 1) * 2.8, 3.5, -3.1]} />
        </group>
      ))}
      <Plant position={[-4.5, 0, -2.5]} scale={1.6} />
      <Plant position={[4.5, 0, -2.5]} scale={1.6} />
    </group>
  );
}
function Runtime({
  reduced,
  paused,
  failed,
}: {
  reduced: boolean;
  paused: boolean;
  failed: () => void;
}) {
  const { gl, setFrameloop, invalidate } = useThree();
  useEffect(() => {
    const update = () => {
      setFrameloop(document.hidden || paused ? 'never' : reduced ? 'demand' : 'always');
      invalidate();
    };
    update();
    gl.domElement.addEventListener('webglcontextlost', failed);
    document.addEventListener('visibilitychange', update);
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', failed);
      document.removeEventListener('visibilitychange', update);
    };
  }, [gl, setFrameloop, invalidate, reduced, paused, failed]);
  return null;
}
export default function Atelier({
  journey,
  realm,
  mascot,
  setMascot,
  reduced,
  low,
  paused,
  downgrade,
  openBook,
  inspect,
  enterRealm,
  ready,
  failed,
}: {
  journey: Journey;
  realm: RealmId;
  mascot: MascotState;
  setMascot: (s: MascotState) => void;
  reduced: boolean;
  low: boolean;
  paused: boolean;
  downgrade: () => void;
  openBook: () => void;
  inspect: (i: number) => void;
  enterRealm: (realm: RealmId) => void;
  ready: () => void;
  failed: () => void;
}) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = matchMedia('(max-width: 700px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <Canvas
      shadows={!low && !mobile ? { type: THREE.PCFShadowMap } : false}
      dpr={low || mobile ? 1 : [1, 1.5]}
      camera={{ position: [10, 6, 13], fov: 43, near: 0.1, far: 70 }}
      gl={{ antialias: !low, powerPreference: 'low-power' }}
      onCreated={ready}
      fallback={null}
    >
      <Runtime reduced={reduced} paused={paused} failed={failed} />
      {!low && !reduced && (
        <PerformanceMonitor ms={500} iterations={4} bounds={() => [28, 58]} onDecline={downgrade} />
      )}
      <color attach="background" args={['#172e29']} />
      <fog attach="fog" args={['#172e29', 13, 36]} />
      <ambientLight intensity={0.25} color="#a6bca6" />
      <hemisphereLight args={['#a8c5d1', '#4e3a28', 0.85]} />
      <directionalLight position={[-5, 6, -2]} intensity={1.1} color="#91bed3" />
      <directionalLight
        position={[3, 8, 5]}
        intensity={2.3}
        color="#ffe2aa"
        castShadow={!low && !mobile}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-normalBias={0.04}
      />
      <pointLight position={[0, 3, -1.6]} color="#ffc379" intensity={17} distance={10} decay={2} />
      <Suspense fallback={null}>
        <Woodland />
        {journey.view === 'gallery' ? (
          <Gallery realm={realm} inspect={inspect} />
        ) : (
          <Studio
            journey={journey}
            reduced={reduced}
            openBook={openBook}
            mascot={mascot}
            setMascot={setMascot}
            enterRealm={enterRealm}
          />
        )}
        {journey.view === 'hub' && <PortalCompass reduced={reduced} enter={enterRealm} />}
      </Suspense>
      {!reduced && (
        <Sparkles
          count={low || mobile ? 35 : 95}
          scale={[13, 6, 10]}
          size={2}
          speed={0.16}
          opacity={0.45}
          color="#ebd599"
        />
      )}
      <CameraRig journey={journey} reduced={reduced} mobile={mobile} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
