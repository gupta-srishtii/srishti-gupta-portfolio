'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Books, Box, Frame, Lantern, Plant, Rod, palette } from '../Objects';
import Mascot from '../Mascot';
import type { Journey } from '@/lib/journey';
import type { MascotState, RealmId } from '@/data/portfolio';
import {
  branch,
  carvedLegProfile,
  grownTrunk,
  leafGeometry,
  liveEdgeSlab,
  random,
} from './geometry';
import { woodGrain, barkGrain } from '../materials';
import MagicalBook, { type Reading } from './MagicalBook';
import StudioDetails from './StudioDetails';

export function ContactShadow({
  position,
  scale = [1, 1, 1],
}: {
  position: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec2 vUv;void main(){float a=1.-smoothstep(.05,.5,length(vUv-.5));gl_FragColor=vec4(.025,.045,.035,a*a*.6);}`}
      />
    </mesh>
  );
}
function MoonWindow() {
  const glass = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const c = canvas.getContext('2d')!;
    const sky = c.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, '#416b69');
    sky.addColorStop(0.5, '#9da989');
    sky.addColorStop(1, '#d8bb7e');
    c.fillStyle = sky;
    c.fillRect(0, 0, 512, 512);
    c.fillStyle = '#e5ddad';
    c.beginPath();
    c.arc(190, 140, 52, 0, Math.PI * 2);
    c.fill();
    for (let i = 0; i < 18; i++) {
      const x = random(i + 80) * 512;
      c.strokeStyle = i % 2 ? '#34574d88' : '#69816c77';
      c.lineWidth = 4 + random(i) * 12;
      c.beginPath();
      c.moveTo(x, 512);
      c.bezierCurveTo(x - 25, 330, x + 30, 220, x - 20, 110 + random(i) * 100);
      c.stroke();
    }
    for (let i = 0; i < 1400; i++) {
      c.fillStyle = 'rgba(225,216,166,' + random(i) * 0.07 + ')';
      c.fillRect(random(i + 2) * 512, random(i + 3) * 512, 3 + random(i + 4) * 15, 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => glass.dispose(), [glass]);
  return (
    <group position={[0, 2.9, -2.72]}>
      <mesh>
        <circleGeometry args={[1.38, 64]} />
        <meshBasicMaterial map={glass} toneMapped={false} />
      </mesh>
      <mesh position-z={0.03}>
        <ringGeometry args={[1.34, 1.46, 64]} />
        <meshStandardMaterial color="#665239" map={woodGrain} roughness={0.8} />
      </mesh>
      <mesh position-z={0.07}>
        <torusGeometry args={[1.33, 0.025, 8, 64]} />
        <meshStandardMaterial color="#c4a76d" metalness={0.7} roughness={0.35} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <Rod
            key={i}
            from={[Math.sin(a) * 0.28, Math.cos(a) * 0.28, 0.06]}
            to={[Math.sin(a) * 1.32, Math.cos(a) * 1.32, 0.06]}
            radius={0.018}
            color="#92784c"
          />
        );
      })}
      <mesh position-z={0.09}>
        <ringGeometry args={[0.26, 0.29, 48]} />
        <meshStandardMaterial color={palette.gold} metalness={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.73, 0, 0.09]} scale={[0.52, 1, 0.02]}>
            <torusGeometry args={[0.5, 0.018, 6, 40]} />
            <meshStandardMaterial color="#92784c" />
          </mesh>
        </group>
      ))}
      <Box size={[3.2, 0.14, 0.48]} position={[0, -1.48, 0.12]} color={palette.wood} />
    </group>
  );
}
function Armillary({ reduced }: { reduced: boolean }) {
  const rings = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (rings.current && !reduced) rings.current.rotation.y = clock.elapsedTime * 0.13;
  });
  return (
    <group position={[2.5, 2.5, 0.3]} scale={0.55}>
      <group ref={rings}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 0.6, i * 0.7, i * 0.3]}>
            <torusGeometry args={[0.55 + i * 0.09, 0.018, 8, 64]} />
            <meshStandardMaterial color="#b49a5f" metalness={0.75} roughness={0.35} />
          </mesh>
        ))}
      </group>
      <mesh>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial color="#e7d59b" emissive="#c59542" emissiveIntensity={0.6} />
      </mesh>
      <Rod from={[0, -0.7, 0]} to={[0, -1.3, 0]} color={palette.gold} radius={0.03} />
    </group>
  );
}
export default function Studio({
  journey,
  reduced,
  openBook,
  setMascot,
  mascot,
  enterRealm,
  reading = null,
  bloom = false,
}: {
  journey: Journey;
  reduced: boolean;
  openBook: () => void;
  setMascot: (state: MascotState) => void;
  mascot: MascotState;
  enterRealm: (realm: RealmId) => void;
  reading?: Reading;
  bloom?: boolean;
}) {
  const geometry = useMemo(
    () => ({
      desk: liveEdgeSlab(3.5, 1.7, 3),
      tree: grownTrunk(5, 13, 1.65),
      leaf: leafGeometry(),
      arches: [-1, 1].map((s) =>
        branch(
          [
            [s * 4, -0.2, -2.8],
            [s * 3.8, 2.7, -2.7],
            [s * 2.8, 5.7, -2.9],
            [s * 0.36, 7.3, -4.7],
          ],
          0.65,
        ),
      ),
      roots: Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return branch(
          [
            [Math.sin(a) * 0.6, 0.3, -3.5 + Math.cos(a) * 0.6],
            [Math.sin(a) * 2.2, 0.05, -3.5 + Math.cos(a) * 2.2],
            [Math.sin(a) * 4.2, -0.3, -3.5 + Math.cos(a) * 4.2],
          ],
          0.35,
        );
      }),
      roof: branch(
        [
          [-3.5, 4.8, -2.1],
          [0, 6, -2.6],
          [3.5, 4.8, -2.1],
        ],
        0.13,
      ),
    }),
    [],
  );
  useEffect(
    () => () => {
      geometry.desk.dispose();
      geometry.tree.dispose();
      geometry.leaf.dispose();
      geometry.roof.dispose();
      [...geometry.arches, ...geometry.roots].forEach((g) => g.dispose());
    },
    [geometry],
  );
  return (
    <group>
      <mesh geometry={geometry.tree} position={[0, -0.4, -4.5]} castShadow>
        <meshStandardMaterial vertexColors map={barkGrain} roughness={1} />
      </mesh>
      {geometry.arches.map((g, i) => (
        <mesh key={i} geometry={g} castShadow>
          <meshStandardMaterial color="#4d4937" map={barkGrain} roughness={1} />
        </mesh>
      ))}
      {geometry.roots.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color="#414735" map={barkGrain} />
        </mesh>
      ))}
      <mesh position-y={-0.2} scale={[1, 1, 0.91]} receiveShadow>
        <cylinderGeometry args={[4.9, 5.1, 0.35, 64]} />
        <meshStandardMaterial color="#3b3b2a" roughness={1} />
      </mesh>
      {Array.from({ length: 23 }, (_, i) => {
        const z = (i - 11) * 0.37,
          w = Math.sqrt(Math.max(0, 4.8 ** 2 - z * z)) * 2;
        return (
          <Box
            key={i}
            size={[w, 0.065, 0.35]}
            position={[Math.sin(i * 3) * 0.025, 0.005 + random(i) * 0.018, z]}
            color={i % 3 ? '#77654b' : '#665840'}
          />
        );
      })}
      <ContactShadow position={[0, 0.06, 0.65]} scale={[2.3, 1.4, 1]} />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 2.4, 1.3, -2.85]}>
          <Box size={[1.8, 2.5, 0.22]} color="#4e5340" />
          {Array.from({ length: 6 }, (_, i) => (
            <Box
              key={i}
              size={[0.018, 2.4, 0.02]}
              position={[-0.7 + i * 0.28, 0, 0.13]}
              color="#687055"
            />
          ))}
        </group>
      ))}
      <MoonWindow />
      <mesh geometry={geometry.roof}>
        <meshStandardMaterial color="#61523b" map={woodGrain} />
      </mesh>
      <group position={[0, 4.9, -2.4]}>
        {Array.from({ length: 9 }, (_, i) => (
          <group
            key={i}
            position={[(i - 4) * 0.78, Math.sin((i / 8) * Math.PI) * 0.8, -0.1]}
            rotation-z={(i - 4) * -0.07}
          >
            {[0, 1, 2, 3].map((j) => (
              <mesh
                key={j}
                geometry={geometry.leaf}
                rotation={[
                  0.66 + Math.sin(j * 2 + i) * 0.5,
                  j * 0.78 - 1.2,
                  Math.sin(i + j) * 0.48,
                ]}
                scale={[1.55, 1, 1.85]}
              >
                <meshStandardMaterial
                  color={i % 2 ? '#4f6d47' : '#648054'}
                  side={THREE.DoubleSide}
                  roughness={1}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <mesh position={[0, 1.35, 0.55]} geometry={geometry.desk} castShadow receiveShadow>
        <meshStandardMaterial
          color="#8d6e49"
          map={woodGrain}
          bumpMap={woodGrain}
          bumpScale={0.018}
          roughness={0.68}
        />
      </mesh>
      {[-1.4, 1.4].flatMap((x) =>
        [-0.05, 1.15].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.08, z]} castShadow>
            <latheGeometry args={[carvedLegProfile, 20]} />
            <meshStandardMaterial color="#614b34" map={woodGrain} roughness={0.8} />
          </mesh>
        )),
      )}
      <MagicalBook
        open={journey.view === 'book' || journey.view === 'hub'}
        page={journey.page}
        reduced={reduced || Boolean(reading)}
        onClick={openBook}
        enterRealm={enterRealm}
        reading={reading}
        bloom={bloom}
      />
      <Lantern position={[1.22, 1.52, -0.05]} />
      <ContactShadow position={[1.22, 1.52, -0.05]} scale={[0.35, 0.25, 1]} />
      <group position={[1.55, 1.51, 0.5]}>
        <mesh position-y={0.15}>
          <latheGeometry
            args={[
              [
                new THREE.Vector2(0.1, 0),
                new THREE.Vector2(0.12, 0.04),
                new THREE.Vector2(0.095, 0.3),
              ],
              20,
            ]}
          />
          <meshStandardMaterial color="#b0a88b" roughness={0.6} />
        </mesh>
        {Array.from({ length: 6 }, (_, i) => (
          <Rod
            key={i}
            from={[0, 0.12, 0]}
            to={[Math.sin(i) * 0.1, 0.54 + random(i) * 0.15, Math.cos(i) * 0.08]}
            radius={0.012}
            color={i % 2 ? '#aa8959' : '#82514a'}
          />
        ))}
      </group>
      <group position={[-3.1, 0.08, -0.7]} rotation-y={0.55} onClick={() => enterRealm('art')}>
        <Rod from={[-0.5, 0, 0.2]} to={[0, 2.6, 0]} />
        <Rod from={[0.5, 0, 0.2]} to={[0, 2.6, 0]} />
        <Rod from={[0, 2, 0]} to={[0, 0, -0.7]} />
        <Frame position={[0, 1.7, 0.08]} color="#4b6557" onClick={() => enterRealm('art')} />
        <Box size={[1.65, 0.1, 0.32]} position={[0, 0.7, 0.12]} color={palette.wood} />
      </group>
      <group position={[3, 0.1, -1.6]} rotation-y={-0.4} onClick={() => enterRealm('books')}>
        {[0.5, 1.2, 1.9, 2.6].map((y, i) => (
          <group key={y}>
            <Box size={[1.5, 0.075, 0.48]} position-y={y} color={palette.wood} />
            <Books position={[-0.6, y + 0.04, 0]} count={i === 2 ? 4 : 7} />
          </group>
        ))}
        {[-0.76, 0.76].map((x) => (
          <Rod key={x} from={[x, 0, 0.05]} to={[x, 3, 0.05]} radius={0.055} />
        ))}
        <Plant position={[0.3, 2.65, 0]} scale={0.55} />
      </group>
      <Plant position={[-3.7, 0.05, 1.1]} scale={1.3} />
      <Plant position={[3.6, 0.05, 1.4]} scale={1.4} />
      <Plant position={[-1.9, 1.4, -2.5]} scale={0.7} />
      <group position={[1.7, 0.05, 1.9]}>
        <mesh position-y={0.55} castShadow>
          <cylinderGeometry args={[0.36, 0.4, 0.14, 32]} />
          <meshStandardMaterial color="#763b47" roughness={0.91} />
        </mesh>
        <mesh position-y={0.6} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.35, 0.01, 6, 40]} />
          <meshStandardMaterial color="#b78958" roughness={0.65} />
        </mesh>
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <Rod
              key={`${x}:${z}`}
              from={[x * 0.25, 0, z * 0.25]}
              to={[x * 0.2, 0.5, z * 0.2]}
              radius={0.04}
            />
          )),
        )}
      </group>
      <Armillary reduced={reduced} />
      <StudioDetails />
      {journey.view !== 'intro' && journey.view !== 'studio' && (
        <group
          position={[0, 0, 0.45]}
          onClick={() => setMascot('wave')}
          onPointerOver={() => setMascot('wave')}
          onPointerOut={() => setMascot('idle')}
        >
          <Mascot state={mascot} reduced={reduced} />
        </group>
      )}
    </group>
  );
}
