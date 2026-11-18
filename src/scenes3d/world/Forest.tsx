'use client';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { branch, grownTrunk, leafGeometry, random } from './geometry';
import { barkGrain } from '../materials';

type Transform = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color?: string;
};
function Scatter({
  geometry,
  items,
  color,
  wind = false,
  reduced = false,
}: {
  geometry: THREE.BufferGeometry;
  items: Transform[];
  color: string;
  wind?: boolean;
  reduced?: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const transform = new THREE.Object3D();
    items.forEach((item, i) => {
      transform.position.set(...item.position);
      transform.rotation.set(...item.rotation);
      transform.scale.set(...item.scale);
      transform.updateMatrix();
      mesh.current?.setMatrixAt(i, transform.matrix);
      mesh.current?.setColorAt(i, new THREE.Color(item.color ?? color));
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
      if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
      mesh.current.computeBoundingSphere();
    }
  }, [items, color]);
  useFrame(({ clock }) => {
    if (group.current && wind && !reduced)
      group.current.rotation.z = Math.sin(clock.elapsedTime * 0.36) * 0.006;
  });
  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, undefined, items.length]}>
        <meshLambertMaterial color="white" side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
}

export default function Forest({ reduced, low = false }: { reduced: boolean; low?: boolean }) {
  const data = useMemo(() => {
    const trunks: Transform[] = [],
      leaves: Transform[] = [],
      ferns: Transform[] = [],
      rocks: Transform[] = [],
      grass: Transform[] = [];
    for (let i = 0; i < (low ? 16 : 40); i++) {
      const a = i * 2.399,
        r = 9 + random(i + 1) * 15,
        x = Math.sin(a) * r,
        z = Math.cos(a) * r;
      if (z > 0 && x > -4.5 && x < 14) continue;
      const s = 0.7 + random(i + 9) * 0.75;
      trunks.push({ position: [x, -0.45, z], scale: [s, s, s], rotation: [0, a, 0] });
      for (let j = 0; j < (low ? 14 : 40); j++) {
        const angle = j * 2.4,
          spread = 1.2 + random(i * 40 + j) * 2.7;
        leaves.push({
          position: [
            x + Math.sin(angle) * spread,
            7 * s + random(j + i) * 3,
            z + Math.cos(angle) * spread,
          ],
          scale: [1.2 + random(j) * 1.1, 1, 1.3 + random(j + 1)],
          rotation: [-0.3 + random(j) * 0.7, angle, random(j + 3) * 0.3],
          color: ['#314e42', '#46634b', '#536c4c', '#304e45'][j % 4],
        });
      }
    }
    for (let i = 0; i < (low ? 35 : 70); i++) {
      const a = i * 2.399,
        r = 5 + random(i + 40) * 6,
        x = Math.sin(a) * r,
        z = Math.cos(a) * r;
      const size = 0.5 + random(i) * 0.8;
      for (let j = 0; j < (low ? 6 : 9); j++)
        ferns.push({
          position: [x, 0.01, z],
          scale: [size * 0.7, size, size],
          rotation: [-0.65 + random(j) * 0.3, j * 2.4 + a, Math.sin(j) * 0.2],
          color: ['#526e4e', '#74905e', '#3d6250'][j % 3],
        });
      if (i % 3 === 0)
        rocks.push({
          position: [x, -0.15, z],
          scale: [size, 0.32 + size * 0.3, size * 0.7],
          rotation: [0, a, 0],
          color: i % 2 ? '#586259' : '#414f48',
        });
      for (let j = 0; j < (low ? 4 : 6); j++)
        grass.push({
          position: [x + Math.sin(j) * 0.6, 0, z + Math.cos(j) * 0.6],
          scale: [0.09, 0.4 + random(i + j) * 0.6, 0.7],
          rotation: [-1.15, j * 1.2, 0],
          color: '#53694b',
        });
    }
    return { trunks, leaves, ferns, rocks, grass };
  }, [low]);
  const geometries = useMemo(
    () => ({
      trunk: grownTrunk(2, 13, 0.8, low ? 10 : 18, low ? 8 : 18),
      leaf: leafGeometry(),
      rock: new THREE.IcosahedronGeometry(1, 1),
      limbs: branch(
        [
          [0, 7, 0],
          [1.6, 8.5, 0.3],
          [3.6, 9.5, 0.8],
        ],
        0.15,
      ),
    }),
    [low],
  );
  useEffect(() => () => Object.values(geometries).forEach((g) => g.dispose()), [geometries]);
  return (
    <group>
      <Scatter geometry={geometries.trunk} items={data.trunks} color="#39473c" />
      <Scatter
        geometry={geometries.limbs}
        items={data.trunks.map((t) => ({
          ...t,
          position: [...t.position] as [number, number, number],
        }))}
        color="#39473c"
      />
      <Scatter
        geometry={geometries.leaf}
        items={data.leaves}
        color="#48664c"
        wind
        reduced={reduced}
      />
      <Scatter
        geometry={geometries.leaf}
        items={data.ferns}
        color="#657b54"
        wind
        reduced={reduced}
      />
      <Scatter
        geometry={geometries.leaf}
        items={data.grass}
        color="#526f48"
        wind
        reduced={reduced}
      />
      <Scatter geometry={geometries.rock} items={data.rocks} color="#526053" />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.42} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#1d352c" map={barkGrain} roughness={1} />
      </mesh>
    </group>
  );
}
