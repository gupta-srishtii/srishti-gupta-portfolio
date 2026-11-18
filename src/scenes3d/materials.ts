import * as THREE from 'three';

// Small deterministic textures: no external downloads or private source assets.
function grain(bark: boolean) {
  const size = 256,
    pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const n = Math.sin(x * 13.13 + y * 37.7) * 43758.545;
      const noise = n - Math.floor(n);
      const across = ((bark ? x : y) / size) * Math.PI * 2;
      const along = ((bark ? y : x) / size) * Math.PI * 2;
      const warp = Math.sin(along + 3 * across) * 0.19 + Math.sin(along * 2 - across) * 0.08;
      const fiber = across + warp;
      const rings = Math.sin(fiber * 19 + Math.sin(across * 5) * 1.2);
      const pores = Math.pow(Math.max(0, Math.sin(fiber * 53)), 8);
      const value = Math.round(214 + rings * (bark ? 23 : 14) - pores * 22 + noise * 13);
      const offset = (y * size + x) * 4;
      pixels[offset] = value;
      pixels[offset + 1] = value;
      pixels[offset + 2] = value;
      pixels[offset + 3] = 255;
    }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
// Shared for the lifetime of the scene module, rather than one texture per mesh.
export const woodGrain = grain(false);
export const barkGrain = grain(true);
