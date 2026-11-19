'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Rod } from '../Objects';

export function GalleryHangers() {
  return (
    <group position={[0, 0, -3.63]}>
      {[-0.47, 0.47].map((x) => (
        <Rod key={x} from={[x, 3.03, 0]} to={[x, 3.73, 0]} color="#8e7250" radius={0.009} />
      ))}
      <Rod from={[-0.68, 3.73, 0]} to={[0.68, 3.73, 0]} color="#a68a58" radius={0.018} />
    </group>
  );
}

export function Easel() {
  return (
    <group position={[0, 0, -3.76]}>
      <Rod from={[-0.56, 0.03, 0.15]} to={[0, 3.25, 0]} radius={0.04} color="#866342" />
      <Rod from={[0.56, 0.03, 0.15]} to={[0, 3.25, 0]} radius={0.04} color="#866342" />
      <Rod from={[0, 0.04, -0.56]} to={[0, 2.6, 0]} radius={0.035} color="#745839" />
      <mesh position={[0, 1.08, 0.13]}>
        <boxGeometry args={[1.7, 0.08, 0.37]} />
        <meshStandardMaterial color="#947152" roughness={0.76} />
      </mesh>
    </group>
  );
}

export function PrototypeStation() {
  return (
    <group position={[0, 0, -3.75]}>
      <mesh position-y={0.51}>
        <cylinderGeometry args={[0.16, 0.3, 0.98, 30]} />
        <meshStandardMaterial color="#464e63" metalness={0.68} roughness={0.33} />
      </mesh>
      <mesh position-y={0.12}>
        <cylinderGeometry args={[0.56, 0.67, 0.13, 32]} />
        <meshStandardMaterial color="#80746d" metalness={0.58} />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1.81, 2.12, 0.12]} />
        <meshStandardMaterial color="#29364c" roughness={0.25} metalness={0.52} />
      </mesh>
      <mesh position={[0, 1, 0.05]}>
        <boxGeometry args={[0.42, 0.024, 0.11]} />
        <meshBasicMaterial color="#7db7c4" />
      </mesh>
    </group>
  );
}

export function ProjectorBeam({ active }: { active: boolean }) {
  return (
    <group position={[0, 2.75, -0.8]} visible={active}>
      <mesh rotation-x={Math.PI / 2}>
        <coneGeometry args={[1.7, 5.3, 36, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          vertexShader="varying vec2 p;void main(){p=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"
          fragmentShader="varying vec2 p;void main(){float fall=sin(p.y*3.14159)*.11;gl_FragColor=vec4(.67,.77,.94,fall);}"
        />
      </mesh>
    </group>
  );
}

export function PigmentHalo({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  const ring = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (!ring.current) return;
    ring.current.scale.setScalar(
      reduced ? 1 : THREE.MathUtils.damp(ring.current.scale.x, visible ? 1 : 0.001, 5, dt),
    );
    if (!reduced) ring.current.rotation.z = clock.elapsedTime * 0.27;
  });
  return (
    <group ref={ring} visible={visible}>
      {Array.from({ length: 15 }, (_, i) => {
        const a = i * 2.39996;
        const r = 0.79 + (i % 4) * 0.07;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * r, Math.cos(a) * r, (i % 4) * 0.08]}
            rotation-z={a}
            scale={[0.045, 0.12, 0.033]}
          >
            <sphereGeometry args={[1, 9, 6]} />
            <meshBasicMaterial color={['#db996d', '#d1bf85', '#80c6b8', '#ab91cf'][i % 4]} />
          </mesh>
        );
      })}
    </group>
  );
}
