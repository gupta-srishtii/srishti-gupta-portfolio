'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import type { PortfolioEntry } from '@/data/portfolio';
import { ExhibitLabel } from './ExhibitionArchitecture';

const center = new THREE.Vector3(0, 2.16, -3.01);
const orbitRotations = [
  new THREE.Euler(0.22, 0.37, -0.32),
  new THREE.Euler(0.81, -0.66, 0.64),
  new THREE.Euler(-0.69, 0.5, -0.79),
];

function Electron({
  index,
  entry,
  inspected,
  charging,
  compact,
  reduced,
  inspect,
}: {
  index: number;
  entry: PortfolioEntry | null;
  inspected: number | null;
  charging?: number;
  compact: boolean;
  reduced: boolean;
  inspect: (index: number, point: THREE.Vector3) => void;
}) {
  const node = useRef<THREE.Group>(null);
  const item = useRef<THREE.Mesh>(null);
  const [aimed, setAimed] = useState(false);
  const orbitPoint = useRef(new THREE.Vector3());
  const visible = inspected === null || inspected === index;
  useCursor(aimed && visible);
  useFrame(({ clock }, delta) => {
    if (!node.current || (charging === index && inspected === null)) return;
    const phase =
      (index * Math.PI * 2) / 3 + (reduced ? 0 : clock.elapsedTime * (0.19 + index * 0.02));
    const position = orbitPoint.current
      .set(Math.cos(phase) * 2.75, Math.sin(phase) * 1.1, 0)
      .applyEuler(orbitRotations[index])
      .add(center);
    if (compact) position.x *= 0.48;
    const focused = inspected === index;
    const dt = reduced ? 1 : delta;
    node.current.position.set(
      THREE.MathUtils.damp(
        node.current.position.x,
        focused ? (index - 1) * 2.8 : position.x,
        6,
        dt,
      ),
      THREE.MathUtils.damp(node.current.position.y, focused ? 2.08 : position.y, 6, dt),
      THREE.MathUtils.damp(node.current.position.z, focused ? -2.65 : position.z, 6, dt),
    );
    node.current.scale.setScalar(
      THREE.MathUtils.damp(node.current.scale.x, focused ? 1.6 : compact ? 0.66 : 1, 6, dt),
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
        {entry ? (
          <dodecahedronGeometry args={[0.46, 0]} />
        ) : (
          <sphereGeometry args={[0.29, 18, 12]} />
        )}
        <meshStandardMaterial
          color={entry ? '#b6dbcb' : '#68767f'}
          metalness={0.46}
          roughness={0.32}
          emissive={entry ? '#63a79b' : '#435568'}
          emissiveIntensity={aimed ? 1.35 : entry ? 0.72 : 0.23}
        />
      </mesh>
      {inspected === null && (
        <ExhibitLabel
          position={[0, -0.66, 0.18]}
          title={entry?.title ?? 'Open orbit'}
          status={entry ? 'VERIFIED REPOSITORY' : 'AWAITING A VERIFIED PROJECT'}
        />
      )}
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
  charging,
  compact,
  reduced,
  inspect,
}: {
  slots: (PortfolioEntry | null)[];
  inspected: number | null;
  charging?: number;
  compact: boolean;
  reduced: boolean;
  inspect: (index: number, point: THREE.Vector3) => void;
}) {
  const nucleus = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (nucleus.current && !reduced) nucleus.current.rotation.y = clock.elapsedTime * 0.21;
  });
  return (
    <group>
      <group position={center} visible={inspected === null}>
        <group ref={nucleus}>
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
        </group>
        <group scale-x={compact ? 0.48 : 1}>
          {orbitRotations.map((angle, i) => (
            <mesh key={i} rotation={angle} scale={[1, 0.4, 1]}>
              <torusGeometry args={[2.75, 0.015, 7, 100]} />
              <meshBasicMaterial color={i % 2 ? '#eacc84' : '#a7c9cb'} transparent opacity={0.63} />
            </mesh>
          ))}
        </group>
        <pointLight color="#b8e5d3" intensity={7} distance={6} />
      </group>
      {slots.map((entry, i) => (
        <Electron
          key={entry?.id ?? i}
          entry={entry}
          index={i}
          inspected={inspected}
          charging={charging}
          compact={compact}
          reduced={reduced}
          inspect={inspect}
        />
      ))}
    </group>
  );
}
