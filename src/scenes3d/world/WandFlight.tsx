'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';

export type CastTarget = {
  at: [number, number, number];
  scene: 'studio' | 'book' | 'gallery';
  id: number;
  exhibit?: number;
};

const palette = ['#fff0ba', '#f6be65', '#e38562'];
const dust = Array.from({ length: 20 }, (_, i) => {
  const a = i * 2.399963;
  return new THREE.Vector3(Math.cos(a), Math.sin(a), ((i % 5) - 2) * 0.22).multiplyScalar(
    0.27 + (i % 5) * 0.093,
  );
});

export default function WandFlight({
  cast,
  heroPosition,
}: {
  cast: CastTarget;
  heroPosition: RefObject<THREE.Vector3>;
}) {
  const tip = useRef<THREE.PointLight>(null);
  const trail = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const age = useRef(0);
  const start = useRef(new THREE.Vector3());
  const target = useMemo(() => new THREE.Vector3(...cast.at), [cast.at]);
  useFrame(({ camera }, dt) => {
    const t = (age.current += dt);
    const { smoothstep } = THREE.MathUtils;
    if (cast.scene === 'studio') {
      start.current.set(heroPosition.current.x + 0.48, 1.27, heroPosition.current.z + 0.42);
    } else {
      start.current.set(0.5, -0.42, -1.25).applyMatrix4(camera.matrixWorld);
    }
    if (tip.current) {
      tip.current.position.copy(start.current);
      tip.current.intensity = (1 - smoothstep(t, 0.08, 0.23)) * smoothstep(t, 0, 0.06) * 2.2;
    }
    if (trail.current) {
      trail.current.visible = t > 0.075 && t < 0.5;
      trail.current.children.forEach((orb, index) => {
        const progress = smoothstep(t - index * 0.011, 0.082, 0.34);
        const arc = Math.sin(progress * Math.PI);
        orb.position.copy(start.current).lerp(target, progress);
        orb.position.y += 0.63 * arc + Math.sin(progress * 15 + index * 0.31) * arc * 0.075;
        orb.position.x += Math.sin(progress * 13 + index * 0.23) * arc * 0.14;
        orb.scale.setScalar((1 - index * 0.052) * (1 - smoothstep(t, 0.38, 0.5)));
      });
    }
    if (flash.current) {
      const bloom = smoothstep(t, 0.31, 0.57);
      flash.current.visible = t >= 0.31;
      flash.current.children.forEach((spark, i) => {
        spark.position.copy(dust[i]).multiplyScalar(bloom);
        spark.scale.setScalar((1 - smoothstep(t, 0.44, 0.62)) * (0.53 + bloom * 0.47));
      });
    }
    if (halo.current) {
      halo.current.visible = t >= 0.31;
      halo.current.scale.setScalar(0.16 + smoothstep(t, 0.31, 0.62) * 1.18);
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        0.87 * (1 - smoothstep(t, 0.36, 0.62));
    }
  });
  return (
    <>
      <pointLight ref={tip} color="#ffb660" distance={1.7} intensity={0} />
      <group ref={trail}>
        {Array.from({ length: 17 }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[i === 0 ? 0.056 : 0.043, 8, 6]} />
            <meshBasicMaterial
              color={palette[i % 3]}
              transparent
              opacity={1 - i * 0.033}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group position={cast.at}>
        <mesh ref={halo}>
          <ringGeometry args={[0.46, 0.49, 48]} />
          <meshBasicMaterial
            color="#ffe2a4"
            side={THREE.DoubleSide}
            transparent
            depthWrite={false}
            opacity={0}
          />
        </mesh>
        <group ref={flash}>
          {dust.map((_, i) => (
            <mesh key={i}>
              <octahedronGeometry args={[i % 3 === 0 ? 0.029 : 0.018]} />
              <meshBasicMaterial color={palette[i % 3]} />
            </mesh>
          ))}
        </group>
      </group>
    </>
  );
}
