'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Mascot from '../Mascot';
import { ContactShadow } from './Studio';
import type { MascotState } from '@/data/portfolio';

const movementKeys = ['w', 'a', 's', 'd'];

function titleArtwork(portrait: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = portrait ? 360 : 650;
  const ink = canvas.getContext('2d')!;
  ink.fillStyle = '#f4deb1';
  ink.textAlign = 'center';
  ink.textBaseline = 'middle';
  ink.shadowColor = '#101c17';
  ink.shadowBlur = portrait ? 18 : 12;
  ink.shadowOffsetY = 4;
  ink.font = portrait ? '160px Georgia' : '229px Georgia';
  if (portrait) {
    ink.fillText('SRISHTI', 512, 95, 1000);
    ink.fillText('GUPTA', 512, 266, 1000);
  } else {
    ink.textAlign = 'left';
    ink.fillText('SRISHTI', 55, 215, 930);
    ink.fillText('GUPTA', 55, 440, 900);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function Hero({
  active,
  mobile,
  reduced,
  state,
  wave,
  position,
}: {
  active: boolean;
  mobile: boolean;
  reduced: boolean;
  state: MascotState;
  wave: () => void;
  position: RefObject<THREE.Vector3>;
}) {
  const actor = useRef<THREE.Group>(null);
  const title = useRef<THREE.MeshBasicMaterial>(null);
  const keys = useRef(new Set<string>());
  const touchGoal = useRef<number | null>(null);
  const speed = useRef(new THREE.Vector2());
  const [walking, setWalking] = useState(false);
  const walkingNow = useRef(false);
  const invalidate = useThree((s) => s.invalidate);
  const artwork = useMemo(() => titleArtwork(mobile), [mobile]);
  useEffect(() => () => artwork.dispose(), [artwork]);

  useEffect(() => {
    if (!active) return;
    const velocity = speed.current;
    const pressed = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (target instanceof HTMLElement &&
          target.closest('input, textarea, select, button, a, dialog, [contenteditable]'))
      )
        return;
      const key = e.key.toLowerCase();
      if (!movementKeys.includes(key)) return;
      keys.current.add(key);
      touchGoal.current = null;
      invalidate();
    };
    const released = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => keys.current.clear();
    window.addEventListener('keydown', pressed);
    window.addEventListener('keyup', released);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', pressed);
      window.removeEventListener('keyup', released);
      window.removeEventListener('blur', clear);
      clear();
      touchGoal.current = null;
      velocity.set(0, 0);
    };
  }, [active, invalidate]);

  useFrame((_, delta) => {
    if (!actor.current) return;
    if (title.current) {
      title.current.opacity = reduced
        ? Number(active) * 0.92
        : THREE.MathUtils.damp(title.current.opacity, active ? 0.92 : 0, 3, delta);
    }
    const dt = Math.min(delta, 0.05);
    const pressed = keys.current;
    const point = position.current;
    const goal = touchGoal.current;
    let dx = Number(pressed.has('d')) - Number(pressed.has('a'));
    const dz = Number(pressed.has('s')) - Number(pressed.has('w'));
    if (goal !== null) {
      const distance = goal - point.x;
      dx = THREE.MathUtils.clamp(distance * 4, -1, 1);
      if (Math.abs(distance) < 0.025) touchGoal.current = null;
    }
    const magnitude = Math.max(1, Math.hypot(dx, dz));
    const velocity = speed.current;
    velocity.x = THREE.MathUtils.damp(velocity.x, (dx / magnitude) * 0.88, 9, dt);
    velocity.y = THREE.MathUtils.damp(velocity.y, (dz / magnitude) * 0.72, 9, dt);
    const xLimit = mobile ? 0.62 : 1.2;
    const nextX = THREE.MathUtils.clamp(point.x + velocity.x * dt, -xLimit, xLimit);
    const nextZ = THREE.MathUtils.clamp(point.z + velocity.y * dt, 2.65, 3.7);
    const moving = active && Math.hypot(nextX - point.x, nextZ - point.z) > dt * 0.07;
    if (moving !== walkingNow.current) {
      walkingNow.current = moving;
      setWalking(moving);
    }
    point.set(nextX, 0, nextZ);
    actor.current.position.copy(point);
    const facing = moving ? Math.atan2(velocity.x, velocity.y) : 0;
    const angle = Math.atan2(
      Math.sin(facing - actor.current.rotation.y),
      Math.cos(facing - actor.current.rotation.y),
    );
    actor.current.rotation.y += angle * (1 - Math.exp(-7 * dt));
    if (reduced && (moving || pressed.size || goal !== null || Math.abs(angle) > 0.01))
      invalidate();
  });

  return (
    <>
      <mesh position={mobile ? [0, 3.0, 2.18] : [-2.1, 1.92, 2.18]} raycast={() => null}>
        <planeGeometry args={mobile ? [2.62, 0.92] : [3.52, 2.23]} />
        <meshBasicMaterial
          ref={title}
          map={artwork}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <group ref={actor} position={position.current} onClick={wave}>
        <ContactShadow position={[0, 0.068, 0]} scale={[0.54, 0.33, 1]} />
        <Mascot state={walking ? 'walk' : state} reduced={reduced} hero />
      </group>
      {active && mobile && (
        <mesh
          position={[0, 0.085, 3.2]}
          rotation-x={-Math.PI / 2}
          onClick={(event) => {
            touchGoal.current = THREE.MathUtils.clamp(event.point.x, -0.62, 0.62);
            invalidate();
          }}
        >
          <planeGeometry args={[2.65, 1.9]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
