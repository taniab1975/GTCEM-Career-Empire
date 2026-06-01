# Avatar Studio Assets

This folder is for production-bound avatar artwork and reference sheets.

## Model Sheets

- `model-sheets/ecc-avatar-model-sheet-v1.png`
  - Built-in image generation output.
  - Purpose: first full-body ECC-style student avatar reference.
  - Use as a proportion, uniform, pose, and expression guide for later modular parts.
  - Do not treat as the final avatar rig; it still needs layer separation and style QA before live use.
- `model-sheets/ecc-avatar-model-sheet-v2-female.png`
  - Built-in image generation output.
  - Purpose: companion full-body female-presenting ECC-style student avatar reference.
  - Uses blazer, tie/jumper accents, plaid skirt, tights, and school shoes as lookbook-inspired wardrobe guidance.
  - Do not treat as the final avatar rig; it still needs layer separation and style QA before live use.

## Modular Target

Future export packs should preserve the same canvas, lighting, and anchor points across:

- head
- hair front and back
- face and expressions
- torso and uniform
- upper arms
- forearms and hands
- thighs
- lower legs and shoes
- accessories

## Production Plan

Use `docs/avatar-production-plan.md` as the source of truth for:

- the first two base avatars
- shared canvas size
- normalized anchor points
- required layer slots
- expression swaps
- uniform swaps
- Remotion rig targets

The same slot and anchor vocabulary is mirrored in `modules/avatar/avatar-parts.js` so Avatar Studio can later swap from prototype SVG layers to production PNG/WebP layers without changing saved profile data.
