'use client';
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import Studio from './world/Studio';
import Forest from './world/Forest';
import Atmosphere from './world/Atmosphere';
import Realms from './world/Realms';
import Hero from './world/Hero';
import Clockwork, { clockOrigin, forestArrival } from './world/Clockwork';
import WoodlandLanding from './world/WoodlandLanding';
import WandFlight, { type CastTarget } from './world/WandFlight';
import type { Reading } from './world/MagicalBook';
import type { Journey } from '@/lib/journey';
import { type MascotState, type RealmId } from '@/data/portfolio';

function CameraRig({
  journey,
  reduced,
  mobile,
  bloom,
  heroPosition,
  introTimeRef,
}: {
  journey: Journey;
  reduced: boolean;
  mobile: boolean;
  bloom: boolean;
  heroPosition: RefObject<THREE.Vector3>;
  introTimeRef: RefObject<number>;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate } = useThree();
  const look = useRef(new THREE.Vector3(0, 1.5, 0));
  const previous = useRef('');
  const transition = useRef(true);
  const destination = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  const started = useRef(0);
  const keys = useRef(new Set<string>());
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        !(event.target as HTMLElement).matches('input,select,textarea') &&
        ['w', 'a', 's', 'd'].includes(event.key.toLowerCase())
      ) {
        keys.current.add(event.key.toLowerCase());
        invalidate();
      }
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    const clear = () => keys.current.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
  }, [invalidate]);
  const heroCamera = useMemo(() => new THREE.Vector3(0.16, 2.12, mobile ? 9.45 : 8.75), [mobile]);
  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.35, 3.45, 16.9),
        new THREE.Vector3(-1.8, 3.01, 13.5),
        new THREE.Vector3(-0.45, 2.34, 10.2),
        heroCamera,
      ]),
    [heroCamera],
  );
  useFrame(({ clock }, dt) => {
    const v = journey.view;
    const key = `${v}:${journey.inspected}`;
    if (previous.current !== key) {
      previous.current = key;
      transition.current = true;
      started.current = clock.elapsedTime;
    }
    const movable = v === 'gallery' && journey.inspected === null;
    if (movable && !transition.current) {
      if (v === 'gallery' && keys.current.size) {
        const forward = camera.getWorldDirection(new THREE.Vector3());
        forward.y = 0;
        forward.normalize();
        const right = forward.clone().cross(camera.up).normalize();
        const move = new THREE.Vector3()
          .addScaledVector(forward, Number(keys.current.has('w')) - Number(keys.current.has('s')))
          .addScaledVector(right, Number(keys.current.has('d')) - Number(keys.current.has('a')))
          .multiplyScalar(Math.min(dt, 0.05) * 2);
        const before = camera.position.clone();
        camera.position.add(move);
        camera.position.set(
          THREE.MathUtils.clamp(camera.position.x, -4.5, 4.5),
          camera.position.y,
          THREE.MathUtils.clamp(camera.position.z, -0.8, 8),
        );
        controls.current?.target.add(camera.position.clone().sub(before));
        invalidate();
      }
      return;
    }
    const index = journey.inspected ?? 0;
    const elapsed = clock.elapsedTime - started.current;
    const drift = reduced ? 0 : Math.sin(elapsed * 0.36) * 0.065;
    if (v === 'intro' && !reduced) {
      introTimeRef.current = elapsed;
      if (elapsed < forestArrival) {
        const approach = THREE.MathUtils.smootherstep(elapsed, 0.7, 4.06);
        const flight = THREE.MathUtils.smoothstep(elapsed, 3.37, forestArrival + 0.25);
        const distance = (mobile ? 14.9 : 8.3) * (1 - approach) - 28 * flight;
        camera.position.set(
          clockOrigin + Math.sin(elapsed * 0.84) * 0.23,
          Math.cos(elapsed) * 0.09,
          distance,
        );
        camera.lookAt(clockOrigin, 0, Math.min(-0.55, distance - 6));
        return;
      }
    }
    const pos =
      v === 'intro'
        ? path.getPoint(THREE.MathUtils.smoothstep(elapsed, forestArrival, 9.75)).toArray()
        : v === 'book'
          ? mobile
            ? bloom && !reduced && clock.elapsedTime - started.current < 7.6
              ? [-0.5, 4.3, 8.5]
              : [0, 5.1, 1.7]
            : bloom && !reduced && clock.elapsedTime - started.current < 7.6
              ? [-0.5, 4.3, 5.6]
              : [-0.55, 4.5, 2.2]
          : v === 'hub'
            ? [0, 3.6, 7.2]
            : v === 'gallery'
              ? journey.inspected === null
                ? [0, 2.2, mobile ? 6.8 : 5.2]
                : [(index - 1) * 2.8, 2.1, mobile ? 0.8 : -0.1]
              : [heroCamera.x + drift + heroPosition.current.x * 0.1, heroCamera.y, heroCamera.z];
    const target =
      v === 'book'
        ? [mobile ? 0 : -0.55, 1.6, 0.55]
        : v === 'hub'
          ? [0.2, 2.1, 0]
          : v === 'gallery'
            ? [journey.inspected === null ? 0 : (index - 1) * 2.8, 2.1, -3.5]
            : v === 'intro'
              ? [
                  0.05,
                  THREE.MathUtils.lerp(
                    2.18,
                    mobile ? 1.42 : 1.29,
                    THREE.MathUtils.smoothstep(elapsed, forestArrival, 9.75),
                  ),
                  2.65,
                ]
              : [heroPosition.current.x * 0.12, mobile ? 1.42 : 1.28, 2.65];
    const alpha = reduced || camera.position.x > 50 ? 1 : 1 - Math.exp(-3 * Math.min(dt, 0.5));
    destination.set(pos[0], pos[1], pos[2]);
    aim.set(target[0], target[1], target[2]);
    camera.position.lerp(destination, alpha);
    look.current.lerp(aim, alpha);
    camera.lookAt(look.current);
    if (controls.current) controls.current.target.copy(look.current);
    if (movable && journey.inspected === null && camera.position.distanceTo(destination) < 0.03) {
      transition.current = false;
      if (controls.current) controls.current.enabled = true;
    } else if (controls.current) controls.current.enabled = false;
  }, -3);
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
function Runtime({
  reduced,
  paused,
  failed,
}: {
  reduced: boolean;
  paused: boolean;
  failed: () => void;
}) {
  const { gl, camera, setFrameloop, invalidate } = useThree();
  const frames = useRef(0);
  useFrame(() => {
    if (frames.current < 3) invalidate();
    gl.domElement.setAttribute(
      'data-camera',
      camera.position
        .toArray()
        .map((n) => n.toFixed(3))
        .join(','),
    );
    gl.domElement.setAttribute('data-draw-calls', String(gl.info.render.calls));
    gl.domElement.setAttribute('data-triangles', String(gl.info.render.triangles));
    gl.domElement.setAttribute('data-frames', String(++frames.current));
  });
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
  reading = null,
  bloom = false,
  spell = null,
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
  inspect: (i: number, at?: [number, number, number]) => void;
  enterRealm: (realm: RealmId) => void;
  ready: () => void;
  failed: () => void;
  reading?: Reading;
  bloom?: boolean;
  spell?: CastTarget | null;
}) {
  const [mobile, setMobile] = useState(false);
  const [resolution, setResolution] = useState(1);
  const heroPosition = useRef(new THREE.Vector3(0, 0, 3.2));
  const introTimeRef = useRef(0);
  const landing = journey.view === 'studio' || journey.view === 'intro';
  const film = journey.view === 'gallery' && realm === 'motion';
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
      dpr={low || mobile ? (reduced || Boolean(reading) ? 1 : resolution) : [1, 1.5]}
      camera={{ position: [-8, 2.3, 18], fov: 43, near: 0.1, far: 90 }}
      gl={{ antialias: !low, powerPreference: 'low-power' }}
      onCreated={ready}
      fallback={null}
    >
      <Runtime reduced={reduced} paused={paused} failed={failed} />
      {!reduced && (
        <PerformanceMonitor
          ms={500}
          iterations={4}
          bounds={() => [low ? 18 : 28, 58]}
          onDecline={() => {
            if (low) setResolution((value) => Math.max(0.6, value - 0.2));
            else downgrade();
          }}
        />
      )}
      <color attach="background" args={['#112c2c']} />
      <fog attach="fog" args={['#183937', 14, 42]} />
      <ambientLight intensity={film ? 0.06 : 0.24} color="#94b3ad" />
      <hemisphereLight args={['#a9c8da', '#836149', film ? 0.2 : 0.86]} />
      <directionalLight position={[-5, 9, -4]} intensity={film ? 0.2 : 2.0} color="#a2c8f0" />
      <directionalLight
        position={[3, 8, 5]}
        intensity={film ? 0.1 : 1.65}
        color="#ffe2aa"
        castShadow={!low && !mobile}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-normalBias={0.04}
      />
      <pointLight
        position={[0, 3.5, -1.5]}
        color="#ffcc8b"
        intensity={film ? 0 : 38}
        distance={10}
        decay={2}
      />
      <pointLight position={[1.2, 2, 0]} color="#ffd190" intensity={5} distance={4} decay={2} />
      {landing && (
        <>
          <pointLight position={[-1.3, 2.75, 4.8]} color="#f5c28e" intensity={9} distance={5} />
          <pointLight position={[1.55, 2.3, 2.4]} color="#9ed1e8" intensity={5} distance={3.3} />
          <Hero
            active={journey.view === 'studio'}
            paused={paused}
            mobile={mobile}
            reduced={reduced}
            state={mascot}
            wave={() => setMascot('wave')}
            position={heroPosition}
          />
        </>
      )}
      {journey.view === 'intro' && !reduced && (
        <Clockwork time={introTimeRef} low={low || mobile} />
      )}
      {spell && <WandFlight key={spell.id} cast={spell} heroPosition={heroPosition} />}
      <Suspense fallback={null}>
        {landing ? (
          <WoodlandLanding reduced={reduced} low={low || mobile} />
        ) : (
          <Forest reduced={reduced} low={low || mobile} />
        )}
        <Atmosphere reduced={reduced} low={low || mobile} />
        {!landing &&
          (journey.view === 'gallery' ? (
            <Realms
              realm={realm}
              inspect={inspect}
              inspected={journey.inspected}
              reduced={reduced}
            />
          ) : (
            <Studio
              journey={journey}
              reduced={reduced}
              openBook={openBook}
              mascot={mascot}
              setMascot={setMascot}
              enterRealm={enterRealm}
              reading={reading}
              bloom={bloom}
            />
          ))}
      </Suspense>
      <CameraRig
        journey={journey}
        reduced={reduced || Boolean(reading)}
        mobile={mobile}
        bloom={bloom}
        heroPosition={heroPosition}
        introTimeRef={introTimeRef}
      />
    </Canvas>
  );
}
