'use client';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Lantern, Rod, palette } from './Objects';
import { realms, type RealmId } from '@/data/portfolio';
import { barkGrain } from './materials';

type Placement = {
  p: [number, number, number];
  s: [number, number, number];
  r?: [number, number, number];
};
function Instances({
  placements,
  children,
  color,
  ...props
}: { placements: Placement[]; children: React.ReactNode; color: string } & Omit<
  ThreeElements['instancedMesh'],
  'args'
>) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const object = new THREE.Object3D();
    placements.forEach((item, index) => {
      object.position.set(...item.p);
      object.scale.set(...item.s);
      object.rotation.set(...(item.r ?? [0, 0, 0]));
      object.updateMatrix();
      mesh.current?.setMatrixAt(index, object.matrix);
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
      mesh.current.computeBoundingSphere();
    }
  }, [placements]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, placements.length]} {...props}>
      {children}
      <meshStandardMaterial
        color={color}
        map={color === '#344539' ? barkGrain : null}
        roughness={0.95}
      />
    </instancedMesh>
  );
}
export function Woodland() {
  const fields = useMemo(() => {
    const trunks: Placement[] = [],
      crowns: Placement[] = [],
      roots: Placement[] = [],
      ferns: Placement[] = [],
      stones: Placement[] = [];
    for (let i = 0; i < 56; i++) {
      const a = i * 2.399,
        r = 7.8 + (i % 7) * 1.4,
        x = Math.sin(a) * r,
        z = Math.cos(a) * r,
        h = 8 + (i % 5);
      // Leave the near camera sightline open; foliage frames the atelier.
      if (z > 2 && x > 0 && x < 9) continue;
      trunks.push({ p: [x, h / 2 - 0.3, z], s: [0.35 + (i % 3) * 0.12, h, 0.38] });
      for (let j = 0; j < 3; j++) {
        crowns.push({
          p: [x + Math.sin(a + j * 2) * 1.4, h - j * 0.6, z + Math.cos(a + j * 2) * 1.4],
          s: [2.5, 1.4, 2.2],
        });
        roots.push({
          p: [x + Math.sin(j * 2) * 0.45, 0.07, z + Math.cos(j * 2) * 0.45],
          s: [0.2, 1.6, 0.25],
          r: [Math.cos(j * 2) * 1.2, 0, Math.sin(j * 2) * 1.2],
        });
      }
    }
    for (let i = 0; i < 180; i++) {
      const a = i * 2.399,
        r = 5.1 + (i % 9) * 0.52;
      ferns.push({
        p: [Math.sin(a) * r, 0.12 + (i % 3) * 0.08, Math.cos(a) * r],
        s: [0.12, 0.45 + (i % 4) * 0.1, 0.07],
        r: [Math.sin(a) * 0.8, a, Math.cos(a) * 0.8],
      });
      if (i % 6 === 0)
        stones.push({
          p: [Math.sin(a) * r, -0.02, Math.cos(a) * r],
          s: [0.4 + (i % 3) * 0.2, 0.22, 0.5],
          r: [0, a, 0],
        });
    }
    return { trunks, crowns, roots, ferns, stones };
  }, []);
  return (
    <group>
      <Instances placements={fields.trunks} color="#344539">
        <cylinderGeometry args={[0.6, 1, 1, 9]} />
      </Instances>
      <Instances placements={fields.roots} color="#344539">
        <cylinderGeometry args={[0.4, 1, 1, 6]} />
      </Instances>
      <Instances placements={fields.crowns} color="#3e5941">
        <icosahedronGeometry args={[1, 1]} />
      </Instances>
      <Instances placements={fields.ferns} color="#688154">
        <sphereGeometry args={[1, 7, 5]} />
      </Instances>
      <Instances placements={fields.stones} color="#66705a">
        <dodecahedronGeometry args={[1, 0]} />
      </Instances>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.29} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#273f32" />
      </mesh>
    </group>
  );
}
export function AtelierDetails() {
  const shingles = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i): Placement => ({
        p: [
          ((i % 12) - 5.5) * 0.58,
          4.6 + (1 - Math.abs((i % 12) - 5.5) / 5.5) * 0.8,
          -2.85 + Math.floor(i / 12) * 0.35,
        ],
        s: [0.62, 0.075, 0.43],
        r: [0, 0, i % 12 < 6 ? 0.22 : -0.22],
      })),
    [],
  );
  return (
    <group>
      <Instances placements={shingles} color="#53634a" castShadow>
        <boxGeometry />
      </Instances>
      {[-1, 1].map((side) => (
        <group key={side}>
          <Rod from={[side * 3.7, 2.8, -2.8]} to={[side * 2.2, 4.7, -2.8]} radius={0.065} />
          <Rod from={[side * 3.7, 2.8, 2]} to={[side * 3.35, 4.5, 0.7]} radius={0.065} />
          {Array.from({ length: 6 }, (_, i) => (
            <Rod
              key={i}
              from={[side * (0.8 + i * 0.43), 0.2, -2.65]}
              to={[side * (0.8 + i * 0.43), 1.14, -2.65]}
              radius={0.023}
              color="#887456"
            />
          ))}
        </group>
      ))}
      <Box size={[8, 0.1, 0.3]} position={[0, 1.18, -2.85]} color={palette.wood} />
      <group position={[0, 4.75, -0.4]}>
        <Rod from={[0, 0.7, 0]} to={[0, -0.25, 0]} radius={0.015} color={palette.gold} />
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.65, 0.025, 8, 48]} />
          <meshStandardMaterial color={palette.gold} metalness={0.65} roughness={0.4} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <group
            key={i}
            position={[
              Math.sin(i * Math.PI * 0.4) * 0.65,
              -0.2,
              Math.cos(i * Math.PI * 0.4) * 0.65,
            ]}
            scale={0.45}
          >
            <Lantern position={[0, -0.25, 0]} />
          </group>
        ))}
      </group>
      <group position={[1.35, 1.51, 1.1]} rotation-y={-0.4}>
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial color="#c8b488" />
        </mesh>
        {['#994b50', '#6c8062', '#bda15e', '#667f89'].map((color, i) => (
          <mesh
            key={color}
            position={[Math.sin(i * 1.4) * 0.13, 0.008, Math.cos(i * 1.4) * 0.13]}
            rotation-x={-Math.PI / 2}
          >
            <circleGeometry args={[0.04, 12]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>
      <group position={[-0.6, 1.51, 0.1]} rotation-y={0.3}>
        <Box size={[0.42, 0.015, 0.65]} color="#b5ab86" />
        {Array.from({ length: 5 }, (_, i) => (
          <Box
            key={i}
            size={[0.26, 0.002, 0.003]}
            position={[0, 0.01, -0.19 + i * 0.07]}
            color="#7b8067"
          />
        ))}
      </group>
      <group position={[2.7, 0.3, 0.6]}>
        <BooksPile />
        <mesh position={[0.03, 0.52, 0]}>
          <latheGeometry
            args={[
              [
                new THREE.Vector2(0.15, 0),
                new THREE.Vector2(0.16, 0.05),
                new THREE.Vector2(0.12, 0.23),
                new THREE.Vector2(0.08, 0.28),
              ],
              16,
            ]}
          />
          <meshStandardMaterial color="#a7afa0" roughness={0.4} />
        </mesh>
        <mesh position={[0.23, 0.7, 0]} rotation-y={Math.PI / 2}>
          <torusGeometry args={[0.08, 0.018, 6, 16, Math.PI * 1.8]} />
          <meshStandardMaterial color="#a7afa0" />
        </mesh>
      </group>
      <group position={[-3.6, 2.9, -1.9]} rotation-z={0.3}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i) * 0.1, -i * 0.16, 0]}
            rotation-z={Math.sin(i) * 0.8}
            scale={[0.14, 0.08, 0.03]}
          >
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#71835b" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function BooksPile() {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} position-y={i * 0.13} rotation-y={i * 0.13}>
          <Box size={[0.7, 0.1, 0.48]} color={['#736045', '#647466', '#743d42'][i]} />
          <Box size={[0.62, 0.06, 0.46]} position-z={0.02} color={palette.paper} />
        </group>
      ))}
    </group>
  );
}

export function PortalCompass({
  reduced,
  enter,
}: {
  reduced: boolean;
  enter: (realm: RealmId) => void;
}) {
  const root = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (root.current && !reduced)
      root.current.position.y = 2.25 + Math.sin(clock.elapsedTime) * 0.035;
  });
  return (
    <group ref={root} position={[-1.5, 2.25, 0]}>
      {realms.slice(0, 7).map((realm, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <group
            key={realm.id}
            position={[Math.sin(a) * 1.05, Math.cos(a) * 1.05, 0]}
            onClick={(event) => {
              event.stopPropagation();
              enter(realm.id);
            }}
          >
            <mesh>
              <torusGeometry args={[0.25, 0.018, 8, 36]} />
              <meshStandardMaterial color={palette.gold} metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.23, 36]} />
              <meshStandardMaterial
                color={realm.color}
                emissive={realm.color}
                emissiveIntensity={0.35}
                transparent
                opacity={0.75}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh rotation-z={Math.PI / 4}>
              <ringGeometry args={[0.1, 0.105, i + 3]} />
              <meshBasicMaterial color={palette.paper} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
      <mesh>
        <torusGeometry args={[1.05, 0.009, 5, 64]} />
        <meshBasicMaterial color={palette.gold} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
