'use client';

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, LoopOnce, type AnimationAction } from 'three';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import type { MascotState } from '@/data/portfolio';

class CharacterBoundary extends Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function RiggedGuide({
  path,
  state,
  reduced,
}: {
  path: string;
  state: MascotState;
  reduced: boolean;
}) {
  const mixerRef = useRef<AnimationMixer | null>(null);
  const previous = useRef<AnimationAction | null>(null);
  const { scene, animations } = useGLTF(path, false, false);
  const model = useMemo(() => clone(scene), [scene]);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const mixer = new AnimationMixer(model);
    mixerRef.current = mixer;
    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      previous.current = null;
      mixerRef.current = null;
    };
  }, [model]);
  useFrame((_, delta) => {
    if (!reduced) mixerRef.current?.update(delta);
  });

  useEffect(() => {
    const name =
      state === 'walk' || state === 'run'
        ? 'Walk'
        : state === 'turn'
          ? 'Turn'
          : state === 'cast'
            ? 'Cast'
            : state === 'wave'
              ? 'Wave'
              : 'Idle';
    const clip =
      animations.find((clip) => clip.name === name) ??
      animations.find((clip) => clip.name === 'Idle');
    if (!clip || !mixerRef.current) return;
    const action = mixerRef.current.clipAction(clip);
    if (previous.current && previous.current !== action) {
      if (reduced) previous.current.stop();
      else previous.current.fadeOut(0.16);
    }
    action.reset();
    if (['Turn', 'Cast', 'Wave'].includes(name)) {
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    action.paused = reduced;
    if (!reduced) action.fadeIn(0.16);
    action.play();
    if (reduced) mixerRef.current.update(0);
    previous.current = action;
    invalidate();
  }, [animations, model, state, reduced, invalidate]);

  return <primitive object={model} />;
}

export default function ApprovedGuide({
  path,
  state,
  reduced,
  fallback,
}: {
  path: string;
  state: MascotState;
  reduced: boolean;
  fallback: ReactNode;
}) {
  return (
    <CharacterBoundary key={path} fallback={fallback}>
      <Suspense fallback={fallback}>
        <RiggedGuide path={path} state={state} reduced={reduced} />
      </Suspense>
    </CharacterBoundary>
  );
}
