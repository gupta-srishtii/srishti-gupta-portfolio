'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { chapters } from '@/data/chapters';
import { entries, profile, type RealmId } from '@/data/portfolio';
import { Box, palette } from '../Objects';
import { random } from './geometry';
import BookBloom from './BookBloom';

export type Reading = 'about' | 'resume' | 'contact' | null;
function study(c: CanvasRenderingContext2D, page: number) {
  c.save();
  c.translate(380, page === 4 ? 680 : 610);
  if (page === 4) c.scale(0.8, 0.8);
  c.lineWidth = 2;
  c.strokeStyle = '#7f8061';
  c.fillStyle = '#7f8061';
  if (page === 0) {
    c.strokeRect(-165, -130, 190, 250);
    c.strokeRect(45, -130, 125, 110);
    c.strokeRect(45, 0, 125, 120);
    c.font = '78px Georgia';
    c.fillText('Aa', -145, -35);
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.moveTo(-145, 10 + i * 17);
      c.lineTo(-10 - (i % 2) * 35, 10 + i * 17);
      c.stroke();
    }
  } else if (page === 1) {
    const nodes = [
      [-145, -80],
      [-145, 80],
      [0, 0],
      [145, -80],
      [145, 80],
    ];
    for (const [x, y] of nodes) {
      c.beginPath();
      c.arc(x, y, 28, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(x + (x < 0 ? 28 : -28), y);
      c.lineTo(0, 0);
      c.stroke();
    }
    c.font = '35px monospace';
    c.fillText('{ }', -30, 155);
  } else if (page === 2) {
    c.beginPath();
    c.ellipse(0, 30, 150, 95, -0.2, 0, Math.PI * 2);
    c.stroke();
    ['#a47c7b', '#89946a', '#bca276', '#7a9592'].forEach((color, i) => {
      c.fillStyle = color;
      c.beginPath();
      c.arc(-90 + i * 55, 40 + (i % 2) * 20, 15, 0, Math.PI * 2);
      c.fill();
    });
    c.strokeRect(-15, -145, 15, 140);
    c.strokeRect(30, -120, 12, 110);
  } else if (page === 3) {
    c.beginPath();
    c.moveTo(0, 100);
    c.lineTo(-150, 55);
    c.lineTo(-150, -120);
    c.quadraticCurveTo(-60, -125, 0, -65);
    c.quadraticCurveTo(60, -125, 150, -120);
    c.lineTo(150, 55);
    c.closePath();
    c.moveTo(0, -65);
    c.lineTo(0, 100);
    c.stroke();
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.moveTo(-120, -75 + i * 26);
      c.lineTo(-30, -40 + i * 26);
      c.stroke();
    }
  } else if (page === 4) {
    c.strokeRect(-140, -90, 280, 220);
    c.strokeRect(-155, -115, 310, 45);
    c.strokeRect(-12, -90, 24, 220);
    c.beginPath();
    c.ellipse(-45, -145, 50, 24, 0.4, 0, Math.PI * 2);
    c.ellipse(45, -145, 50, 24, -0.4, 0, Math.PI * 2);
    c.stroke();
  } else {
    c.strokeRect(-165, -110, 330, 220);
    for (let i = 0; i < 7; i++) {
      c.strokeRect(-150 + i * 45, -98, 20, 13);
      c.strokeRect(-150 + i * 45, 85, 20, 13);
    }
    c.beginPath();
    c.moveTo(-35, -55);
    c.lineTo(65, 0);
    c.lineTo(-35, 55);
    c.closePath();
    c.stroke();
  }
  c.restore();
}
function lines(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line.trim(), x, y);
      line = word + ' ';
      y += lineHeight;
    } else line = test;
  }
  context.fillText(line.trim(), x, y);
  return y + lineHeight;
}
function paper(page: number, side: 0 | 1, reading: Reading) {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 1024;
  const c = canvas.getContext('2d')!;
  c.fillStyle = '#eee4bf';
  c.fillRect(0, 0, 768, 1024);
  for (let i = 0; i < 4500; i++) {
    c.fillStyle = 'rgba(109,83,48,' + random(i) * 0.035 + ')';
    c.fillRect(random(i + 1) * 768, random(i + 2) * 1024, 1 + random(i + 3) * 9, 1);
  }
  const shade = c.createLinearGradient(0, 0, 768, 0);
  shade.addColorStop(0, side === 1 ? '#6b542b33' : '#fdf7df00');
  shade.addColorStop(0.12, '#fdf7df00');
  shade.addColorStop(0.9, '#fdf7df00');
  shade.addColorStop(1, side === 0 ? '#6b542b44' : '#fdf7df00');
  c.fillStyle = shade;
  c.fillRect(0, 0, 768, 1024);
  c.strokeStyle = '#9a8457';
  c.lineWidth = 1;
  c.strokeRect(45, 45, 678, 934);
  c.fillStyle = '#7e714f';
  c.font = '18px Georgia';
  c.fillText('SRISHTI’S FIELD NOTES', 80, 96);
  const chapter = chapters[page];
  c.fillStyle = '#33493c';
  c.font = 'italic 25px Georgia';
  c.fillText(
    reading ? 'A PERSONAL CHAPTER' : 'CHAPTER ' + String(page + 1).padStart(2, '0') + ' / 06',
    80,
    162,
  );
  c.font = page === 4 && !reading ? '38px Georgia' : '52px Georgia';
  const title = reading
    ? {
        about: 'Hello, I’m Srishti.',
        resume: 'The professional chapter',
        contact: 'Let’s create together.',
      }[reading]
    : side === 0
      ? 'Chapter Notes'
      : chapter.title;
  let y = lines(c, title, 80, 240, 600, 63) + 30;
  c.fillStyle = '#756750';
  c.font = 'italic 26px Georgia';
  y = lines(c, reading ? profile.title : chapter.line, 80, y, 595, 38) + 40;
  if (reading) {
    c.font = '30px Georgia';
    c.fillStyle = '#33493c';
    const text =
      reading === 'about'
        ? profile.bio
        : reading === 'resume'
          ? profile.resume
            ? 'A printable resume is ready. Use the download link below the book.'
            : 'The resume is being prepared. No PDF or verified education and experience timeline has been supplied yet.'
          : profile.email
            ? 'Write to ' + profile.email
            : 'Contact details are coming soon. A verified email address and social links will appear here when supplied.';
    lines(c, text, 80, y, 590, 42);
    if (side === 1) {
      c.font = 'italic 25px Georgia';
      lines(
        c,
        reading === 'about'
          ? 'Code, art, movement, and the pleasure of making things.'
          : 'This page is waiting for verified details.',
        80,
        690,
        580,
        40,
      );
    }
  } else if (side === 0) {
    study(c, page);
    c.font = 'italic 22px Georgia';
    c.fillText('a little logic, a little imagination', 170, 850);
  } else {
    const works = entries.filter(
      (e) => e.realm === chapter.realm || (page === 4 && e.realm === 'gifts'),
    );
    c.font = '28px Georgia';
    c.fillStyle = '#33493c';
    if (works.length) {
      for (const work of works.slice(0, 3)) {
        y = lines(c, work.title, 80, y, 580, 40) + 15;
        c.font = '22px Georgia';
        y = lines(c, work.description, 80, y, 580, 32) + 25;
        c.font = '28px Georgia';
      }
    } else {
      c.font = '32px Georgia';
      y = lines(c, 'An exhibition in the making', 80, y, 580, 43) + 25;
      c.font = '30px Georgia';
      lines(
        c,
        'Real work and its stories will be added here. The world is ready to explore.',
        80,
        y,
        580,
        37,
      );
    }
    c.fillStyle = '#53654a';
    c.fillRect(80, 820, 608, 2);
    c.font = '25px Georgia';
    c.fillText('ENTER THIS WORLD', 100, 883);
    c.fillText('↗', 625, 883);
  }
  c.fillStyle = '#95805c';
  c.font = '19px Georgia';
  c.fillText(String(page * 2 + side + 1).padStart(2, '0'), 370, 945);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
export default function MagicalBook({
  open,
  page,
  reduced,
  onClick,
  enterRealm,
  reading = null,
  bloom = false,
}: {
  open: boolean;
  page: number;
  reduced: boolean;
  onClick: () => void;
  enterRealm: (realm: RealmId) => void;
  reading?: Reading;
  bloom?: boolean;
}) {
  const lid = useRef<THREE.Group>(null),
    sheet = useRef<THREE.Mesh>(null),
    pageMaterial = useRef<THREE.MeshLambertMaterial>(null),
    cover = useRef<THREE.MeshStandardMaterial>(null),
    seal = useRef<THREE.MeshStandardMaterial>(null),
    seam = useRef<THREE.MeshBasicMaterial>(null),
    bookLight = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);
  useCursor(hover);
  const time = useRef(0),
    turn = useRef(1),
    previous = useRef(page),
    direction = useRef(1),
    wasOpen = useRef(false);
  const outgoing = useRef<THREE.Texture | null>(null);
  const textures = useMemo(() => {
    if (!open) return [];
    const left = paper(page, 0, reading);
    const verso = left.clone();
    verso.repeat.x = -1;
    verso.offset.x = 1;
    verso.needsUpdate = true;
    return [left, paper(page, 1, reading), verso];
  }, [open, page, reading]);
  useEffect(() => () => textures.forEach((texture) => texture.dispose()), [textures]);
  useEffect(() => () => outgoing.current?.dispose(), []);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.1, 1.48, 24, 4);
    g.rotateX(-Math.PI / 2);
    g.translate(0.55, 0, 0);
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (open !== wasOpen.current) {
      time.current = 0;
      wasOpen.current = open;
    }
    time.current += dt;
    if (previous.current !== page) {
      direction.current = (page - previous.current + 6) % 6 === 1 ? 1 : -1;
      if (sheet.current && open && !reduced) {
        outgoing.current?.dispose();
        outgoing.current = direction.current > 0 ? paper(previous.current, 1, reading) : null;
        const material = sheet.current.material as THREE.MeshLambertMaterial;
        material.map = outgoing.current ?? textures[1];
        material.needsUpdate = true;
      }
      previous.current = page;
      turn.current = 0;
    }
    turn.current = reduced ? 1 : Math.min(1, turn.current + dt * 1.25);
    if (outgoing.current && (!open || turn.current === 1)) {
      if (sheet.current) {
        const material = sheet.current.material as THREE.MeshLambertMaterial;
        material.map = textures[1] ?? null;
        material.needsUpdate = true;
      }
      outgoing.current.dispose();
      outgoing.current = null;
    }
    const phase = THREE.MathUtils.smoothstep(turn.current, 0, 1);
    const charge =
      open && bloom && !reduced
        ? THREE.MathUtils.smoothstep(time.current, 0.22, 1.4) *
          (1 - THREE.MathUtils.smoothstep(time.current, 3, 6.8))
        : 0;
    if (seal.current) seal.current.emissiveIntensity = (hover ? 0.32 : 0.07) + charge * 1.9;
    if (seam.current) seam.current.opacity = charge * 0.92;
    if (bookLight.current) bookLight.current.intensity = charge * 3.4;
    const delay = reduced ? 0 : 1.1,
      opening =
        reduced || !bloom
          ? open
            ? 1
            : 0
          : open
            ? THREE.MathUtils.smoothstep(time.current, delay, delay + 1.7)
            : 0;
    if (lid.current)
      lid.current.rotation.z =
        reduced || !bloom
          ? opening * Math.PI * 1.035
          : THREE.MathUtils.damp(
              lid.current.rotation.z,
              opening * Math.PI * 1.035,
              reduced ? 100 : 5,
              dt,
            );
    if (cover.current)
      cover.current.emissiveIntensity = hover
        ? 0.18
        : open
          ? Math.sin(opening * Math.PI) * 0.35
          : 0;
    if (sheet.current) {
      sheet.current.visible = open && turn.current < 1;
      if (sheet.current.visible) {
        sheet.current.rotation.z = Math.PI * (direction.current > 0 ? phase : 1 - phase);
        const p = sheet.current.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const across = (i % 25) / 24;
          const curl = Math.sin(phase * Math.PI) * across * across;
          p.setX(i, across * 1.1 - curl * 0.14);
          p.setY(i, curl * (0.25 + p.getZ(i) * 0.12) * direction.current);
        }
        p.needsUpdate = true;
        sheet.current.geometry.computeVertexNormals();
      }
    }
    if (pageMaterial.current) pageMaterial.current.opacity = open ? opening : 0;
  });
  return (
    <group
      position={[0, 1.55, 0.55]}
      rotation-y={-0.1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <RoundedBox
        args={[1.24, 0.1, 1.62]}
        radius={0.045}
        onClick={(event) => {
          event.stopPropagation();
          if (!open) onClick();
        }}
      >
        <meshStandardMaterial color="#622335" roughness={0.8} />
      </RoundedBox>
      <Box size={[1.13, 0.1, 1.49]} position-y={0.08} color="#d0bc8c" />
      {[0.044, 0.057, 0.072, 0.091, 0.105, 0.118].map((y) => (
        <mesh key={y} position={[0, y, 0.749]}>
          <planeGeometry args={[1.11, 0.003]} />
          <meshBasicMaterial color="#9b7e56" transparent opacity={0.56} />
        </mesh>
      ))}
      <mesh position={[0, 0.132, 0.751]}>
        <planeGeometry args={[1.12, 0.012]} />
        <meshBasicMaterial ref={seam} color="#ffdaa0" transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight
        ref={bookLight}
        position={[0, 0.28, 0.21]}
        color="#ffbd67"
        distance={2.4}
        intensity={0}
      />
      {open && (
        <mesh
          position={[0, 0.138, 0]}
          rotation-x={-Math.PI / 2}
          onClick={(e) => {
            e.stopPropagation();
            if (open && !reading) enterRealm(chapters[page].realm);
          }}
          receiveShadow
        >
          <planeGeometry args={[1.1, 1.48]} />
          <meshLambertMaterial ref={pageMaterial} map={textures[1]} transparent color="#c6c0b0" />
        </mesh>
      )}
      {open && (
        <>
          <Box size={[1.14, 0.045, 1.53]} position={[-1.18, 0.022, 0]} color="#743047" />
        </>
      )}
      <group
        ref={lid}
        position={[-0.61, 0.14, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (!open) onClick();
        }}
      >
        {open && (
          <mesh position={[0.62, -0.036, 0]} rotation={[Math.PI / 2, 0, Math.PI]} receiveShadow>
            <planeGeometry args={[1.1, 1.48]} />
            <meshLambertMaterial map={textures[0]} color="#c6c0b0" />
          </mesh>
        )}
        <RoundedBox args={[1.24, 0.055, 1.62]} radius={0.025} position-x={0.62}>
          <meshStandardMaterial ref={cover} color="#6e2439" emissive="#d3a55b" roughness={0.7} />
        </RoundedBox>
        <Box size={[1.04, 0.008, 1.4]} position={[0.62, 0.033, 0]} color="#b79a5b" />
        <Box size={[1, 0.01, 1.36]} position={[0.62, 0.04, 0]} color="#6e2439" />
        <group position={[0.62, 0.05, 0]} rotation-x={-Math.PI / 2}>
          <mesh>
            <torusGeometry args={[0.24, 0.007, 6, 64]} />
            <meshStandardMaterial
              ref={seal}
              color={palette.gold}
              emissive="#eda34c"
              metalness={0.55}
              roughness={0.35}
            />
          </mesh>
          <mesh rotation-z={Math.PI / 4}>
            <ringGeometry args={[0.13, 0.14, 4]} />
            <meshStandardMaterial color={palette.gold} />
          </mesh>
        </group>
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <mesh
              key={String(x) + z}
              position={[0.62 + x * 0.48, 0.047, z * 0.64]}
              rotation-x={-Math.PI / 2}
            >
              <circleGeometry args={[0.035, 12]} />
              <meshStandardMaterial color={palette.gold} metalness={0.7} />
            </mesh>
          )),
        )}
      </group>
      {open && (
        <mesh ref={sheet} geometry={geometry} position={[-0.58, 0.15, 0]} castShadow>
          <meshLambertMaterial map={textures[1]} side={THREE.FrontSide} color="#c6c0b0" />
          <mesh geometry={geometry}>
            <meshLambertMaterial map={textures[2]} side={THREE.BackSide} color="#c6c0b0" />
          </mesh>
        </mesh>
      )}
      <BookBloom open={open && bloom} reduced={reduced} />
    </group>
  );
}
