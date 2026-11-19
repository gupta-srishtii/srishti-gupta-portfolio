'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import type { PortfolioEntry } from '@/data/portfolio';

function Electron({
  index,
  entry,
  inspected,
  reduced,
  inspect,
}: {
  index: number;
  entry: PortfolioEntry | null;
  inspected: number | null;
  reduced: boolean;
  inspect: (index: number, point: THREE.Vector3) => void;
}) {
  const node = useRef<THREE.Group>(null);
  const item = useRef<THREE.Mesh>(null);
  const [aimed, setAimed] = useState(false);
  const visible = inspected === null || inspected === index;
  useCursor(aimed && visible);
  useFrame(({ clock }, delta) => {
    if (!node.current) return;
    const phase = (index * Math.PI * 2) / 3 + (reduced ? 0 : clock.elapsedTime * 0.18);
    const focused = inspected === index;
    const dt = reduced ? 1 : delta;
    node.current.position.set(
      THREE.MathUtils.damp(
        node.current.position.x,
        focused ? (index - 1) * 2.8 : Math.sin(phase) * 2.9,
        6,
        dt,
      ),
      THREE.MathUtils.damp(
        node.current.position.y,
        focused ? 2.08 : 2.15 + Math.cos(phase * 2 - index) * 0.65,
        6,
        dt,
      ),
      THREE.MathUtils.damp(
        node.current.position.z,
        focused ? -3.25 : -2.9 + Math.cos(phase) * 1.05,
        6,
        dt,
      ),
    );
    node.current.scale.setScalar(
      THREE.MathUtils.damp(node.current.scale.x, focused ? 1.6 : 1, 6, dt),
    );
    if (item.current && !reduced) item.current.rotation.y = clock.elapsedTime * 0.42;
  });
  return (
    <group
      ref={node}
      visible={visible}
      position={[(index - 1) * 2.8, 2.1, -3]}
      onPointerOver={
        visible
          ? (event) => {
              event.stopPropagation();
              setAimed(true);
            }
          : undefined
      }
      onPointerOut={() => setAimed(false)}
      onClick={
        visible
          ? (e) => {
              e.stopPropagation();
              if (node.current) inspect(index, node.current.getWorldPosition(new THREE.Vector3()));
            }
          : undefined
      }
    >
      <mesh>
        <sphereGeometry args={[0.41, 20, 12]} />
        <meshStandardMaterial
          color={entry ? '#b6dbcb' : '#68767f'}
          metalness={0.46}
          roughness={0.32}
          emissive={entry ? '#63a79b' : '#435568'}
          emissiveIntensity={aimed ? 1.35 : entry ? 0.72 : 0.23}
        />
      </mesh>
      <mesh ref={item} rotation-x={Math.PI * 0.25}>
        <torusGeometry args={[0.56, 0.022, 8, 48]} />
        <meshBasicMaterial color={entry ? '#f5d592' : '#7e99ab'} />
      </mesh>
    </group>
  );
}

export default function ProjectAtom({
  slots,
  inspected,
  reduced,
  inspect,
}: {
  slots: (PortfolioEntry | null)[];
  inspected: number | null;
  reduced: boolean;
  inspect: (index: number, point: THREE.Vector3) => void;
}) {
  const nucleus = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (nucleus.current && !reduced) nucleus.current.rotation.y = clock.elapsedTime * 0.21;
  });
  return (
    <group>
      <group position={[0, 2.05, -3.02]} ref={nucleus} visible={inspected === null}>
        <mesh>
          <icosahedronGeometry args={[0.72, 2]} />
          <meshStandardMaterial
            color="#526f79"
            metalness={0.7}
            roughness={0.3}
            emissive="#246262"
            emissiveIntensity={0.46}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.76, 2]} />
          <meshBasicMaterial wireframe color="#a3c4af" transparent opacity={0.34} />
        </mesh>
        {[-0.68, 0.17, 0.86].map((angle, i) => (
          <mesh key={angle} rotation={[Math.PI * 0.5 + angle, i * 0.58, 0.5]} scale={[1, 0.61, 1]}>
            <torusGeometry args={[2.62, 0.015, 7, 100]} />
            <meshBasicMaterial color={i % 2 ? '#eacc84' : '#a7c9cb'} transparent opacity={0.63} />
          </mesh>
        ))}
        <pointLight color="#b8e5d3" intensity={7} distance={6} />
      </group>
      {slots.map((entry, i) => (
        <Electron
          key={entry?.id ?? i}
          entry={entry}
          index={i}
          inspected={inspected}
          reduced={reduced}
          inspect={inspect}
        />
      ))}
    </group>
  );
}
