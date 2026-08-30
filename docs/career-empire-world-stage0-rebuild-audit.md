# Career Empire World Stage 0 Rebuild Audit

Generated: 2026-08-30T02:03:22.766Z

## Sources Read

- AGENTS.md
- docs/project-memory.md
- docs/current-workspace-status.md
- Assets/Images and Animations/Career Empire World/GamePlan/Career-Empire-Town-Rebuild-Brief.md
- Assets/Images and Animations/Career Empire World/GamePlan/Career-Empire-Town-Blueprint.png
- Assets/Images and Animations/Career Empire World/GamePlan/Career-Empire-Town-Blueprint.svg
- world/world.js
- world/index.html
- world/world.css
- data/world/locations.json
- data/world/transformation-tracks.json

## Stage 0 Outputs

- Asset inventory: data/world/asset-inventory.stage0.json
- Draft central manifest: data/world/asset-manifest.stage0.json
- Proposed blueprint translation: data/world/town-layout.stage0.json

## Current Working State

The existing Phaser page has useful foundations: asset preloading, B01 character pose swapping, procedural walk/run motion, keyboard/click movement, foot-based collision, mini-map, aerial map mode, proximity/portal prompts, destination links, community project stages and dormant/awakening/growing/thriving world-state logic.

The current map is not ready to extend visually. Layout, scale, routes, water, props, collision and camera values are embedded directly inside world.js. This makes the map hard to reason about and explains why earlier changes created disproportionate portals, roads through buildings and inconsistent prop scale.

## Asset Measurement Findings

- 91 PNG assets measured.
- Building source files are mostly 1024 x 1024 with large occupied bounds and visible presentation/glow footprint. They need per-asset crop/scale rules.
- Props are mostly 512 x 512 but occupied bounds vary sharply, so one display size cannot work.
- B01 runtime frames are 256 x 384 and match the intended player origin of 0.5, 0.9375.
- Portal FX files are very large and should not be used as default building entrance markers without strict manifest scale/crop rules.

## Preserve In Stage 1

- Phaser 3 world page shell.
- Session/stat readers and local fallback behaviour.
- B01 character loading and directional pose swapping.
- Keyboard movement and procedural bob/lean.
- Mini-map concept.
- Aerial map mode as optional aid/testing mode.
- Portal/proximity interaction concept.
- Community project stage calculation and world-stage vocabulary.

## Separate Later

- Move constants to world-config.js.
- Move all asset path/scale/origin/collision data to asset-manifest.js or JSON.
- Move town geography to town-layout.json.
- Move rendering to WorldRenderer.js.
- Move navigation, interaction and camera logic to dedicated modules.
- Add curriculum-coverage.json and story-events.json only after layout approval.

## Risks

- Existing building art may contain baked glow/base elements that cannot be fully solved in Phaser without crop rules or replacement art.
- The blueprint is a planning SVG, not a pathfinding graph; routes need manual node tuning before click-to-travel can be reliable.
- EST Prep's map role needs confirmation: visible building, interior of Careers/Learning, or both.
- First Workplace and Rights/Safety need asset decisions before polished Stage 1.
- A full refactor in one pass would risk breaking the currently working prototype; Stage 1 should be behind a flag or parallel page.

## Questions For Approval

1. Are the six precinct names in the rebuild brief approved as written?
2. Should EST Prep stay as a visible destination in the town, or become an interior support stop inside Careers/Learning?
3. What should the first flexible workplace be called and visually represent?
4. Should the Stage 1 rebuild happen on a separate page such as world/rebuild.html before replacing world/index.html?
