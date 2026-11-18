import * as THREE from 'three';

// Small deterministic textures: no external downloads or private source assets.
function grain(bark: boolean) {
  const size = 128,
    pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const n = Math.sin(x * 13.13 + y * 37.7) * 43758.545;
      const noise = n - Math.floor(n);
      const wave = Math.sin((bark ? x : y) * 0.7 + Math.sin((bark ? y : x) * 0.05) * 1.7);
      const value = Math.round(220 + wave * (bark ? 17 : 9) + noise * 9);
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
