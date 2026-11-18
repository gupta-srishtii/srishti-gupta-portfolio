'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Rod } from '../Objects';
import { branch, random } from './geometry';

function wovenRug() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const paint = canvas.getContext('2d')!;
  paint.fillStyle = '#633443';
  paint.fillRect(0, 0, 512, 384);
  for (let i = 0; i < 4100; i++) {
    paint.fillStyle = i % 2 ? '#f4b78824' : '#180f264a';
    paint.fillRect(random(i + 31) * 512, random(i + 300) * 384, 2 + random(i) * 13, 1.5);
  }
  paint.strokeStyle = '#ce9d68';
  for (const margin of [12, 21, 39])
    paint.strokeRect(margin, margin, 512 - margin * 2, 384 - margin * 2);
  for (let x = 56; x < 480; x += 40) {
    for (let y = 52; y < 354; y += 35) {
      paint.beginPath();
      paint.moveTo(x, y - 9);
      paint.quadraticCurveTo(x + 3, y - 3, x + 9, y);
      paint.quadraticCurveTo(x + 3, y + 3, x, y + 9);
      paint.quadraticCurveTo(x - 3, y + 3, x - 9, y);
      paint.quadraticCurveTo(x - 3, y - 3, x, y - 9);
      paint.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function StudioDetails() {
  const rug = useMemo(() => wovenRug(), []);
  const garland = useMemo(
    () =>
      branch(
        [
          [-3.05, 4.95, -1.9],
          [-1.6, 4.35, -1.9],
          [0, 4.2, -2],
          [1.55, 4.4, -2],
          [3.2, 5, -2.1],
        ],
        0.025,
      ),
    [],
  );
  useEffect(
    () => () => {
      rug.dispose();
      garland.dispose();
    },
    [rug, garland],
  );
  return (
    <>
      <mesh position={[-0.25, 0.063, 1.85]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[4.35, 2.65]} />
        <meshStandardMaterial map={rug} bumpMap={rug} bumpScale={0.012} roughness={1} />
      </mesh>
      <mesh geometry={garland}>
        <meshStandardMaterial color="#747149" roughness={0.95} />
      </mesh>
      {[-2.45, -1.55, -0.65, 0.7, 1.6, 2.5].map((x, i) => (
        <group key={x} position={[x, 4.16 + x * x * 0.074, -1.94]}>
          <Rod
            from={[0, 0, 0]}
            to={[0, -0.18 - (i % 2) * 0.09, 0]}
            radius={0.008}
            color="#936d49"
          />
          <mesh position-y={-0.28 - (i % 2) * 0.09} scale={[0.075, 0.135, 0.075]}>
            <octahedronGeometry />
            <meshStandardMaterial
              color="#eac087"
              emissive="#f5a642"
              emissiveIntensity={0.7}
              roughness={0.32}
            />
          </mesh>
        </group>
      ))}
      <group position={[-1.24, 1.52, 0.92]} rotation-y={0.27}>
        <mesh scale={[0.27, 0.026, 0.15]}>
          <sphereGeometry args={[1, 24, 12]} />
          <meshStandardMaterial color="#a37348" roughness={0.63} />
        </mesh>
        {['#b86d52', '#cab07a', '#76845a', '#915b77', '#526f7b'].map((color, i) => (
          <mesh
            key={color}
            position={[(i - 2) * 0.079, 0.028, Math.cos(i) * 0.065]}
            scale={[0.035, 0.012, 0.024]}
          >
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color={color} roughness={0.55} />
          </mesh>
        ))}
        <Rod from={[-0.26, 0.04, 0.08]} to={[0.22, 0.04, 0.15]} radius={0.012} color="#553c33" />
        <Rod from={[0.22, 0.04, 0.15]} to={[0.3, 0.04, 0.16]} radius={0.014} color="#c3a06b" />
      </group>
    </>
  );
}
