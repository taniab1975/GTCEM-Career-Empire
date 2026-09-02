# Career Empire World Current State

Last checked: 2026-09-02.

Use this page when the map work feels split across too many chats. It records the current source of truth for the Career Empire World 2D/2.5D map work.

## Latest Shareable Build

The latest approved review build is:

- `world/rebuild-corrected.html`
- `world/rebuild-corrected.css`
- `world/rebuild-corrected.js`
- `data/world/town-layout.stage1-corrected.json`
- `Assets/Images and Animations/Career Empire World/`

Public ECC links:

- Version hub: `https://emmanuelcc-ict.github.io/GTCEM-Career-Empire/world/index.html?publish=20260902-current`
- Latest approved map: `https://emmanuelcc-ict.github.io/GTCEM-Career-Empire/world/rebuild-corrected.html?publish=20260902-current`
- Earlier Stage 1 comparison: `https://emmanuelcc-ict.github.io/GTCEM-Career-Empire/world/rebuild.html?publish=20260902-current`

## What This Build Is

`rebuild-corrected.html` is the corrected Stage 1 world plus the Town Hall entry v2 prototype. It includes:

- character-level town navigation;
- corrected compact spatial layout;
- continuous streets and footpaths;
- B01 student character movement;
- click-to-travel routing;
- aerial map mode;
- building entry metadata;
- a Town Hall only 2.5D entry sequence;
- portal placeholder;
- Town Hall placeholder module;
- exit back to normal town view.

This is not true 3D. It is a staged 2.5D composition using existing Phaser, HTML/CSS, and approved image assets.

## What The Attached Video Matches

The file `town-hall-entry-sequence-v2.mp4` matches the `rebuild-corrected` line of work:

- 1120 x 760;
- 10.3 seconds;
- shows the Town Hall approach;
- shows the portal placeholder and Enter control;
- opens the Town Hall placeholder module;
- returns to the town map.

## Earlier Comparison Build

`world/rebuild.html` is still useful, but it is no longer the current review build. Keep it online as the earlier Stage 1 v3 comparison.

## Chat Consolidation

Relevant Codex tasks found:

- `Plan Phaser game world`: established the ECC repo as the live target and packaged the Stage 1 rebuild.
- `Integrate corrected Stage 1 handoff`: integrated the corrected layout and Town Hall entry prototype, then published the latest rebuild files.
- `Locate Entry Map`: confirmed the current request and rechecked the local repo, ECC repo, attached video, and public pages.

Relevant ChatGPT chats found:

- `Summarise Map Build`: confirmed Phase 1 as complete and identified the Town Hall entry v2 prototype as functionally approved, with final art still dependent on better entrance/portal assets.
- `Career Empire Design Atlas`: moved Phase 2 toward the larger game architecture, decision register, evidence-before-expansion rule, and central blueprint. It is design governance, not a request to start broad new code work.

## Current Phase Boundary

Phase 1 foundation is complete enough for review.

Phase 2 should focus on the Career Empire Design Atlas, curriculum-to-journey mapping, and one validated vertical slice before expanding the world.

Do not start broad Stage 2 coding, multiplayer, new asset generation, or expansion to every building unless Tania explicitly asks for that implementation.

## Known Caveats

- First load on GitHub Pages can take about 20 seconds because several building PNGs are around 1 MB each.
- The portal is deliberately a placeholder.
- Town Hall entry is a functional prototype, not final front-facing entrance art.
- First Workplace still reuses an existing building until dedicated art exists.
- GitHub Pages may cache old files for several minutes. The `?publish=` query string is only a cache-buster, not a version selector.

## Cloud/Grokbot Handoff

Use repo `EmmanuelCC-ICT/GTCEM-Career-Empire` on `main`.

Start with:

- `docs/career-empire-world-current-state.md`
- `docs/CE-CORRECTED-STAGE1-HANDOFF.md`
- `docs/career-empire-world-cloud-handoff.md`

Continue from `world/rebuild-corrected.html` unless Tania explicitly asks to compare the earlier `world/rebuild.html` build.
