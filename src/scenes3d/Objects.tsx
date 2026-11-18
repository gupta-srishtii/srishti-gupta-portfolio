'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import { Cylinder, RoundedBox, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { woodGrain } from './materials';
import { leafGeometry } from './world/geometry';

export const palette = {
  wood: '#6b4930',
  darkWood: '#302a20',
  gold: '#bca368',
  paper: '#eee0b4',
  burgundy: '#6e2638',
  moss: '#647752',
};
export function Box({
  size,
  color,
  ...props
}: Omit<ThreeElements['mesh'], 'args'> & { size: [number, number, number]; color: string }) {
  const wooden = [palette.wood, palette.darkWood, '#776047', '#69543e', '#887456'].includes(color);
  return (
    <mesh castShadow {...props} receiveShadow>
      <boxGeometry args={size} />
      <meshLambertMaterial color={color} map={wooden ? woodGrain : null} />
    </mesh>
  );
}
export function Rod({
  from,
  to,
  radius = 0.04,
  color = palette.wood,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  color?: string;
}) {
  const a = new THREE.Vector3(...from),
    b = new THREE.Vector3(...to),
    d = b.clone().sub(a);
  return (
    <mesh
      castShadow
      position={a.add(b).multiplyScalar(0.5)}
      quaternion={new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        d.clone().normalize(),
      )}
    >
      <cylinderGeometry args={[radius * 0.7, radius, d.length(), 10]} />
      <meshLambertMaterial
        color={color}
        map={color === palette.wood || color === palette.darkWood ? woodGrain : null}
      />
    </mesh>
  );
}
export function Plant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const leaves = useRef<THREE.InstancedMesh>(null),
    stems = useRef<THREE.InstancedMesh>(null);
  const shape = useMemo(() => leafGeometry(), []);
  useEffect(() => () => shape.dispose(), [shape]);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D(),
      up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4,
        end = new THREE.Vector3(Math.sin(a) * 0.25, 0.65 + (i % 3) * 0.13, Math.cos(a) * 0.25),
        start = new THREE.Vector3(0, 0.3, 0),
        direction = end.clone().sub(start);
      dummy.position.copy(start).add(end).multiplyScalar(0.5);
      dummy.quaternion.setFromUnitVectors(up, direction.clone().normalize());
      dummy.scale.set(0.012, direction.length(), 0.012);
      dummy.updateMatrix();
      stems.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.copy(end);
      dummy.rotation.set(-0.8, a, 0);
      dummy.scale.set(0.65, 0.65, 0.65);
      dummy.updateMatrix();
      leaves.current?.setMatrixAt(i, dummy.matrix);
      leaves.current?.setColorAt(i, new THREE.Color(i % 2 ? '#799264' : '#496c4e'));
    }
    if (leaves.current) {
      leaves.current.instanceMatrix.needsUpdate = true;
      if (leaves.current.instanceColor) leaves.current.instanceColor.needsUpdate = true;
      leaves.current.computeBoundingSphere();
    }
    if (stems.current) {
      stems.current.instanceMatrix.needsUpdate = true;
      stems.current.computeBoundingSphere();
    }
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh position-y={0.2}>
        <cylinderGeometry args={[0.25, 0.17, 0.4, 12]} />
        <meshStandardMaterial color="#9f7054" />
      </mesh>
      <instancedMesh ref={leaves} args={[shape, undefined, 9]}>
        <meshLambertMaterial color="white" side={THREE.DoubleSide} />
      </instancedMesh>
      <instancedMesh ref={stems} args={[undefined, undefined, 9]}>
        <cylinderGeometry args={[0.8, 1, 1, 6]} />
        <meshLambertMaterial color="#64734b" />
      </instancedMesh>
    </group>
  );
}
export function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Rod from={[0, 0.1, 0]} to={[0, 0.8, 0]} radius={0.025} color={palette.gold} />
      <mesh position-y={0.52}>
        <cylinderGeometry args={[0.16, 0.24, 0.3, 12, 1, true]} />
        <meshStandardMaterial
          color="#f3cd84"
          emissive="#ffae55"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Cylinder args={[0.16, 0.2, 0.04, 12]} position-y={0.08}>
        <meshStandardMaterial color={palette.gold} metalness={0.6} roughness={0.4} />
      </Cylinder>
    </group>
  );
}
export function Books({
  position,
  count = 7,
}: {
  position: [number, number, number];
  count?: number;
}) {
  const covers = useRef<THREE.InstancedMesh>(null),
    bands = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.rotation.set(0, 0, i === count - 1 ? -0.16 : 0);
      dummy.position.set(i * 0.15, 0.25, 0);
      dummy.scale.set(0.11, 0.4 + (i % 3) * 0.07, 0.3);
      dummy.updateMatrix();
      covers.current?.setMatrixAt(i, dummy.matrix);
      covers.current?.setColorAt(
        i,
        new THREE.Color(['#703e3c', '#496052', '#a28b60', '#57676a'][i % 4]),
      );
      dummy.position.set(i * 0.15, 0.12, 0);
      dummy.scale.set(0.115, 0.025, 0.31);
      dummy.updateMatrix();
      bands.current?.setMatrixAt(i, dummy.matrix);
    }
    for (const mesh of [covers.current, bands.current])
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.computeBoundingSphere();
      }
  }, [count]);
  return (
    <group position={position}>
      <instancedMesh ref={covers} args={[undefined, undefined, count]} castShadow>
        <boxGeometry />
        <meshLambertMaterial color="white" />
      </instancedMesh>
      <instancedMesh ref={bands} args={[undefined, undefined, count]}>
        <boxGeometry />
        <meshStandardMaterial color={palette.gold} roughness={0.7} />
      </instancedMesh>
    </group>
  );
}
export function Frame({
  position,
  rotation = [0, 0, 0],
  color = '#334d44',
  onClick,
  image,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  onClick?: () => void;
  image?: string;
}) {
  const [hover, setHover] = useState(false);
  useCursor(hover && Boolean(onClick));
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!image) return;
    let active = true;
    const loaded = new THREE.TextureLoader().load(image, (value) => {
      value.colorSpace = THREE.SRGBColorSpace;
      if (active) setTexture(value);
    });
    return () => {
      active = false;
      loaded.dispose();
    };
  }, [image]);
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <Box size={[1.55, 1.95, 0.1]} color={hover ? '#e0c47f' : palette.gold} />
      <Box size={[1.4, 1.8, 0.12]} position-z={0.02} color={palette.darkWood} />
      <mesh position-z={0.09}>
        <planeGeometry args={[1.25, 1.65]} />
        <meshStandardMaterial color={texture ? '#ffffff' : color} map={texture} roughness={0.95} />
      </mesh>
      {!image && (
        <group position-z={0.1}>
          <mesh>
            <ringGeometry args={[0.26, 0.265, 48]} />
            <meshBasicMaterial color="#c5b98a" />
          </mesh>
          <Rod from={[-0.4, -0.5, 0]} to={[0.4, 0.5, 0]} radius={0.008} color="#c5b98a" />
        </group>
      )}
    </group>
  );
}
export function Sketchbook({
  open,
  page,
  reduced,
  onClick,
}: {
  open: boolean;
  page: number;
  reduced: boolean;
  onClick: () => void;
}) {
  const lid = useRef<THREE.Group>(null),
    leaf = useRef<THREE.Group>(null);
  const turn = useRef(1),
    lastPage = useRef(page);
  const pageMesh = useRef<THREE.Mesh>(null);
  const sheet = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1.1, 1.4, 16, 1);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0.55, 0, 0);
    return geometry;
  }, []);
  useEffect(() => () => sheet.dispose(), [sheet]);
  const [hover, setHover] = useState(false);
  useCursor(hover);
  useFrame((_, dt) => {
    if (lastPage.current !== page) {
      lastPage.current = page;
      turn.current = 0;
    }
    turn.current = reduced ? 1 : Math.min(1, turn.current + dt * 1.2);
    if (lid.current)
      lid.current.rotation.z = THREE.MathUtils.damp(
        lid.current.rotation.z,
        open ? Math.PI * 1.06 : 0,
        reduced ? 100 : 3,
        dt,
      );
    if (leaf.current)
      leaf.current.rotation.z = open
        ? Math.PI * (turn.current * turn.current * (3 - 2 * turn.current))
        : 0;
    const geometry = pageMesh.current?.geometry;
    if (!geometry) return;
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      positions.setY(
        i,
        open ? Math.sin((x / 1.1) * Math.PI) * Math.sin(turn.current * Math.PI) * 0.2 : 0,
      );
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });
  return (
    <group
      position={[0, 1.56, 0.6]}
      rotation-y={-0.15}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <RoundedBox args={[1.2, 0.07, 1.5]} radius={0.04}>
        <meshStandardMaterial color={hover ? '#924657' : palette.burgundy} />
      </RoundedBox>
      <Box size={[1.1, 0.13, 1.4]} position-y={0.09} color={palette.paper} />
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i} size={[1.1, 0.003, 1.41]} position-y={0.04 + i * 0.018} color="#b8a57d" />
      ))}
      <group ref={leaf} position={[-0.55, 0.2, 0]}>
        <mesh ref={pageMesh} geometry={sheet}>
          <meshStandardMaterial color="#f7f0cd" side={THREE.DoubleSide} roughness={0.95} />
        </mesh>
      </group>
      <group position={[0, 0.182, 0]}>
        <group rotation-x={-Math.PI / 2}>
          <mesh>
            <ringGeometry args={[0.28, 0.285, 40]} />
            <meshBasicMaterial color="#7e855e" />
          </mesh>
          <mesh rotation-z={page * 0.5}>
            <ringGeometry args={[0.18, 0.188, 4 + page]} />
            <meshBasicMaterial color="#657456" />
          </mesh>
        </group>
        {Array.from({ length: 5 }, (_, i) => (
          <Box
            key={i}
            size={[0.68 - (i % 2) * 0.2, 0.003, 0.007]}
            position={[0, 0.006, 0.4 + i * 0.04]}
            color="#9d9471"
          />
        ))}
      </group>
      <group ref={lid} position={[-0.6, 0.19, 0]}>
        <Box size={[1.2, 0.045, 1.5]} position-x={0.6} color={palette.burgundy} />
        <Box size={[0.9, 0.008, 1.2]} position={[0.6, 0.028, 0]} color={palette.gold} />
        <Box size={[0.87, 0.01, 1.17]} position={[0.6, 0.035, 0]} color={palette.burgundy} />
        <mesh position={[0.6, 0.05, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.18, 0.19, 40]} />
          <meshStandardMaterial color={palette.gold} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
