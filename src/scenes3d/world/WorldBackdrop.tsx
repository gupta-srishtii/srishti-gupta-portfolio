'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { RealmId } from '@/data/portfolio';

export default function WorldBackdrop({ realm }: { realm: RealmId }) {
  const source = useTexture(
    `/worlds/${realm === 'gifts' ? 'honors' : realm === 'about' ? 'design' : realm}.webp`,
  );
  const plate = useRef<THREE.Mesh>(null);
  const gaze = useRef(new THREE.Vector3());
  const matte = useMemo(() => {
    const texture = source.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [source]);
  useEffect(() => () => matte.dispose(), [matte]);
  useFrame(({ camera }) => {
    if (!plate.current || !(camera instanceof THREE.PerspectiveCamera)) return;
    const distance = 22;
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
    const width = height * Math.max(1.5, camera.aspect) * 1.09;
    camera.getWorldDirection(gaze.current);
    plate.current.position.copy(camera.position).addScaledVector(gaze.current, distance);
    plate.current.quaternion.copy(camera.quaternion);
    plate.current.scale.set(width, width / 1.5, 1);
  });
  return (
    <mesh ref={plate} frustumCulled={false} raycast={() => null}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={matte} toneMapped={false} fog={false} />
    </mesh>
  );
}
