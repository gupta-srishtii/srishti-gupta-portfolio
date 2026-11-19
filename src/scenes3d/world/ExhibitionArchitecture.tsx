'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { branch, random } from './geometry';

export function ExhibitLabel({
  title,
  status,
  position,
}: {
  title: string;
  status: string;
  position: [number, number, number];
}) {
  const plate = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 118;
    const ink = canvas.getContext('2d')!;
    ink.fillStyle = '#251f20';
    ink.fillRect(0, 0, 512, 118);
    ink.strokeStyle = '#987957';
    ink.strokeRect(7, 7, 498, 104);
    ink.textAlign = 'center';
    ink.fillStyle = '#efddba';
    ink.font = '35px Georgia';
    ink.fillText(title, 256, 52, 456);
    ink.fillStyle = '#c9af83';
    ink.font = '20px Georgia';
    ink.fillText(status, 256, 87, 455);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [title, status]);
  useEffect(() => () => plate.dispose(), [plate]);
  return (
    <mesh position={position}>
      <planeGeometry args={[1.74, 0.4]} />
      <meshBasicMaterial map={plate} toneMapped={false} />
    </mesh>
  );
}

function moulding(radius: number, floor: number, crown: number, z: number, thickness: number) {
  const points: [number, number, number][] = [
    [-radius, floor, z],
    [-radius, crown, z],
  ];
  for (let i = 1; i < 14; i++) {
    const a = Math.PI - (i * Math.PI) / 14;
    points.push([Math.cos(a) * radius, crown + Math.sin(a) * radius, z]);
  }
  points.push([radius, crown, z], [radius, floor, z]);
  return branch(points, thickness);
}

export function ExhibitionArchitecture({ greenhouse }: { greenhouse: boolean }) {
  const structures = useMemo(() => {
    if (greenhouse) return [-3.45, -1.65, 0.15, 1.95].map((z) => moulding(4.84, 0, 2.35, z, 0.075));
    return [moulding(1.1, 0.12, 2.47, 0, 0.18), moulding(1.0, 0.12, 2.47, 0.08, 0.034)];
  }, [greenhouse]);
  useEffect(() => () => structures.forEach((geometry) => geometry.dispose()), [structures]);
  if (greenhouse)
    return (
      <group>
        {structures.map((geometry, i) => (
          <mesh key={i} geometry={geometry}>
            <meshStandardMaterial color="#8aaf9c" metalness={0.58} roughness={0.41} />
          </mesh>
        ))}
        {[-4.81, 4.81].map((x) => (
          <mesh key={x} position={[x, 2, -1.05]} rotation-y={Math.PI / 2}>
            <planeGeometry args={[5.9, 4]} />
            <meshStandardMaterial
              color="#8eccc1"
              side={THREE.DoubleSide}
              transparent
              opacity={0.11}
              depthWrite={false}
              metalness={0.38}
              roughness={0.22}
            />
          </mesh>
        ))}
        {[-3.4, -1.7, 0, 1.7, 3.4].map((x, i) => (
          <group key={x} position={[x, 4.75, -2.8]}>
            <mesh position-y={-0.44}>
              <cylinderGeometry args={[0.013, 0.013, 0.88, 8]} />
              <meshStandardMaterial color="#8a7651" />
            </mesh>
            <mesh position-y={-0.93}>
              <cylinderGeometry args={[0.23, 0.13, 0.18, 20]} />
              <meshStandardMaterial color="#8f6150" roughness={0.8} />
            </mesh>
            {Array.from({ length: 7 }, (_, j) => (
              <mesh
                key={j}
                position={[
                  Math.sin(j * 2.4) * 0.2,
                  -1.05 - random(i + j) * 0.25,
                  Math.cos(j * 2.4) * 0.18,
                ]}
                rotation={[0.45, j * 2.4, 0.4]}
                scale={[0.085, 0.31 + 0.05 * (j % 3), 0.055]}
              >
                <sphereGeometry args={[1, 10, 7]} />
                <meshStandardMaterial color={j % 2 ? '#698756' : '#406d54'} roughness={0.75} />
              </mesh>
            ))}
          </group>
        ))}
        <directionalLight color="#bce4dc" intensity={1.55} position={[-3, 7, 1]} />
      </group>
    );
  return (
    <group>
      {[-2.8, 0, 2.8].map((x) => (
        <group key={x} position={[x, 0, -3.72]}>
          <mesh geometry={structures[0]}>
            <meshStandardMaterial color="#706259" roughness={0.82} />
          </mesh>
          <mesh geometry={structures[1]}>
            <meshStandardMaterial color="#b99860" metalness={0.55} roughness={0.43} />
          </mesh>
          {[-1.1, 1.1].map((p) => (
            <mesh key={p} position={[p, 0.19, 0.035]}>
              <cylinderGeometry args={[0.15, 0.23, 0.29, 18]} />
              <meshStandardMaterial color="#494138" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.153, -0.6]}>
        <planeGeometry args={[8.4, 5.25]} />
        <meshStandardMaterial color="#263431" roughness={0.57} metalness={0.2} />
      </mesh>
      {[3.95, -3.95].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, -0.151, -0.6]}>
          <planeGeometry args={[0.025, 5.25]} />
          <meshBasicMaterial color="#a48a5b" />
        </mesh>
      ))}
    </group>
  );
}
