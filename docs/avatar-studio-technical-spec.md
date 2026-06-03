# Avatar Studio Technical Spec

This project is an avatar layering system, not a set of loose character pictures. Every usable avatar asset must obey the same canvas, anchors, layer order, and compatibility rules.

## Master Canvas

- Size: `1024 x 1536 px`
- Format: transparent PNG with alpha
- Do not crop tightly around the item.
- Each file stays on the full master canvas, with the part already positioned on the character.
- Remove contact-sheet labels, boxes, checkerboards, shadows, neighbouring items, and backgrounds.

## Starter Rigs

The first production rigs are:

- `ecc-boy-base-neutral`
- `ecc-girl-base-neutral`

The asset manifest is:

`Assets/Images and Animations/Avatar Studio/layers/rig-manifest.json`

The browser-facing part manifest is:

`modules/avatar/avatar-parts.js`

These two files must keep the same rig ids, canvas size, anchor names, and layer order.

## Current Status

The active starter preview now uses the modular ECC stack for the standard boy and girl rigs.

Expression plates are deliberately parked for now. The current `head/base.png` already contains the neutral facial features, so adding `face/expression-neutral.png` creates a duplicate face/head effect. Expressions should only be enabled after we create an expressionless head base or expression plates that contain only the changed mouth/eyes/brows.

A valid layer must contain only the named part plus its deliberate hidden overlap pixels. It must not contain a duplicate head, collar, torso, hands, or neighbouring clothing.

## Required Anchor Points

Every rig should define these points in pixel coordinates:

| Anchor | Purpose |
| --- | --- |
| `headCenter` | Hair and face shape registration |
| `leftEye` | Left eye colour, glasses, expressions |
| `rightEye` | Right eye colour, glasses, expressions |
| `browLine` | Brows and expression overlays |
| `noseBridge` | Glasses bridge and nose options |
| `mouthCenter` | Mouth and expression overlays |
| `leftEar` | Earrings, headphones, hair side coverage |
| `rightEar` | Earrings, headphones, hair side coverage |
| `neckCenter` | Base head/neck alignment |
| `neckOpening` | Shirt, tie, jumper, blazer collar |
| `leftShoulder` | Shirt/blazer/jumper width |
| `rightShoulder` | Shirt/blazer/jumper width |
| `waistLine` | Shirt-to-bottom overlap |
| `hips` | Skirt/trouser position |
| `leftHandRest` | Sleeve and hand overlap |
| `rightHandRest` | Sleeve and hand overlap |
| `leftFoot` | Left shoe |
| `rightFoot` | Right shoe |
| `feetBaseline` | Shoe/ground alignment |

## Layer Order

Current starter order:

1. `hair/back.png`
2. leg layers
3. shoe layers
4. `body/skin-neck.png`
5. `uniform/lower.png`
6. `uniform/shirt.png`
7. `uniform/tie.png`
8. `uniform/jumper.png`
9. `uniform/blazer.png`
10. arm layers
11. `head/base.png`
12. `hair/front.png`
13. accessories such as crest, earrings, glasses, badges

Back hair and front hair must be separate. Long hair, braids, curls, and ponytails need both a back layer and a front layer where possible.

## Overlap Rules

Assets should not be cut exactly to the visible edge. They need hidden overlap pixels:

- Shirt goes 5-15 px under jumper/blazer and bottoms.
- Jumper goes 5-15 px under blazer.
- Blazer covers shirt/jumper sleeve and shoulder edges.
- Skirts/trousers tuck 5-15 px under shirt/jumper.
- Shoes overlap trouser hems/tights/socks by 5-15 px.
- Hair front overlaps forehead, collar edges, and shoulders where needed.
- Hair back can disappear under body/clothing where needed.

These overlaps are deliberate. They prevent transparent gaps between neck/body, shirt/skirt, sleeves/wrists, and shoes/feet.

## Compatibility Rules

Each asset belongs to a rig family:

- `ecc-girl-standard`
- `ecc-boy-standard`

Face accessories align to face anchors. Clothing aligns to body anchors. If a future face shape or body type moves the anchors, it becomes a new compatible rig variant.

Do not add body types until matching clothing variants are ready. Body variants multiply the clothing workload.

## Starter Pack Definition

The first clean pack should contain:

- base body/head
- back hair
- front hair
- white shirt
- tie
- teal jumper/vest
- navy blazer
- skirt or trousers
- shoes
- crest
- earrings
- eye colour overlays

Everything else stays planned/disabled in the UI until its layer exists and passes the same full-canvas alignment rules.

## Layer Acceptance Test

Before wiring any asset into the live selector:

- Open the PNG on a dark background.
- Confirm it is `1024 x 1536`.
- Confirm it contains only the intended part.
- Confirm it has no duplicate body, collar, face, shoes, or neighbouring items.
- Stack it with the base rig and check neck, shoulders, cuffs, waist, and feet.
- Only then mark the related button active in `modules/avatar/avatar-parts.js`.

## Prompt For New Art Layers

Use this wording for any future art request:

> Create one transparent PNG avatar layer on a 1024 x 1536 px canvas. Do not crop the item. Keep it aligned to the ECC avatar rig anchors. Remove all sheet background, labels, boxes, shadows, and neighbouring items. The asset must stack correctly with the existing rig, including 5-15 px hidden overlap at any neck, cuff, waist, sleeve, or shoe join. Keep the existing ECC style, lighting, scale, and perspective. Do not redesign the character.
