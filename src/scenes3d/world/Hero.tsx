'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Mascot from '../Mascot';
import ApprovedGuide from './ApprovedGuide';
import { approvedCharacter } from '@/data/portfolio';
import { ContactShadow } from './Studio';
import type { MascotState } from '@/data/portfolio';

const movementKeys = new Set([
  'w',
  'a',
  's',
  'd',
  'arrowup',
  'arrowleft',
  'arrowdown',
  'arrowright',
]);

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
  paused,
  mobile,
  reduced,
  state,
  wave,
  position,
}: {
  active: boolean;
  paused: boolean;
  mobile: boolean;
  reduced: boolean;
  state: MascotState;
  wave: () => void;
  position: RefObject<THREE.Vector3>;
}) {
  const actor = useRef<THREE.Group>(null);
  const title = useRef<THREE.MeshBasicMaterial>(null);
  const keys = useRef(new Set<string>());
  const touchGoal = useRef<THREE.Vector2 | null>(null);
  const speed = useRef(new THREE.Vector2());
  const walkDistanceRef = useRef(0);
  const projected = useRef(new THREE.Vector3());
  const [walking, setWalking] = useState(false);
  const walkingNow = useRef(false);
  const invalidate = useThree((s) => s.invalidate);
  const xLimit = mobile ? 0.85 : 2.2;
  const near = mobile ? 3.95 : 4.85;
  const far = mobile ? 1.45 : 0.3;
  const pose = walking && state !== 'cast' ? 'walk' : state;
  const standIn = <Mascot state={pose} reduced={reduced} walkDistanceRef={walkDistanceRef} hero />;
  const artwork = useMemo(() => titleArtwork(mobile), [mobile]);
  useEffect(() => () => artwork.dispose(), [artwork]);

  useEffect(() => {
    const velocity = speed.current;
    const pressed = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        paused ||
        e.defaultPrevented ||
        e.isComposing ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        (target instanceof HTMLElement &&
          target.closest(
            'input, textarea, select, dialog, [contenteditable="true"], [role="slider"]',
          ))
      )
        return;
      const key = e.key.toLowerCase();
      if (!movementKeys.has(key)) return;
      e.preventDefault();
      keys.current.add(key);
      touchGoal.current = null;
      invalidate();
    };
    const released = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => {
      keys.current.clear();
      touchGoal.current = null;
      velocity.set(0, 0);
    };
    const onHide = () => {
      if (document.hidden) clear();
    };
    window.addEventListener('keydown', pressed);
    window.addEventListener('keyup', released);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('keydown', pressed);
      window.removeEventListener('keyup', released);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', onHide);
      clear();
    };
  }, [paused, invalidate]);

  useFrame(({ gl, camera }, delta) => {
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
    let dx =
      Number(pressed.has('d') || pressed.has('arrowright')) -
      Number(pressed.has('a') || pressed.has('arrowleft'));
    let dz =
      Number(pressed.has('s') || pressed.has('arrowdown')) -
      Number(pressed.has('w') || pressed.has('arrowup'));
    if (goal !== null) {
      dx = (goal.x - point.x) * 3;
      dz = (goal.y - point.z) * 3;
      if (Math.hypot(dx, dz) < 0.075) touchGoal.current = null;
    }
    if (!active || paused) {
      dx = 0;
      dz = 0;
    }
    const magnitude = Math.max(1, Math.hypot(dx, dz));
    const velocity = speed.current;
    velocity.x = THREE.MathUtils.damp(velocity.x, (dx / magnitude) * 1.02, 11, dt);
    velocity.y = THREE.MathUtils.damp(velocity.y, (dz / magnitude) * 1.0, 11, dt);
    const nextX = THREE.MathUtils.clamp(point.x + velocity.x * dt, -xLimit, xLimit);
    const nextZ = THREE.MathUtils.clamp(point.z + velocity.y * dt, far, near);
    const traveled = Math.hypot(nextX - point.x, nextZ - point.z);
    const moving = active && traveled > dt * 0.045;
    if (moving) walkDistanceRef.current += traveled;
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
    if (active) {
      camera.updateMatrixWorld();
      const screen = projected.current.set(point.x, 1.08, point.z).project(camera);
      gl.domElement.dataset.mascotWorld = `${point.x.toFixed(3)},${point.z.toFixed(3)}`;
      gl.domElement.dataset.mascotScreen = `${screen.x.toFixed(3)},${screen.y.toFixed(3)}`;
      gl.domElement.dataset.mascotGait = moving ? 'walk' : 'idle';
    }
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
      <group ref={actor} position={position.current}>
        <ContactShadow position={[0, 0.008, 0]} scale={[0.54, 0.33, 1]} />
        <group
          onClick={(event) => {
            event.stopPropagation();
            wave();
          }}
        >
          {approvedCharacter ? (
            <ApprovedGuide
              path={approvedCharacter}
              state={pose}
              reduced={reduced}
              fallback={standIn}
            />
          ) : (
            standIn
          )}
        </group>
      </group>
      {active && mobile && (
        <mesh
          position={[0, 0.015, (far + near) / 2 + 0.5]}
          rotation-x={-Math.PI / 2}
          onClick={(event) => {
            if (paused) return;
            touchGoal.current = new THREE.Vector2(
              THREE.MathUtils.clamp(event.point.x, -xLimit, xLimit),
              THREE.MathUtils.clamp(event.point.z, far, near),
            );
            invalidate();
          }}
        >
          <planeGeometry args={[3.4, near - far + 2.4]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}
