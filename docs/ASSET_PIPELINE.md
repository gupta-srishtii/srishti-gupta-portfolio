# Approved media and character assets

Media under `public/exhibits/` is public. Only place files cleared for publication in that directory. The application never searches the private references or the raw asset folders.

1. Copy an approved image or film into `public/exhibits/` under a lowercase filename. Keep the artwork's original aspect ratio. WebP or AVIF is recommended for images. Use an MP4 or WebM file that plays in target browsers.
2. Append a record to `exhibits` in `src/data/approved-content.json`. Required fields are `id`, `realm`, `title` and `description`. Use `design` for posters and graphic design, `ux` for interface work, `art` for paintings, `books` for writing and reading, `honors` or `gifts` for the archive, and `motion` for film. Each room has three physical bays.
3. For art use `image` and `imageAlt`. Optional fields include `medium`, `year`, `process`, `tools` and a public HTTPS `url`. For playback use `video` and an optional `captions` WebVTT path. A prototype can link out from the UI/UX detail view. Keep technical project attribution and aliases in the audited source records.
4. Run `npm.cmd run validate:assets`, then review the work in the 3D room and its inspection view before committing. The validator also runs before production builds. It checks existence, real paths, safe public paths, text alternatives, duplicate IDs, normalized titles and project URLs, and identical image bytes. Similar names and related repositories still need a human provenance check.

The same catalog accepts approved public `profile.email` and `profile.resume` values. The résumé is a PDF at a public exhibits path. The existing values stay empty until approved. No external storage, upload API or authentication is involved.

## Character export

The portable Blender **4.5.9 LTS** Windows x64 archive was checked against the official SHA-256 manifest and extracted under ignored `temp/blender-tools/`. The headless export was exercised with a synthetic skinned object and the four required animation tracks. The fixture is ignored and does not appear in the portfolio.

Sculpt and retopologize locally from the approved face, hair and wardrobe references in `assets/mascot/references/`. Keep the raw photos and the working Blender file private. Bind the mesh and clothing to one armature. Author in-place NLA tracks named `Idle`, `Walk`, `Turn`, and `Cast`. `Wave` is optional. Use upward Y, forward +Z, feet on the ground, and a height near 2.3 scene units in the exported file. Export only the bound character, including clothing and any wand skinning, with original materials.

Run the exporter from the repository directory, substituting the path to the private Blender file. Only copy the approved GLB to the public path after inspecting its textures and clipping from all sides.

```powershell
& 'temp/blender-tools/blender-4.5.9-windows-x64/blender.exe' --background 'private-guide.blend' --python-exit-code 1 --python scripts/export-guide.py -- temp/guide-review.glb
```

After approval, specify its public pathname as the catalog's `character` value. The landing swaps to the skinned GLB, crossfades its clips, and keeps the existing scene movement and reduced-motion control. The browser uses the temporary guide while the model loads or if loading fails. The current catalog has no approved character file. The synthetic fixture validates the export route and provides no evidence of likeness or production animation quality.

## Environment assets

Each `public/worlds/*.webp` file is an original ImageGen matte, encoded locally to WebP at 1440 × 960. The matte provides distant architecture and lighting. The selectable devices, frames, easels, atom orbits, artifacts, spell effects, and camera remain realtime 3D objects. The backdrops are scene scenery and are not portfolio artwork.

The built-in ImageGen prompt template was “Original wide cinematic environment matte for a fantastical portfolio scene, depicting [setting]. Eye-level frontal view, deep layered architecture and an empty unobstructed middle third at exhibit height for separate live 3D objects to be composited in front. The bottom third shows an open level walkway. Elegant stylized fantasy production design, sophisticated tactile materials, restrained lighting, detailed and atmospheric, widescreen landscape 3:2. No people, no lettering, no watermarks, no personal portfolio content. Entirely original design.”

The settings were a walnut and amber Art Nouveau exhibition, a midnight brass observatory, a sunlit Victorian greenhouse, a circular library carved into a tree hollow, a plum and brass keepsake archive, and a burgundy screening studio. The UI/UX matte requested an original art deco prototyping observatory with pale blue lattice, lavender twilight, subdued console silhouettes, and a clear center for 3D devices. No personal assets were used as prompts or textures.
