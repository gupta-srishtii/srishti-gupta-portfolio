'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MascotState } from '@/data/portfolio';
import { Box, palette } from './Objects';
/** Procedural blocking model, not a final portrait or rigged likeness. */
export default function Mascot({ state, reduced }: { state: MascotState; reduced: boolean }) {
  const root = useRef<THREE.Group>(null),
    arm = useRef<THREE.Group>(null),
    head = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
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
  useFrame(({ clock, pointer }, dt) => {
    const t = reduced ? 0 : clock.elapsedTime;
    if (root.current) {
      root.current.position.y =
        state === 'sit'
          ? -0.25
          : state === 'celebrate'
            ? Math.abs(Math.sin(t * 5)) * 0.14
            : Math.sin(t * 1.5) * 0.012;
      root.current.position.x = state === 'walk' || state === 'run' ? Math.sin(t * 0.8) * 0.5 : 0;
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        state === 'turn' ? 1.7 : -0.25,
        4,
        dt,
      );
    }
    if (head.current) head.current.rotation.y = reduced ? 0 : pointer.x * 0.2;
    if (leftArm.current)
      leftArm.current.rotation.z = THREE.MathUtils.damp(
        leftArm.current.rotation.z,
        state === 'celebrate'
          ? 2.5
          : state === 'interact'
            ? 0.6
            : state === 'walk' || state === 'run'
              ? -Math.sin(t * (state === 'run' ? 12 : 6)) * 0.5
              : 0.12,
        5,
        dt,
      );
    if (arm.current)
      arm.current.rotation.z = THREE.MathUtils.damp(
        arm.current.rotation.z,
        state === 'wave'
          ? -2.3 + Math.sin(t * 7) * 0.25
          : state === 'interact'
            ? -1.2
            : state === 'celebrate'
              ? -2.7
              : state === 'walk' || state === 'run'
                ? Math.sin(t * (state === 'run' ? 12 : 6)) * 0.5
                : -0.12,
        5,
        dt,
      );
  });
  return (
    <group position={[-2.05, 0.16, 0.5]} scale={0.95}>
      <group ref={root}>
        <mesh position-y={0.63} geometry={skirt} castShadow>
          <meshStandardMaterial color={palette.burgundy} roughness={0.92} />
        </mesh>
        <mesh position-y={0.09} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.45, 0.009, 6, 48]} />
          <meshStandardMaterial color={palette.gold} />
        </mesh>
        <mesh position-y={1.32} scale={[0.24, 0.32, 0.14]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color={palette.burgundy} />
        </mesh>
        <Box
          size={[0.14, 0.68, 0.03]}
          position={[-0.1, 1.13, 0.15]}
          rotation-z={-0.3}
          color="#a25460"
        />
        <Box
          size={[0.008, 0.68, 0.035]}
          position={[-0.17, 1.11, 0.15]}
          rotation-z={-0.3}
          color={palette.gold}
        />
        <mesh position-y={1.64}>
          <cylinderGeometry args={[0.07, 0.08, 0.15, 12]} />
          <meshStandardMaterial color="#ad7958" />
        </mesh>
        <group ref={head} position={[0, 1.86, 0]}>
          <mesh scale={[0.185, 0.24, 0.18]}>
            <sphereGeometry args={[1, 20, 16]} />
            <meshStandardMaterial color="#b78463" />
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s}>
              <mesh position={[s * 0.073, 0.02, 0.159]} scale={[0.037, 0.018, 0.015]}>
                <sphereGeometry args={[1, 10, 8]} />
                <meshStandardMaterial color="#29221e" />
              </mesh>
              <mesh position={[s * 0.18, -0.1, 0.015]}>
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshStandardMaterial color={palette.gold} metalness={0.7} roughness={0.4} />
              </mesh>
            </group>
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
          {Array.from({ length: 30 }, (_, i) => {
            const a = i * 2.4;
            return (
              <mesh
                key={i}
                position={[
                  Math.sin(a) * (i < 12 ? 0.17 : 0.21),
                  i < 12 ? 0.13 + Math.cos(a) * 0.09 : 0.05 - (i - 12) * 0.024,
                  i < 12 ? Math.cos(a) * 0.13 : -0.09 + Math.cos(a) * 0.1,
                ]}
                scale={[0.07, 0.09, 0.07]}
              >
                <sphereGeometry args={[1, 8, 6]} />
                <meshStandardMaterial color="#211d1b" roughness={1} />
              </mesh>
            );
          })}
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
            <group position={[0, -0.29, 0]} rotation-x={-0.2}>
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
