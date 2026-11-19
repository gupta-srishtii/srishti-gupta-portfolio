'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';

export type CastTarget = {
  at: [number, number, number];
  scene: 'studio' | 'book' | 'gallery';
  id: number;
};

const sparks = Array.from({ length: 13 }, (_, i) => ({
  angle: i * 2.39996,
  radius: 0.12 + (i % 4) * 0.09,
  lift: ((i % 3) - 1) * 0.27,
}));

export default function WandFlight({
  cast,
  heroPosition,
}: {
  cast: CastTarget;
  heroPosition: RefObject<THREE.Vector3>;
}) {
  const flight = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Group>(null);
  const age = useRef(0);
  const start = useRef(new THREE.Vector3());
  const ray = useRef(new THREE.Vector3());
  const along = useRef(new THREE.Vector3(0, 1, 0));
  const target = useMemo(() => new THREE.Vector3(...cast.at), [cast.at]);
  useFrame(({ camera }, dt) => {
    age.current += Math.min(dt, 0.07);
    if (flight.current) {
      if (cast.scene === 'studio') {
        start.current.copy(heroPosition.current);
        start.current.x += 0.48;
        start.current.y += 1.27;
        start.current.z += 0.42;
      } else {
        start.current.set(0.5, -0.41, -1.18).applyMatrix4(camera.matrixWorld);
      }
      ray.current.copy(target).sub(start.current);
      const progress = THREE.MathUtils.smoothstep(age.current, 0.035, 0.28);
      flight.current.quaternion.setFromUnitVectors(along.current, ray.current.normalize());
      const length = start.current.distanceTo(target);
      flight.current.position.copy(start.current).lerp(target, progress * 0.5);
      flight.current.scale.set(1, Math.max(0.001, progress * length), 1);
      flight.current.visible = age.current < 0.3;
    }
    if (flash.current) {
      const pulse = THREE.MathUtils.smoothstep(age.current, 0.2, 0.38);
      flash.current.scale.setScalar(Math.max(0.001, pulse));
      flash.current.rotation.z = pulse * 0.42;
    }
  });
  return (
    <>
      <group ref={flight}>
        <mesh>
          <cylinderGeometry args={[0.009, 0.024, 1, 8]} />
          <meshBasicMaterial color="#fff0ac" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.031, 0.058, 1, 8]} />
          <meshBasicMaterial color="#ffb65d" transparent opacity={0.31} depthWrite={false} />
        </mesh>
      </group>
      <group position={cast.at} ref={flash}>
        <mesh>
          <ringGeometry args={[0.28, 0.291, 40]} />
          <meshBasicMaterial color="#ffe1a3" side={THREE.DoubleSide} transparent opacity={0.82} />
        </mesh>
        {sparks.map(({ angle, radius, lift }, i) => (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, lift]}>
            <octahedronGeometry args={[i % 3 === 0 ? 0.037 : 0.021]} />
            <meshBasicMaterial color={i % 2 ? '#f4cd83' : '#f9f1cf'} />
          </mesh>
        ))}
        <pointLight color="#ffbc65" intensity={2} distance={1.7} />
      </group>
    </>
  );
}
