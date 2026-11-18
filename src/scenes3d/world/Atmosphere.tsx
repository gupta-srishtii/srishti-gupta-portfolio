'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { random } from './geometry';

const vertex = `uniform float time; uniform float pixelRatio; attribute float phase; varying float glow;
void main(){vec3 p=position; p.x+=sin(time*.24+phase)*.32; p.y+=sin(time*.4+phase*2.)*.28; p.z+=cos(time*.2+phase)*.25; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; glow=.4+.6*pow(.5+.5*sin(time*1.1+phase),3.); gl_PointSize=min(15.,(35.+phase*2.)*pixelRatio/max(1.,-mv.z));}`;
const fragment = `varying float glow; void main(){float d=length(gl_PointCoord-.5)*2.; float core=exp(-d*d*25.); float halo=exp(-d*d*4.)*.2; gl_FragColor=vec4(vec3(1.,.82,.41),(core+halo)*glow);}`;
export default function Atmosphere({ reduced, low }: { reduced: boolean; low: boolean }) {
  const fireflies = useRef<THREE.ShaderMaterial>(null),
    haze = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const count = low ? 65 : 140,
      positions = new Float32Array(count * 3),
      phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions.set(
        [(random(i + 3) - 0.5) * 22, 0.2 + random(i + 4) * 6, (random(i + 5) - 0.5) * 16],
        i * 3,
      );
      phases[i] = random(i + 6) * 6.28;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    return g;
  }, [low]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const uniforms = useMemo(
    () => ({ time: { value: 0 }, pixelRatio: { value: low ? 1 : 1.5 } }),
    [low],
  );
  const mistUniforms = useMemo(() => ({ time: { value: 0 } }), []);
  useFrame(({ clock }) => {
    if (!reduced) {
      if (fireflies.current) fireflies.current.uniforms.time.value = clock.elapsedTime;
      if (haze.current) haze.current.uniforms.time.value = clock.elapsedTime;
    }
  });
  return (
    <group>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={fireflies}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh position={[0, 0.2, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[45, 45]} />
        <shaderMaterial
          ref={haze}
          uniforms={mistUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
          fragmentShader={`uniform float time;varying vec2 vUv;void main(){vec2 p=vUv*14.;float w=sin(p.x+time*.025)*sin(p.y*.7+p.x*.3)+sin(p.y*1.4-time*.04)*.5;float edge=1.-smoothstep(.2,.55,length(vUv-.5));gl_FragColor=vec4(.34,.51,.46,smoothstep(-.3,1.5,w)*edge*.14);}`}
        />
      </mesh>
      {[
        [-3, 6, -2],
        [3, 7, -3],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation-z={i ? -0.42 : 0.42}>
          <coneGeometry args={[1.6, 11, 24, 1, true]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            vertexShader={`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
            fragmentShader={`varying vec2 vUv;void main(){float edge=pow(sin(vUv.x*3.14159),5.);float fade=sin(vUv.y*3.14159);gl_FragColor=vec4(.45,.62,.73,edge*fade*.026);}`}
          />
        </mesh>
      ))}
      <mesh position={[-5, 8, -15]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial color="#d6dfce" />
      </mesh>
    </group>
  );
}
