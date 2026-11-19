'use client';

import * as THREE from 'three';
import { useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

export default function WorldArtifact({
  kind,
  activate,
  selected,
  reduced,
}: {
  kind: 'book' | 'keepsake' | 'film';
  activate: () => void;
  selected: boolean;
  reduced: boolean;
}) {
  const [aimed, setAimed] = useState(false);
  const hinge = useRef<THREE.Group>(null);
  const spool = useRef<THREE.Group>(null);
  const exhibit = useRef<THREE.Group>(null);
  useCursor(aimed);
  useFrame(({ clock }, delta) => {
    if (exhibit.current && kind !== 'film') {
      const lift = selected ? 0.16 : 0;
      exhibit.current.position.y = reduced
        ? lift
        : THREE.MathUtils.damp(
            exhibit.current.position.y,
            lift + Math.sin(clock.elapsedTime * 1.45) * 0.047,
            5,
            delta,
          );
    }
    if (hinge.current) {
      const angle = selected ? -1.95 : 0;
      hinge.current.rotation.y = reduced
        ? angle
        : THREE.MathUtils.damp(hinge.current.rotation.y, angle, 6, delta);
    }
    if (spool.current && selected && !reduced) spool.current.rotation.y += delta * 1.35;
  });
  return (
    <group
      ref={exhibit}
      onPointerOver={(event) => {
        event.stopPropagation();
        setAimed(true);
      }}
      onPointerOut={() => setAimed(false)}
      onClick={(event) => {
        event.stopPropagation();
        activate();
      }}
    >
      <mesh position-y={-0.61}>
        <cylinderGeometry args={[0.64, 0.77, 0.23, 28]} />
        <meshStandardMaterial color="#514f46" roughness={0.76} metalness={0.12} />
      </mesh>
      {kind === 'book' && (
        <group rotation={[-0.19, 0, -0.18]}>
          <mesh position-z={-0.079}>
            <boxGeometry args={[0.98, 1.28, 0.039]} />
            <meshStandardMaterial color={aimed ? '#94634d' : '#5a4042'} roughness={0.74} />
          </mesh>
          <mesh position={[0.04, 0, 0.006]}>
            <boxGeometry args={[0.9, 1.2, 0.152]} />
            <meshStandardMaterial color="#b99362" />
          </mesh>
          <group ref={hinge} position={[-0.485, 0, 0.1]}>
            <mesh position-x={0.485}>
              <boxGeometry args={[0.97, 1.28, 0.037]} />
              <meshStandardMaterial color={aimed ? '#a26a54' : '#623f46'} roughness={0.72} />
            </mesh>
            <mesh position={[0.485, 0, 0.021]}>
              <torusGeometry args={[0.24, 0.013, 8, 40]} />
              <meshStandardMaterial color="#d3af72" roughness={0.4} metalness={0.5} />
            </mesh>
          </group>
        </group>
      )}
      {kind === 'keepsake' && (
        <>
          <mesh>
            <cylinderGeometry args={[0.54, 0.56, 0.92, 32, 1, true]} />
            <meshStandardMaterial
              color={aimed ? '#b2d6c5' : '#79a9a6'}
              metalness={0.19}
              roughness={0.18}
              side={THREE.DoubleSide}
              transparent
              opacity={0.23}
              depthWrite={false}
            />
          </mesh>
          {[-0.48, 0.48].map((y) => (
            <mesh key={y} position-y={y} rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.55, 0.035, 8, 44]} />
              <meshStandardMaterial
                color={aimed ? '#e3bc75' : '#967a54'}
                metalness={0.6}
                roughness={0.31}
              />
            </mesh>
          ))}
          <mesh position-y={-0.36}>
            <cylinderGeometry args={[0.36, 0.39, 0.095, 28]} />
            <meshStandardMaterial color="#534447" roughness={0.76} />
          </mesh>
          {selected && (
            <pointLight position-y={0.3} intensity={2.2} distance={1.8} color="#ffd28a" />
          )}
        </>
      )}
      {kind === 'film' && (
        <group rotation-x={Math.PI / 2}>
          <group ref={spool}>
            <mesh>
              <cylinderGeometry args={[0.6, 0.6, 0.17, 48]} />
              <meshStandardMaterial
                color={aimed ? '#bda477' : '#8b8983'}
                metalness={0.66}
                roughness={0.4}
              />
            </mesh>
            <mesh position-y={0.095}>
              <cylinderGeometry args={[0.12, 0.12, 0.045, 20]} />
              <meshStandardMaterial color="#b49b69" metalness={0.61} roughness={0.38} />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i * Math.PI) / 3;
              return (
                <mesh key={i} position={[Math.cos(a) * 0.36, 0.087, Math.sin(a) * 0.36]}>
                  <cylinderGeometry args={[0.116, 0.116, 0.01, 18]} />
                  <meshStandardMaterial color="#262830" />
                </mesh>
              );
            })}
          </group>
        </group>
      )}
    </group>
  );
}
