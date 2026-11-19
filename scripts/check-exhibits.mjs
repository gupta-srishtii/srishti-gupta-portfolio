import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('src/data/approved-content.json', root), 'utf8'));
const media = await realpath(new URL('public', root));
const ids = new Set(['numerical-area-volume']);
const urls = new Set([
  'github.com/gupta-srishtii/area-and-volume',
  'github.com/gupta-srishtii/cm-pbl',
]);
const categories = new Set(['design', 'ux', 'art', 'books', 'honors', 'gifts', 'motion']);
const counts = new Map();
const artHashes = new Set();
const titles = new Set(['numericalareaandvolumecalculator']);

async function verifyAsset(path, extensions, category) {
  if (
    typeof path !== 'string' ||
    !path.startsWith('/exhibits/') ||
    !/^\/exhibits\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.[a-z0-9]+$/.test(path) ||
    !extensions.some((ext) => path.endsWith(ext))
  )
    throw new Error(`Invalid ${category} asset path: ${path}`);
  const absolute = await realpath(resolve(media, '.' + path));
  if (!absolute.startsWith(resolve(media, 'exhibits') + sep) || !(await stat(absolute)).isFile()) {
    throw new Error(`Asset does not point to a public exhibits file: ${path}`);
  }
  return absolute;
}

function urlKey(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password)
    throw new Error(`Use a public HTTPS URL: ${value}`);
  const path = url.pathname.replace(/(\.git)?\/$|\.git$/i, '');
  return (url.hostname + path).toLowerCase();
}

for (const exhibit of catalog.exhibits) {
  const {
    id,
    realm,
    title,
    description,
    image,
    imageAlt,
    video,
    captions,
    url,
    sourceLinks,
    tools,
    process,
  } = exhibit;
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id))
    throw new Error(`Duplicate or invalid ID: ${id}`);
  if (!categories.has(realm) || !title?.trim() || !description?.trim())
    throw new Error(`Invalid exhibit: ${id}`);
  const normalizedTitle = title
    .normalize('NFKD')
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^\p{Letter}\p{Number}]/gu, '');
  if (!normalizedTitle || titles.has(normalizedTitle))
    throw new Error(`Duplicate exhibit title: ${title}`);
  titles.add(normalizedTitle);
  if (
    (tools && (!Array.isArray(tools) || tools.some((tool) => typeof tool !== 'string'))) ||
    (process && typeof process !== 'string')
  )
    throw new Error(`Invalid case-study details for ${id}`);
  ids.add(id);
  const room = realm === 'gifts' ? 'honors' : realm;
  counts.set(room, (counts.get(room) ?? 0) + 1);
  if (counts.get(room) > 3)
    throw new Error(
      `The ${room} room has three physical bays. Select three approved exhibits for this edition.`,
    );
  if (image) {
    const filename = await verifyAsset(image, ['.webp', '.avif', '.jpg', '.png'], 'image');
    const hash = createHash('sha256')
      .update(await readFile(filename))
      .digest('hex');
    if (artHashes.has(hash))
      throw new Error(`This artwork already appears in an exhibit: ${image}`);
    artHashes.add(hash);
    if (!imageAlt?.trim()) throw new Error(`Add imageAlt for ${id}`);
  }
  if (['design', 'ux', 'art'].includes(realm) && !image)
    throw new Error(`Add approved artwork for ${id}`);
  if (video) {
    if (realm !== 'motion') throw new Error(`Video belongs in the film room: ${id}`);
    await verifyAsset(video, ['.webm', '.mp4'], 'video');
  }
  if (captions) {
    if (!video) throw new Error(`Captions need a video: ${id}`);
    await verifyAsset(captions, ['.vtt'], 'captions');
  }
  for (const link of [...(url ? [url] : []), ...(sourceLinks ?? []).map((link) => link.url)]) {
    const key = urlKey(link);
    if (urls.has(key)) throw new Error(`This project URL is already represented: ${link}`);
    urls.add(key);
  }
}
if (catalog.character) {
  const filename = await verifyAsset(catalog.character, ['.glb'], 'character');
  const bin = await readFile(filename);
  if (
    bin.length < 20 ||
    bin.toString('ascii', 0, 4) !== 'glTF' ||
    bin.readUInt32LE(4) !== 2 ||
    bin.readUInt32LE(8) !== bin.length ||
    bin.toString('ascii', 16, 20) !== 'JSON'
  ) {
    throw new Error('Expected a self-contained glTF 2.0 binary character.');
  }
  const model = JSON.parse(bin.toString('utf8', 20, 20 + bin.readUInt32LE(12)));
  const clips = new Set(model.animations?.map((animation) => animation.name));
  if (
    !model.skins?.length ||
    !['Idle', 'Walk', 'Turn', 'Cast'].every((clip) => clips.has(clip)) ||
    [...(model.images ?? []), ...(model.buffers ?? [])].some((part) => part.uri)
  ) {
    throw new Error(
      'Character GLB must embed its assets, include skinning, and export Idle, Walk, Turn and Cast.',
    );
  }
}
if (catalog.profile.resume) await verifyAsset(catalog.profile.resume, ['.pdf'], 'résumé');
if (catalog.profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(catalog.profile.email))
  throw new Error('Invalid public contact email');
console.log(`Validated ${catalog.exhibits.length} approved exhibit records.`);
