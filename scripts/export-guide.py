from pathlib import Path
import bpy
import sys

# Run in Blender with --background --python-exit-code 1 --python scripts/export-guide.py -- path.glb
output = Path(sys.argv[sys.argv.index("--") + 1]).resolve()
armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
if len(armatures) != 1:
    raise RuntimeError("Expected exactly one character armature")
armature = armatures[0]
meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.find_armature() == armature]
if not meshes:
    raise RuntimeError("No skinned character meshes bind to the armature")
required = {"Idle", "Walk", "Turn", "Cast"}
tracks = armature.animation_data.nla_tracks if armature.animation_data else []
authored = {track.name for track in tracks if not track.mute and track.strips}
if missing := required - authored:
    raise RuntimeError(f"Missing enabled NLA clips: {', '.join(sorted(missing))}")
bpy.ops.object.select_all(action="DESELECT")
for obj in [armature, *meshes]:
    obj.select_set(True)
bpy.context.view_layer.objects.active = armature
bpy.ops.export_scene.gltf(filepath=str(output), export_format="GLB", use_selection=True,
                          export_animations=True, export_animation_mode="NLA_TRACKS",
                          export_skins=True, export_morph=True, export_yup=True)
print(f"Exported {len(meshes)} skinned meshes to {output}")
