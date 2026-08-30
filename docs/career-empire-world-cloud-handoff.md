# Career Empire World Cloud Handoff

Use this document when continuing the Career Empire World work from a cloud Codex checkout.

## Start Here

Read these files first:

- `AGENTS.md`
- `docs/project-memory.md`
- `docs/career-empire-world-build-plan.md`
- `docs/career-empire-curriculum-journey-map.md`
- `docs/career-empire-world-asset-register.md`
- `docs/career-empire-world-stage0-rebuild-audit.md`
- `Assets/Images and Animations/Career Empire World/GamePlan/Career-Empire-Town-Rebuild-Brief.md`
- `data/world/asset-inventory.stage0.json`
- `data/world/asset-manifest.stage0.json`
- `data/world/town-layout.stage0.json`

The GamePlan PNG/SVG files are planning references only. Do not use either as a flattened Phaser background.

## Current Implementation Boundary

The current prototype page is `world/index.html`. Do not replace or depend on it for Stage 1 approval.

The Stage 1 rebuild slice is isolated here:

- `world/rebuild.html`
- `world/rebuild.css`
- `world/rebuild.js`

Local reload URL:

- `http://localhost:8001/world/rebuild.html`

Run from repo root:

```bash
npm run check
python3 -m http.server 8001
```

## Approved Stage 1 Decisions

- Six precinct names are approved as written in the rebuild brief.
- EST Prep Lab stays visible as a small support building in Careers/Learning.
- The first workplace is called `First Workplace`.
- Use a flexible workplace shell or placeholder until dedicated art exists.
- Do not invent new building art.
- Use existing approved art only.
- Stay in Phaser.
- Do not generate images.
- Do not scale to more characters yet.

## Stage 1 Playable Slice

Stage 1 should prove the town feels right at player scale before expanding the map.

Included:

- Home Base and arrival
- compact route to Town Square
- Career/Skills destination
- First Workplace entrance or placeholder
- core path loop segment
- representative props at canonical scale
- stable camera
- foot-based collisions
- Y depth sorting
- route-based click movement
- B01 character controller
- aerial map toggle

B01 controls:

- WASD/arrows move
- Shift runs
- Space jumps
- P points
- C celebrates
- M toggles aerial view

Camera targets:

- walking zoom: about `0.92` to `1.0`
- mild travel zoom: about `0.84` to `0.9`
- approach zoom: about `1.02` to `1.1`
- avoid dramatic zoom pumping

## Success Checklist

- No empty walk longer than about 8 seconds.
- Destination readable without relying on the minimap.
- Approaching an entrance frames the player and destination together.
- Props feel credible beside the 96 x 144 player.
- Character cannot walk through visible building bases.
- Character cannot walk through water.
- Movement stays responsive.
- Aerial view works as a player aid/testing mode.
- Direction keys return from aerial view to the normal tracking camera.
- Current prototype remains available separately.

## Known Missing Or Rough Art

- `First Workplace` has no dedicated approved building PNG yet.
- Some building PNGs have baked glow/presentation footprints. Phaser can scale/place them, but cannot fully remove those halos without revised art.
- Front walk and second left/right walk poses for B01 would improve animation later.

## Stage 2 Should Not Start Until

Tania visually approves the Stage 1 slice.

After approval, Stage 2 can expand the data-driven layout, add more district entrances, refine camera zones, and begin wiring progression states. Do not replace `world/index.html` until explicitly approved.
