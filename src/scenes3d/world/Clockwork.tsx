'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { random } from './geometry';

export const clockOrigin = 80;
export const forestArrival = 6.25;

const screenVertex = 'varying vec2 p; void main(){ p=uv-.5; gl_Position=vec4(position.xy,0.,1.); }';
const metal = '#bea471';
const bronze = '#60432b';
const roman = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

function dialArtwork() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const c = canvas.getContext('2d')!;
  c.translate(512, 512);
  const brass = c.createRadialGradient(0, 0, 300, 0, 0, 500);
  brass.addColorStop(0, '#261c18');
  brass.addColorStop(0.48, '#90643c');
  brass.addColorStop(0.74, '#3d2922');
  brass.addColorStop(0.9, '#795232');
  brass.addColorStop(1, '#211614');
  c.fillStyle = brass;
  c.beginPath();
  c.arc(0, 0, 480, 0, Math.PI * 2);
  c.arc(0, 0, 335, 0, Math.PI * 2, true);
  c.fill();
  for (let i = 0; i < 7400; i++) {
    const angle = random(i + 23) * Math.PI * 2;
    const r = 336 + random(i + 5) * 142;
    c.fillStyle = i % 3 ? '#e9b57122' : '#160f0e66';
    c.fillRect(Math.sin(angle) * r, Math.cos(angle) * r, 1 + random(i) * 3, 1);
  }
  c.strokeStyle = '#e8bd79';
  for (const r of [340, 350, 373, 460, 471]) {
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.stroke();
  }
  for (let i = 0; i < 120; i++) {
    c.save();
    c.rotate((i * Math.PI) / 60);
    c.fillStyle = i % 5 ? '#b7956455' : '#e8c880';
    c.fillRect(-1, -456, i % 5 ? 2 : 3, i % 10 ? 9 : 17);
    c.restore();
  }
  c.fillStyle = '#f9da9e';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = '44px Georgia';
  roman.forEach((numeral, i) => {
    const a = (i * Math.PI) / 6;
    c.fillText(numeral, Math.sin(a) * 409, -Math.cos(a) * 409);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function gearGeometry(radius: number, teeth: number, width: number) {
  const shape = new THREE.Shape();
  const bore = new THREE.Path();
  for (let i = 0; i <= teeth * 4; i++) {
    const angle = (i / (teeth * 4)) * Math.PI * 2;
    const outer = radius * (i % 4 === 1 || i % 4 === 2 ? 1 : 0.953);
    const [x, y] = [Math.cos(angle) * outer, Math.sin(angle) * outer];
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  bore.absarc(0, 0, radius - width, 0, Math.PI * 2, true);
  shape.holes.push(bore);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 56,
  });
}

function handGeometry(length: number, width: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.22);
  shape.lineTo(-width, 0.18);
  shape.lineTo(-width * 0.54, length * 0.72);
  shape.lineTo(0, length);
  shape.lineTo(width * 0.54, length * 0.72);
  shape.lineTo(width, 0.18);
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.026,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.012,
    bevelThickness: 0.012,
  });
}

function pageArtwork() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const c = canvas.getContext('2d')!;
  const wash = c.createLinearGradient(0, 0, 256, 320);
  wash.addColorStop(0, '#c2a881');
  wash.addColorStop(0.5, '#f0d9a9');
  wash.addColorStop(1, '#937452');
  c.fillStyle = wash;
  c.fillRect(0, 0, 256, 320);
  c.strokeStyle = '#664e3d';
  c.strokeRect(13, 13, 230, 294);
  for (const r of [29, 43, 62]) {
    c.beginPath();
    c.arc(128, 110, r, 0, Math.PI * 2);
    c.stroke();
  }
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    c.beginPath();
    c.moveTo(128, 110);
    c.lineTo(128 + Math.sin(a) * 61, 110 + Math.cos(a) * 61);
    c.stroke();
    c.fillStyle = '#6b4b3677';
    c.fillRect(34, 181 + i * 8, 140 + random(i) * 44, 1.7);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const dustVertex = `uniform float t; attribute float phase; varying float shine;
void main(){ float a=phase+t*(.36+fract(phase)*.38); vec3 q=position;
float r=length(q.xy); q.xy=vec2(cos(a),sin(a))*r;
vec4 mv=modelViewMatrix*vec4(q,1.); gl_Position=projectionMatrix*mv;
gl_PointSize=clamp((10.+fract(phase)*15.)/max(.4,-mv.z),1.,9.);
shine=.32+.6*pow(.5+.5*sin(phase*5.+t*2.),3.); }`;
const dustFragment = `varying float shine;
void main(){ float d=length(gl_PointCoord-.5); float a=exp(-d*d*46.);
gl_FragColor=vec4(1.,.75,.46,a*shine); }`;

export default function Clockwork({ time, low }: { time: RefObject<number>; low: boolean }) {
  const mechanism = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Mesh>(null);
  const rims = useRef<(THREE.Group | null)[]>([]);
  const hands = useRef<(THREE.Mesh | null)[]>([]);
  const pages = useRef<(THREE.Mesh | null)[]>([]);
  const opening = useRef<THREE.ShaderMaterial>(null);
  const celestial = useRef<THREE.ShaderMaterial>(null);
  const veil = useRef<THREE.ShaderMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const dust = useRef<THREE.ShaderMaterial>(null);
  const tunnel = useRef<THREE.Group>(null);

  const assets = useMemo(() => {
    const dustGeometry = new THREE.BufferGeometry();
    const count = low ? 590 : 1380;
    const points = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 0.7 + random(i + 8) * 3.9;
      points.set([r, 0, 2.8 - random(i + 11) * 35], i * 3);
      phases[i] = random(i + 66) * Math.PI * 2;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    dustGeometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    const trails = Array.from({ length: 6 }, (_, i) => {
      const curve = new THREE.CatmullRomCurve3(
        Array.from({ length: 58 }, (_, j) => {
          const a = j * 0.205 + (i * Math.PI) / 3;
          const r = 2.1 + Math.sin(j * 0.22 + i) * 0.58;
          return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -0.2 - j * 0.49);
        }),
      );
      return new THREE.TubeGeometry(curve, low ? 78 : 118, 0.014, 4, false);
    });
    return {
      dial: dialArtwork(),
      page: pageArtwork(),
      dust: dustGeometry,
      trails,
      gears: [
        gearGeometry(2.42, 72, 0.22),
        gearGeometry(1.71, 54, 0.11),
        gearGeometry(1.38, 42, 0.09),
      ],
      hands: [handGeometry(1.48, 0.081), handGeometry(1.08, 0.12), handGeometry(1.62, 0.036)],
    };
  }, [low]);
  useEffect(
    () => () => {
      assets.dial.dispose();
      assets.page.dispose();
      [assets.dust, ...assets.trails, ...assets.gears, ...assets.hands].forEach((g) => g.dispose());
    },
    [assets],
  );
  const uniforms = useMemo(() => ({ t: { value: 0 } }), []);
  useFrame(() => {
    const t = time.current;
    const { smoothstep } = THREE.MathUtils;
    if (mechanism.current) mechanism.current.visible = t >= 0.45 && t < 3.83;
    if (tunnel.current) tunnel.current.visible = t >= 2.7 && t < forestArrival;
    if (spark.current) {
      spark.current.visible = t < 1.9;
      spark.current.scale.setScalar(0.12 + smoothstep(t, 0, 1.05) * 0.95);
    }
    if (light.current) light.current.intensity = 7 + smoothstep(t, 0.3, 2.2) * 26;
    rims.current.forEach((ring, i) => {
      if (!ring) return;
      ring.rotation.z = t * (i === 1 ? -0.22 : 0.14) * (i + 1);
      if (i > 0) {
        ring.rotation.x = Math.sin(t * 0.51 + i) * 0.45 * (1 - smoothstep(t, 2.5, 3.78));
        ring.rotation.y = Math.cos(t * 0.34 + i) * 0.29 * (1 - smoothstep(t, 2.5, 3.78));
      }
    });
    hands.current.forEach((hand, i) => {
      if (hand) hand.rotation.z = -(t * 0.24 + t * t * t * 0.115) * (i + 1) + i * 2.4;
    });
    pages.current.forEach((page, i) => {
      if (!page) return;
      const a = t * (0.55 + i * 0.067) + i * 2.399;
      const r = 0.95 + (i % 4) * 0.53;
      page.position.set(Math.cos(a) * r, Math.sin(a) * r, -2.1 - i * 2.32 + t * 0.24);
      page.rotation.set(a * 0.48 + i, a * 0.71, a * 0.73);
    });
    if (dust.current) dust.current.uniforms.t.value = t;
    if (opening.current) opening.current.uniforms.t.value = t;
    if (celestial.current) celestial.current.uniforms.t.value = t;
    if (veil.current) veil.current.uniforms.t.value = t;
  });
  return (
    <>
      <mesh frustumCulled={false} renderOrder={-20}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={opening}
          uniforms={uniforms}
          depthTest={false}
          depthWrite={false}
          vertexShader={screenVertex}
          fragmentShader={`uniform float t; varying vec2 p;
          float hash(vec2 p){return fract(sin(dot(p,vec2(41.17,77.29)))*43758.54);}
          float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
            return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
          void main(){if(t>=${forestArrival})discard;
          vec2 q=p*vec2(1.25,1.);
          float r=max(.003,length(q)); float a=atan(q.y,q.x); float inv=log(r);
          float gas=noise(vec2(cos(a),sin(a))*3.+vec2(inv*3.+t*1.8,t*.45));
          float filament=pow(.5+.5*sin(6.*a+11.*inv+t*5.+gas*5.),6.);
          float veil=noise(vec2(cos(a),sin(a))*6.+vec2(inv*4.+t*2.6,0.));
          float center=exp(-r*18.); float edge=smoothstep(.03,.25,r)*exp(-r*1.7);
          vec3 cavern=vec3(.008,.013,.022)+vec3(.06,.24,.27)*edge*(gas+.42*veil)
            + vec3(.31,.16,.065)*filament*edge*veil;
          cavern+=vec3(.46,.65,.58)*center*(.32+smoothstep(4.8,6.02,t)*.66);
          vec3 quiet=vec3(.004,.006,.012)+vec3(.025,.032,.04)*exp(-r*r*11.)*smoothstep(.22,2.,t);
          gl_FragColor=vec4(mix(quiet,cavern,smoothstep(2.58,4.6,t)),1.);}`}
        />
      </mesh>
      <group position={[clockOrigin, 0, 0]}>
        <pointLight ref={light} color="#ffc98c" position={[0.3, 2.5, 4]} distance={13} />
        <pointLight color="#90bbdf" position={[-3, -1, 2]} intensity={13} distance={9} />
        <mesh ref={spark} position={[0, 0, 0.84]}>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={`
            varying vec2 p; void main(){p=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
            fragmentShader={`varying vec2 p;void main(){float r=length(p);float g=exp(-r*19.)*.6;
            g+=exp(-r*95.)*.9 + exp(-abs(p.x)*160.-abs(p.y)*15.)*.32 + exp(-abs(p.y)*160.-abs(p.x)*15.)*.32;
            gl_FragColor=vec4(1.,.79,.45,g);}`}
          />
        </mesh>
        <group ref={mechanism}>
          <mesh position-z={-0.52}>
            <planeGeometry args={[3.24, 3.24]} />
            <shaderMaterial
              ref={celestial}
              uniforms={uniforms}
              transparent
              depthWrite={false}
              vertexShader={`varying vec2 p;void main(){p=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
              fragmentShader={`uniform float t; varying vec2 p;
                float line(float x){return 1.-smoothstep(.002,.006,abs(x));}
                void main(){float r=length(p); float a=atan(p.y,p.x)-t*.14;
                float orbit=line(r-.225)+.65*line(r-.364)+.35*line(r-.14);
                float arms=pow(.5+.5*cos(a*12.+r*5.),32.)*smoothstep(.15,.30,r);
                float rose=line(r-(.18+.095*cos(a*6.)))*.7;
                float jewel=pow(.5+.5*cos(a*12.),46.)*exp(-abs(r-.36)*126.);
                vec3 col=mix(vec3(.025,.072,.083),vec3(.84,.58,.3),clamp((orbit+rose+arms*.22)*.47+jewel,0.,1.));
                col+=vec3(.13,.44,.48)*exp(-r*15.);
                float fade=(1.-smoothstep(.36,.40,r))*(1.-smoothstep(2.32,3.32,t));
                gl_FragColor=vec4(col,fade*.84);}`}
            />
          </mesh>
          {assets.gears.map((g, i) => (
            <group
              key={i}
              position-z={-0.37 + i * 0.095}
              ref={(node) => {
                rims.current[i] = node;
              }}
            >
              <mesh geometry={g}>
                <meshStandardMaterial
                  color={i === 1 ? bronze : metal}
                  metalness={0.71}
                  roughness={0.36}
                />
              </mesh>
              <mesh position-z={0.14}>
                <torusGeometry args={[[2.31, 1.62, 1.34][i], 0.022, 8, 90]} />
                <meshStandardMaterial
                  color="#c4a775"
                  emissive="#ce8744"
                  emissiveIntensity={0.16}
                  metalness={0.58}
                  roughness={0.41}
                />
              </mesh>
              {Array.from({ length: 12 }, (_, j) => {
                const a = (j * Math.PI) / 6;
                const r = [2.34, 1.65, 1.34][i];
                return (
                  <mesh key={j} position={[Math.cos(a) * r, Math.sin(a) * r, 0.14]} rotation-z={a}>
                    <octahedronGeometry args={[i === 0 ? 0.046 : 0.034, 0]} />
                    <meshBasicMaterial color={i === 1 ? '#8bc3c4' : '#e0aa64'} />
                  </mesh>
                );
              })}
            </group>
          ))}
          <mesh position-z={0.18}>
            <planeGeometry args={[4.65, 4.65]} />
            <meshBasicMaterial map={assets.dial} transparent alphaTest={0.45} toneMapped={false} />
          </mesh>
          {assets.hands.map((geometry, i) => (
            <mesh
              key={i}
              geometry={geometry}
              position-z={0.32 + i * 0.035}
              ref={(node) => {
                hands.current[i] = node;
              }}
            >
              <meshStandardMaterial
                color={i === 2 ? '#89674e' : '#e3bd80'}
                emissive="#cb8344"
                emissiveIntensity={0.38}
                metalness={0.64}
                roughness={0.35}
              />
            </mesh>
          ))}
          <mesh position-z={0.42}>
            <sphereGeometry args={[0.14, 18, 12]} />
            <meshStandardMaterial
              color="#eac087"
              emissive="#cc8b44"
              emissiveIntensity={0.55}
              metalness={0.52}
              roughness={0.25}
            />
          </mesh>
        </group>
        <group ref={tunnel}>
          <points geometry={assets.dust} frustumCulled={false}>
            <shaderMaterial
              ref={dust}
              uniforms={uniforms}
              vertexShader={dustVertex}
              fragmentShader={dustFragment}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
          {assets.trails.map((geometry, i) => (
            <mesh key={i} geometry={geometry}>
              <meshBasicMaterial
                color={i % 2 ? '#d89859' : '#79b6c7'}
                transparent
                opacity={i % 2 ? 0.54 : 0.4}
                depthWrite={false}
              />
            </mesh>
          ))}
          {Array.from({ length: low ? 8 : 12 }, (_, i) => (
            <mesh
              key={i}
              ref={(node) => {
                pages.current[i] = node;
              }}
            >
              <planeGeometry args={[0.4, 0.55, 6, 4]} />
              <meshBasicMaterial
                map={assets.page}
                side={THREE.DoubleSide}
                color={i % 2 ? '#d6c5a0' : '#8ea3ac'}
              />
            </mesh>
          ))}
        </group>
      </group>
      <mesh renderOrder={200} frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={veil}
          uniforms={uniforms}
          transparent
          depthTest={false}
          depthWrite={false}
          vertexShader={screenVertex}
          fragmentShader={`uniform float t; varying vec2 p; void main(){
            float d=length(p); float mask=smoothstep(5.6,6.22,t)*(1.-smoothstep(6.28,6.96,t));
            float iris=smoothstep(.27,.79,d);
            vec3 c=mix(vec3(.43,.57,.61),vec3(.105,.2,.23),iris);
            float first=1.-smoothstep(.35,1.65,t);
            gl_FragColor=vec4(mix(c,vec3(.005,.006,.012),first), max(mask, first*.82)*.9995);
          }`}
        />
      </mesh>
    </>
  );
}
