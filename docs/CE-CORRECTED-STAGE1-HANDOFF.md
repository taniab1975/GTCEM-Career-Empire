# Corrected Career Empire Stage 1 — Codex Handoff

## Authority

The following files are the implementation authority for the corrected Stage 1 town:

- `data/world/town-layout.stage1-corrected.json`
- `world/rebuild-corrected.js`
- `world/rebuild-corrected.html`
- `world/rebuild-corrected.css`

The original GamePlan blueprint remains the design-intent reference. Do not reinterpret it again. Do not translate it back onto the 256 px road-tile grid.

## What was wrong with the previous rebuild

The previous `rebuild.js` used a 2560 × 2304 world and constructed the streets from 27 native 256 px road tiles. It also placed a 3 × 3 plaza behind the central crossing. This produced an oversized rectangular motorway, enormous paved regions, repeated intersections and character-scale incoherence.

The corrected build instead uses:

- a compact 1920 × 1536 world;
- an authoritative JSON layout;
- continuous curved Phaser paths at 104 px main-street width and 58 px footpath width;
- a central civic space rather than a 3 × 3 plaza tile field;
- alpha-bound-aware building and prop scaling;
- a connected route graph for click travel;
- separate preserved pages for the current prototype, Codex Stage 1 and corrected Stage 1.

## Integration instruction

1. Copy the four authority files into the repository at their matching paths.
2. Do not replace `world/index.html`, `world/world.js`, `world/rebuild.html`, `world/rebuild.js` or `world/rebuild.css`.
3. Serve the repository normally and open `world/rebuild-corrected.html`.
4. Check the browser console for missing assets or runtime errors.
5. Test WASD/arrows, Shift running, click-to-travel, M aerial mode and destination proximity.
6. Test at normal walking view before judging the aerial view.
7. Capture a short screen recording moving Home Base → Town Square → Skills Centre → First Workplace.
8. Stop for Tania's visual approval. Do not add decorations, systems, labels, new buildings or gameplay before approval.

## Visual acceptance checks

- The whole approaching building and part of its street should fit in the walking camera.
- No ordinary journey between adjacent landmarks should feel like empty lawn traversal.
- Town Square should read as the civic centre, not a giant road intersection.
- Main streets should be narrower than the old 256 px road tiles.
- A 144 px character should make benches, bins, signs, lamps, trees and buildings feel mutually credible.
- The next major destination or landmark should usually be visible while moving.
- The minimap should assist orientation, not be the only way to understand the town.

## Known Stage 1 compromises

- `CE-BLDG-007-global-shop.png` is used twice: once as a flexible first retail workplace and once as Market Street. This should be resolved only after spatial approval and a workplace-art decision.
- Career Studio currently reuses the EST Prep building, allowing EST Prep to function as an interior/support stop during Stage 1.
- Precinct boundary washes and labels are deliberately subtle planning cues and may be removed or redesigned after the geography is approved.
- The corrected street geometry is drawn procedurally because the supplied 256 px road assets force a scale and grid that conflict with the character-level town.

## Do not do yet

- Do not merge this into `world/index.html`.
- Do not refactor the entire world system.
- Do not regenerate or replace artwork.
- Do not add live multiplayer.
- Do not add the full curriculum engine, economy or life-event system.
- Do not “improve” the layout by returning to tile-grid roads.
