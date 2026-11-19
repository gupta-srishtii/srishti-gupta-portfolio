'use client';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MascotState } from '@/data/portfolio';
import { palette } from './Objects';
/** Procedural blocking model, not a final portrait or rigged likeness. */
export default function Mascot({
  state,
  reduced,
  hero = false,
  walkDistanceRef,
}: {
  state: MascotState;
  reduced: boolean;
  hero?: boolean;
  walkDistanceRef?: RefObject<number>;
}) {
  const root = useRef<THREE.Group>(null),
    arm = useRef<THREE.Group>(null),
    head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightElbow = useRef<THREE.Group>(null);
  const hair = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const pupils = useRef<(THREE.Mesh | null)[]>([]);
  const hips = useRef<(THREE.Group | null)[]>([]);
  const knees = useRef<(THREE.Group | null)[]>([]);
  const skirtPose = useRef<THREE.Group>(null);
  const stride = useRef(0);
  const drape = useMemo(() => {
    const g = new THREE.BufferGeometry(),
      vertices: number[] = [],
      indices: number[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20,
        x = (-0.18 + t * 0.36 + Math.sin(t * 5) * 0.025) * (hero ? -1 : 1),
        y = 1.5 - t * 0.95,
        z = 0.15 + t * 0.16 + Math.sin(t * 6) * 0.025,
        w = 0.07 + Math.sin(t * Math.PI) * 0.025;
      vertices.push(x - w, y, z, x + w, y, z + 0.015);
      if (i < 20) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, [hero]);
  const trim = useMemo(() => {
    const positions = drape.getAttribute('position');
    const edge = new THREE.CatmullRomCurve3(
      Array.from({ length: 21 }, (_, i) =>
        new THREE.Vector3().fromBufferAttribute(positions, i * 2 + 1),
      ),
    );
    return new THREE.TubeGeometry(edge, 28, 0.005, 5);
  }, [drape]);
  useEffect(
    () => () => {
      drape.dispose();
      trim.dispose();
    },
    [drape, trim],
  );
  const curls = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2,
          front = Math.cos(a) > 0.6,
          length = front ? 0.14 : 0.48 + (i % 4) * 0.045;
        const curve = new THREE.CatmullRomCurve3(
          Array.from({ length: 35 }, (_, j) => {
            const t = j / 34,
              spiral = t * Math.PI * 2 * (front ? 1.3 : 3.5);
            return new THREE.Vector3(
              Math.sin(a) * 0.18 + Math.cos(spiral) * 0.022 + Math.sin(a) * t * 0.07,
              0.14 - t * length,
              Math.cos(a) * 0.14 + Math.sin(spiral) * 0.023 - (front ? 0 : t * 0.03),
            );
          }),
        );
        return new THREE.TubeGeometry(curve, 36, 0.019, 5, false);
      }),
    [],
  );
  useEffect(
    () => () => {
      curls.forEach((g) => g.dispose());
    },
    [curls],
  );
  const skirt = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.16, 0.46, 1.12, 48, 6);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        z = positions.getZ(i),
        y = positions.getY(i);
      const fold = 1 + Math.sin(Math.atan2(z, x) * 12) * (0.025 + (0.56 - y) * 0.035);
      positions.setXYZ(i, x * fold, y, z * fold);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => skirt.dispose(), [skirt]);
  useFrame(({ clock, pointer, invalidate }, dt) => {
    const t = reduced ? 0 : clock.elapsedTime;
    const walking = hero && (state === 'walk' || state === 'run');
    const phase = walkDistanceRef ? (walkDistanceRef.current / 0.92) * Math.PI * 2 : t * 6;
    const gait = (stride.current = THREE.MathUtils.damp(
      stride.current,
      walking ? (reduced ? 0.62 : 1) : 0,
      12,
      dt,
    ));
    if (reduced && !walking && gait > 0.01) invalidate();
    if (hero) {
      for (let i = 0; i < 2; i++) {
        const step = phase + i * Math.PI;
        const thigh = hips.current[i];
        const shin = knees.current[i];
        if (thigh) thigh.rotation.x = Math.sin(step) * 0.47 * gait;
        if (shin) shin.rotation.x = Math.max(0, -Math.cos(step)) * 0.38 * gait;
      }
      if (skirtPose.current) {
        skirtPose.current.scale.y = 1 - gait * 0.19;
        skirtPose.current.rotation.x = Math.sin(phase) * 0.055 * gait;
      }
      if (leftArm.current) leftArm.current.rotation.x = Math.sin(phase) * 0.46 * gait;
      if (arm.current) arm.current.rotation.x = -Math.sin(phase) * 0.46 * gait;
    }
    if (root.current) {
      root.current.position.y =
        state === 'sit'
          ? -0.25
          : state === 'celebrate'
            ? Math.abs(Math.sin(t * 5)) * 0.14
            : Math.sin(t * 1.5) * 0.012 * (1 - gait) + Math.abs(Math.sin(phase)) * 0.027 * gait;
      root.current.position.x =
        !hero && (state === 'walk' || state === 'run') ? Math.sin(t * 0.8) * 0.5 : 0;
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        state === 'turn' ? 1.7 : hero ? 0 : 0.2,
        4,
        dt,
      );
      root.current.rotation.z = 0.025 * (Math.sin(t * 1.2) * (1 - gait) + Math.sin(phase) * gait);
      if (hero) root.current.rotation.x = gait * 0.039;
    }
    if (head.current) {
      head.current.rotation.y = reduced
        ? 0
        : THREE.MathUtils.damp(
            head.current.rotation.y,
            pointer.x * 0.28 + Math.sin(t * 0.8) * 0.07,
            4,
            dt,
          );
      head.current.rotation.x = reduced
        ? 0
        : THREE.MathUtils.damp(
            head.current.rotation.x,
            -pointer.y * 0.1 + (state === 'interact' ? 0.13 : 0),
            5,
            dt,
          );
      head.current.rotation.z = reduced ? 0 : Math.sin(t * 1.3) * 0.035;
    }
    if (hair.current) hair.current.rotation.z = Math.sin(t * 1.3 - 0.5) * (reduced ? 0 : 0.022);
    if (rightElbow.current) {
      rightElbow.current.rotation.z = THREE.MathUtils.damp(
        rightElbow.current.rotation.z,
        state === 'wave' ? -1.04 + Math.sin(t * 8) * (reduced ? 0 : 0.31) : -0.1,
        7,
        dt,
      );
    }
    if (eyes.current) {
      const blink = t % 4.6;
      eyes.current.scale.y = reduced
        ? 1
        : blink > 4.3
          ? Math.max(0.08, Math.abs(blink - 4.45) / 0.15)
          : 1;
    }
    pupils.current.forEach((pupil, i) => {
      if (pupil)
        pupil.position.set(
          (i === 0 ? -0.073 : 0.073) + (reduced ? 0 : pointer.x * 0.007),
          0.02 + (reduced ? 0 : pointer.y * 0.004),
          0.173,
        );
    });
    if (root.current) root.current.scale.y = 1 + Math.sin(t * 1.8) * 0.004;
    if (leftArm.current)
      leftArm.current.rotation.z = THREE.MathUtils.damp(
        leftArm.current.rotation.z,
        state === 'celebrate'
          ? 2.5
          : state === 'interact'
            ? 0.6
            : state === 'walk' || state === 'run'
              ? hero
                ? 0.14
                : -Math.sin(t * (state === 'run' ? 12 : 6)) * 0.5
              : 0.12,
        5,
        dt,
      );
    if (arm.current)
      arm.current.rotation.z = THREE.MathUtils.damp(
        arm.current.rotation.z,
        state === 'wave'
          ? -1.44 + Math.sin(t * 4) * 0.12
          : state === 'interact'
            ? -1.2
            : state === 'celebrate'
              ? -2.7
              : state === 'walk' || state === 'run'
                ? hero
                  ? -0.14
                  : Math.sin(t * (state === 'run' ? 12 : 6)) * 0.5
                : -0.12,
        5,
        dt,
      );
  });
  return (
    <group position={hero ? [0, 0, 0] : [-1.83, 0.02, 0.92]} scale={hero ? 1.13 : 1.08}>
      <group ref={root}>
        {hero &&
          [-1, 1].map((side, i) => (
            <group
              key={side}
              ref={(node) => {
                hips.current[i] = node;
              }}
              position={[side * 0.145, 0.83, 0]}
            >
              <mesh position-y={-0.19}>
                <capsuleGeometry args={[0.066, 0.27, 4, 10]} />
                <meshStandardMaterial color="#7b293b" roughness={0.9} />
              </mesh>
              <group
                ref={(node) => {
                  knees.current[i] = node;
                }}
                position-y={-0.39}
              >
                <mesh position-y={-0.17}>
                  <capsuleGeometry args={[0.052, 0.25, 4, 10]} />
                  <meshStandardMaterial color="#9e694b" roughness={0.82} />
                </mesh>
                <mesh position={[0, -0.388, 0.055]} scale={[0.069, 0.045, 0.132]}>
                  <sphereGeometry args={[1, 12, 8]} />
                  <meshStandardMaterial color="#301f24" roughness={0.8} />
                </mesh>
              </group>
            </group>
          ))}
        <group ref={skirtPose} position-y={1.19}>
          <mesh position-y={-0.56} geometry={skirt} castShadow>
            <meshStandardMaterial color={palette.burgundy} roughness={0.92} />
          </mesh>
          <mesh position-y={-1.1} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.45, 0.009, 6, 48]} />
            <meshStandardMaterial color={palette.gold} />
          </mesh>
        </group>
        <mesh position-y={1.32} scale={[0.24, 0.32, 0.14]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={palette.burgundy} />
        </mesh>
        <mesh geometry={drape}>
          <meshStandardMaterial color="#864251" roughness={0.86} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={trim}>
          <meshStandardMaterial color="#d8aa69" roughness={0.59} metalness={0.24} />
        </mesh>
        <mesh position-y={1.64}>
          <cylinderGeometry args={[0.07, 0.08, 0.15, 12]} />
          <meshStandardMaterial color="#ad7958" />
        </mesh>
        <group ref={head} position={[0, 1.86, 0]} scale={0.86}>
          <mesh scale={[0.183, 0.227, 0.178]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial color="#b78463" />
          </mesh>
          <group ref={eyes}>
            {[-1, 1].map((s, i) => (
              <group key={s}>
                <mesh
                  position={[s * 0.076, 0.055, 0.162]}
                  rotation-z={s * -0.11}
                  scale={[0.039, 0.0055, 0.008]}
                >
                  <sphereGeometry args={[1, 12, 8]} />
                  <meshStandardMaterial color="#30221f" />
                </mesh>
                <mesh
                  position={[s * 0.076, 0.021, 0.158]}
                  rotation-z={s * 0.12}
                  scale={[0.043, 0.021, 0.016]}
                >
                  <sphereGeometry args={[1, 14, 10]} />
                  <meshStandardMaterial color="#372624" />
                </mesh>
                <mesh position={[s * 0.073, 0.02, 0.159]} scale={[0.037, 0.018, 0.015]}>
                  <sphereGeometry args={[1, 10, 8]} />
                  <meshStandardMaterial color="#d5c3a4" />
                </mesh>
                <mesh
                  ref={(node) => {
                    pupils.current[i] = node;
                  }}
                  position={[s * 0.073, 0.02, 0.173]}
                  scale={[0.013, 0.016, 0.008]}
                >
                  <sphereGeometry args={[1, 12, 8]} />
                  <meshStandardMaterial color="#30231e" />
                </mesh>
              </group>
            ))}
          </group>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.185, -0.11, 0.015]}>
              <latheGeometry
                args={[
                  [
                    new THREE.Vector2(0.008, 0),
                    new THREE.Vector2(0.029, 0.006),
                    new THREE.Vector2(0.015, 0.03),
                    new THREE.Vector2(0.008, 0.05),
                  ],
                  12,
                ]}
              />
              <meshStandardMaterial color={palette.gold} metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
          <mesh position={[0, -0.095, 0.168]} scale={[0.045, 0.012, 0.01]}>
            <sphereGeometry args={[1, 10, 6]} />
            <meshStandardMaterial color="#8c3b3a" />
          </mesh>
          <mesh position={[0, -0.025, 0.183]} scale={[0.025, 0.045, 0.025]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#ad7958" />
          </mesh>
          <mesh position={[0, 0.085, 0.172]}>
            <sphereGeometry args={[0.01, 8, 6]} />
            <meshStandardMaterial color={palette.burgundy} />
          </mesh>
          <mesh position={[0, 0.06, -0.02]} scale={[1, 1.15, 1]}>
            <sphereGeometry args={[0.197, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
            <meshStandardMaterial color="#241d1b" roughness={1} />
          </mesh>
          <group ref={hair}>
            {curls.map((g, i) => (
              <mesh key={i} geometry={g}>
                <meshStandardMaterial color={i % 3 ? '#271e1c' : '#41302a'} roughness={0.58} />
              </mesh>
            ))}
          </group>
        </group>
        {[-1, 1].map((s) => (
          <group
            key={s}
            ref={s === 1 ? arm : leftArm}
            position={[s * 0.24, 1.47, 0]}
            rotation-z={s * 0.12}
          >
            <mesh position-y={-0.14}>
              <capsuleGeometry args={[0.052, 0.2, 4, 10]} />
              <meshStandardMaterial color="#b78463" />
            </mesh>
            <group
              ref={s === 1 ? rightElbow : undefined}
              position={[0, -0.29, 0]}
              rotation-x={-0.24}
            >
              <mesh position-y={-0.1}>
                <capsuleGeometry args={[0.043, 0.16, 4, 10]} />
                <meshStandardMaterial color="#b78463" />
              </mesh>
              <mesh position-y={-0.24} scale={[0.045, 0.065, 0.025]}>
                <sphereGeometry args={[1, 10, 8]} />
                <meshStandardMaterial color="#b78463" />
              </mesh>
              {[0, 1, 2].map((i) => (
                <mesh key={i} position-y={-0.17 + i * 0.018} rotation-x={Math.PI / 2}>
                  <torusGeometry args={[0.047, 0.006, 6, 12]} />
                  <meshStandardMaterial color={palette.gold} metalness={0.6} roughness={0.35} />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
