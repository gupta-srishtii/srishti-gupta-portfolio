'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { branch } from './geometry';
import { random } from './geometry';

export default function BookBloom({ open, reduced }: { open: boolean; reduced: boolean }) {
  const root = useRef<THREE.Group>(null),
    time = useRef(0),
    last = useRef(false);
  const sketches = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 320;
        const c = canvas.getContext('2d')!;
        c.fillStyle = '#e4d8ac';
        c.fillRect(0, 0, 256, 320);
        c.strokeStyle = ['#76565d', '#526b59', '#716549'][i % 3];
        c.lineWidth = 2;
        c.beginPath();
        c.arc(128, 140, 65, 0, Math.PI * 2);
        c.stroke();
        c.strokeRect(56, 70, 144, 140);
        c.beginPath();
        c.moveTo(30, 240);
        c.bezierCurveTo(120, 120, 160, 280, 226, 30);
        c.stroke();
        for (let j = 0; j < 4; j++) c.fillRect(30, 270 + j * 8, 100 + (j % 2) * 60, 1);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      }),
    [],
  );
  const trails = useMemo(
    () =>
      [0, 1, 2].map((i) =>
        branch(
          Array.from({ length: 12 }, (_, j) => {
            const a = j * 0.45 + i * 2;
            return [Math.sin(a) * (0.3 + j * 0.09), j * 0.12, Math.cos(a) * (0.3 + j * 0.09)] as [
              number,
              number,
              number,
            ];
          }),
          0.006,
        ),
      ),
    [],
  );
  const particles = useMemo(() => {
    const g = new THREE.BufferGeometry(),
      positions = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++)
      positions.set([(random(i) - 0.5) * 2.6, random(i + 1) * 2, (random(i + 2) - 0.5) * 2], i * 3);
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  const wing = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 0, 0, -0.4, 0.08, 0.1, -0.12, 0.02, -0.23], 3),
    );
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(
    () => () => {
      sketches.forEach((t) => t.dispose());
      trails.forEach((g) => g.dispose());
      particles.dispose();
      wing.dispose();
    },
    [sketches, trails, particles, wing],
  );
  useFrame((_, dt) => {
    if (last.current !== open) {
      last.current = open;
      time.current = 0;
    }
    time.current += dt;
    if (!root.current) return;
    const t = time.current,
      appear = THREE.MathUtils.smoothstep(t, 1.65, 2.9),
      settle = 1 - THREE.MathUtils.smoothstep(t, 5.1, 7.5);
    root.current.visible = open && !reduced && appear * settle > 0.001;
    root.current.rotation.y = appear * 0.2 + t * 0.17;
    root.current.children.forEach((child, i) => {
      const delay = (i % 5) * 0.13;
      const rise = THREE.MathUtils.smoothstep(t, 1.65 + delay, 3.12 + delay);
      const scale = Math.max(0.001, rise * settle);
      child.scale.setScalar(scale);
      if (child.userData.floats) {
        child.position.y = (child.userData.baseY + Math.sin(t * 1.7 + i) * 0.11) * scale;
        child.rotation.x = Math.sin(t * 1.35 + i) * 0.23;
      }
      if (child.name === 'paper-bird') {
        child.rotation.z = Math.sin(t * 1.2) * 0.12;
        child.children.forEach(
          (part, j) => (part.rotation.z = Math.sin(t * 3 + j * Math.PI) * 0.22),
        );
      }
    });
  });
  return (
    <group ref={root} position={[-0.5, 0.25, 0]}>
      <points geometry={particles}>
        <pointsMaterial color="#ebd79a" size={0.018} transparent opacity={0.8} depthWrite={false} />
      </points>
      <group
        name="paper-bird"
        position={[-0.8, 1.7, 0.3]}
        userData={{ floats: true, baseY: 1.7 }}
        rotation-y={0.5}
      >
        {[-1, 1].map((s) => (
          <mesh key={s} geometry={wing} scale={[s, 1, 1]}>
            <meshStandardMaterial color="#e6d5ad" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {sketches.map((texture, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 1.05, 0.7 + i * 0.13, Math.cos(a) * 0.8]}
            rotation={[-0.2, a * 0.3, Math.sin(a) * 0.25]}
            userData={{ floats: true, baseY: 0.7 + i * 0.13 }}
          >
            <planeGeometry args={[0.46, 0.6]} />
            <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {trails.map((g, i) => (
        <mesh key={i} geometry={g}>
          <shaderMaterial
            transparent
            depthWrite={false}
            uniforms={{ tint: { value: new THREE.Color(['#f7cf80', '#c297bf', '#87bba4'][i]) } }}
            vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }"
            fragmentShader="uniform vec3 tint; varying vec2 vUv; void main() { float feather = sin(vUv.x * 3.14159); gl_FragColor = vec4(tint, feather * .86); }"
          />
        </mesh>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 2.4) * 1.25, 0.62 + i * 0.16, Math.cos(i * 2.4) * 0.86]}
          rotation-z={i * 0.72}
          userData={{ floats: true, baseY: 0.62 + i * 0.16 }}
        >
          <octahedronGeometry args={[0.036, 0]} />
          <meshBasicMaterial color={i % 2 ? '#f8e5bb' : '#d9b8dc'} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          position={[Math.sin(i * 2.1) * 0.8, 1.3, Math.cos(i * 2.1) * 0.8]}
          rotation={[0.3, i * 0.8, 0.5]}
          userData={{ floats: true, baseY: 1.3 }}
        >
          <mesh>
            <cylinderGeometry args={[0.016, 0.016, 0.7, 8]} />
            <meshStandardMaterial color={['#8a394b', '#b59b61', '#668978'][i]} />
          </mesh>
          <mesh position-y={0.4}>
            <coneGeometry args={[0.016, 0.1, 8]} />
            <meshStandardMaterial color="#e6d5a5" />
          </mesh>
        </group>
      ))}
      <group position={[0, 1.8, 0]} userData={{ floats: true, baseY: 1.8 }}>
        <mesh rotation={[0.5, 0.4, 0.5]}>
          <icosahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#c0b384" wireframe />
        </mesh>
        <mesh rotation-x={1.1}>
          <torusGeometry args={[0.32, 0.008, 6, 40]} />
          <meshBasicMaterial color="#e6cc8a" />
        </mesh>
      </group>
    </group>
  );
}
