'use client';

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { leafGeometry, random } from './geometry';

export default function WoodlandLanding({ low, reduced }: { low: boolean; reduced: boolean }) {
  const image = useTexture('/scene01/moonlit-atelier.webp');
  const matte = useMemo(() => {
    const texture = image.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
  }, [image]);
  const scenery = useRef<THREE.Group>(null);
  const backdrop = useRef<THREE.Mesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  const direction = useRef(new THREE.Vector3());
  const fronds = useMemo(() => {
    const result = leafGeometry();
    // Arc each leaflet along its midrib.
    const p = result.getAttribute('position');
    for (let i = 0; i < p.count; i++) {
      const z = p.getZ(i);
      p.setY(i, p.getY(i) + Math.sin(Math.PI * z) * 0.07);
    }
    result.computeVertexNormals();
    return result;
  }, []);
  useEffect(() => () => matte.dispose(), [matte]);
  useEffect(() => () => fronds.dispose(), [fronds]);
  useLayoutEffect(() => {
    if (!leaves.current) return;
    const pivot = new THREE.Object3D();
    const shade = new THREE.Color();
    const clusters = low ? 12 : 18;
    for (let i = 0; i < clusters; i++) {
      const side = i % 2 ? 1 : -1;
      const x = side * (2.45 + random(i + 9) * 2.75);
      const z = 4.7 - random(i + 20) * 5.8;
      for (let j = 0; j < 9; j++) {
        const index = i * 9 + j;
        const a = j * 0.68 + i * 2.24;
        pivot.position.set(x + Math.cos(a) * 0.04, 0.025, z + Math.sin(a) * 0.04);
        pivot.rotation.set(-0.27 - random(index + 12) * 0.7, a, 0.19 * Math.sin(a));
        const s = 0.38 + random(index + 9) * 0.65;
        pivot.scale.set(s * 0.7, s, s);
        pivot.updateMatrix();
        leaves.current.setMatrixAt(index, pivot.matrix);
        shade.set(['#354b34', '#5e6140', '#253d31', '#484f32'][index % 4]);
        leaves.current.setColorAt(index, shade);
      }
    }
    leaves.current.instanceMatrix.needsUpdate = true;
    if (leaves.current.instanceColor) leaves.current.instanceColor.needsUpdate = true;
  }, [low]);
  useFrame(({ camera, clock }) => {
    if (!backdrop.current || !(camera instanceof THREE.PerspectiveCamera)) return;
    if (scenery.current) scenery.current.visible = camera.position.x < 50;
    if (camera.position.x > 50) return;
    const distance = Math.max(13, camera.position.z + 12);
    camera.getWorldDirection(direction.current);
    const gaze = direction.current;
    const forward = Math.max(0.35, -gaze.z);
    const h = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance) / forward;
    const aspect = 1.5;
    const overscan = 1.19 + Math.min(0.11, Math.abs(gaze.x) * 0.5);
    const w = h * Math.max(aspect, camera.aspect) * overscan;
    const height = w / aspect;
    backdrop.current.scale.set(w, height, 1);
    backdrop.current.position.set(
      camera.position.x + (gaze.x * distance) / forward - (camera.aspect < 1 ? w * 0.09 : 0),
      camera.position.y + (gaze.y * distance) / forward + height * 0.046,
      -12,
    );
    if (leaves.current)
      leaves.current.rotation.y = reduced ? 0 : Math.sin(clock.elapsedTime * 0.37) * 0.008;
  });
  return (
    <group ref={scenery}>
      <mesh ref={backdrop} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={matte} fog={false} toneMapped={false} />
      </mesh>
      <instancedMesh
        ref={leaves}
        args={[fronds, undefined, (low ? 12 : 18) * 9]}
        frustumCulled={false}
      >
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.92} />
      </instancedMesh>
    </group>
  );
}
