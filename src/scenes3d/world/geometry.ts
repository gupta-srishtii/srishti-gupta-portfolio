import * as THREE from 'three';

export function random(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}

/** A curved, fluted trunk with a flared root collar rather than a straight cylinder. */
export function grownTrunk(seed = 1, height = 10, radius = 0.7, segments = 18, rings = 18) {
  const geometry = new THREE.CylinderGeometry(radius * 0.38, radius, height, segments, rings);
  const p = geometry.attributes.position;
  const colors: number[] = [];
  const color = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i),
      t = (y + height / 2) / height;
    const a = Math.atan2(p.getZ(i), p.getX(i));
    const flute = 1 + Math.sin(a * 7 + t * 3 + seed) * 0.09 + Math.pow(1 - t, 8) * 0.65;
    p.setXYZ(
      i,
      p.getX(i) * flute + Math.sin(t * 2.5 + seed) * t * 0.6,
      y + height / 2,
      p.getZ(i) * flute + Math.sin(t * 3) * t * 0.35,
    );
    color.setHSL(
      0.095 + Math.sin(a * 3) * 0.012,
      0.22,
      0.15 + Math.sin(a * 7 + t * 3) * 0.025 + t * 0.025,
    );
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export function leafGeometry() {
  const vertices: number[] = [],
    uv: number[] = [],
    indices: number[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8,
      width = Math.pow(Math.sin(t * Math.PI), 0.85) * 0.24;
    for (let j = -1; j <= 1; j++) {
      vertices.push(j * width, Math.sin(t * Math.PI) * (j === 0 ? 0.08 : -0.015), t);
      uv.push((j + 1) / 2, t);
    }
    if (i < 8)
      for (let j = 0; j < 2; j++) {
        const a = i * 3 + j;
        indices.push(a, a + 3, a + 1, a + 1, a + 3, a + 4);
      }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function branch(points: [number, number, number][], radius: number) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geometry = new THREE.TubeGeometry(curve, 20, radius, 8, false);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = Math.floor(i / 9) / 20,
      center = curve.getPointAt(Math.min(1, t));
    const taper = 1 - t * 0.72;
    p.setXYZ(
      i,
      center.x + (p.getX(i) - center.x) * taper,
      center.y + (p.getY(i) - center.y) * taper,
      center.z + (p.getZ(i) - center.z) * taper,
    );
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function liveEdgeSlab(width: number, depth: number, seed = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -depth / 2);
  for (let i = 0; i <= 12; i++)
    shape.lineTo(-width / 2 + (i / 12) * width, -depth / 2 + Math.sin(i * 1.7 + seed) * 0.045);
  for (let i = 0; i <= 5; i++)
    shape.lineTo(width / 2 + Math.sin(i + seed) * 0.035, -depth / 2 + (i / 5) * depth);
  for (let i = 12; i >= 0; i--)
    shape.lineTo(-width / 2 + (i / 12) * width, depth / 2 + Math.sin(i * 1.8 + seed) * 0.055);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.13,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.025,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export const carvedLegProfile = [
  [0.11, 0],
  [0.14, 0.05],
  [0.08, 0.14],
  [0.07, 0.25],
  [0.1, 0.34],
  [0.065, 0.48],
  [0.055, 0.85],
  [0.12, 1.05],
  [0.1, 1.24],
].map((p) => new THREE.Vector2(...(p as [number, number])));
