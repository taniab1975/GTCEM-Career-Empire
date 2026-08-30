# Career Empire World Asset Register

This is the production register for Phaser-ready Career Empire World assets.

The rule is simple: one approved asset at a time. Do not ask an image model for a whole kit, board, poster, contact sheet, or scene unless the asset itself is a sprite sheet. Each generated image should either become an approved production asset or be rejected/reworked before the next asset starts.

## Production Rules

- One prompt produces one asset only.
- No labels, no text, no callouts, no UI, no contact-sheet layout unless the asset type is explicitly a sprite sheet.
- Use transparent PNG for buildings, avatars, props, transformation sites, and FX.
- Terrain/path/water tiles must be seamless square tiles at the listed size.
- Keep the same 2.5D/isometric camera angle, lighting direction, colour palette, and scale across every asset.
- Preserve readable silhouettes at small Phaser scale.
- Approved files go into `Assets/Images and Animations/Career Empire World/`.
- Keep filenames exactly as listed in this register.

## Base Prompt Template

```text
Create ONE production game asset only.

Asset ID: [ID]
Asset name: [NAME]

Use the attached Career Empire World style references. Match the futuristic school/career city look: polished 2.5D/isometric game art, deep navy shadows, cyan/teal hologram lighting, green campus landscaping, restrained gold accents, clear readable silhouettes.

Output requirements:
- ONE asset only
- transparent PNG unless this is a seamless terrain tile
- no labels
- no text
- no UI
- no contact sheet
- no extra objects
- no background scene
- centered on canvas
- full object visible
- consistent camera angle and lighting with previous approved assets
- game-ready for Phaser

Specific asset requirements:
[SPECIFIC REQUIREMENTS]
```

## Creation Order

Start with the foundational world scale and style, then move into buildings, transformations, avatars, props, and effects.

| Order | Asset ID | Filename | Family | Size | Output | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | CE-TERRAIN-001 | `CE-TERRAIN-001-base-grass.png` | terrain | 256x256 | seamless PNG | approved | Approved from Grokbot v2 after resizing source to exact production size. |
| 2 | CE-TERRAIN-002 | `CE-TERRAIN-002-grass-flowers.png` | terrain | 256x256 | seamless PNG | approved | Approved decorative flower grass variant. |
| 3 | CE-TERRAIN-003 | `CE-TERRAIN-003-grass-worn.png` | terrain | 256x256 | seamless PNG | approved | Approved worn grass for unimproved areas. |
| 4 | CE-TERRAIN-004 | `CE-TERRAIN-004-garden-edge.png` | terrain | 256x256 | transparent PNG | approved | Approved transparent garden/landscaping edge. |
| 5 | CE-PATH-001 | `CE-PATH-001-plaza-stone-base.png` | path | 256x256 | seamless PNG | approved | Approved quiet plaza paving tile. |
| 6 | CE-PATH-002 | `CE-PATH-002-plaza-stone-glow.png` | path | 256x256 | seamless PNG | approved | Approved glowing plaza variant. |
| 7 | CE-PATH-003 | `CE-PATH-003-road-straight.png` | path | 256x256 | transparent PNG | approved | Approved straight road/path segment. |
| 8 | CE-PATH-004 | `CE-PATH-004-road-corner.png` | path | 256x256 | transparent PNG | approved | Approved corner road/path segment. |
| 9 | CE-PATH-005 | `CE-PATH-005-road-t-junction.png` | path | 256x256 | transparent PNG | approved | Approved T-junction road/path segment. |
| 10 | CE-PATH-006 | `CE-PATH-006-road-crossing.png` | path | 256x256 | transparent PNG | approved | Approved crossroads road/path segment. |
| 11 | CE-WATER-001 | `CE-WATER-001-base-water.png` | water | 256x256 | seamless PNG | approved | Approved luminous base water tile. |
| 12 | CE-WATER-002 | `CE-WATER-002-shore-edge.png` | water | 256x256 | transparent PNG | approved | Approved grass/stone-to-water edge overlay. |
| 13 | CE-WATER-003 | `CE-WATER-003-waterfall-small.png` | water | 512x512 | transparent PNG | approved | Approved small waterfall element. |
| 14 | CE-WATER-004 | `CE-WATER-004-bridge.png` | water | 512x512 | transparent PNG | approved | Approved campus bridge matching path scale. |
| 15 | CE-BLDG-001 | `CE-BLDG-001-home-base.png` | building | 1024x1024 | transparent PNG | revision-needed | Held back; needs a more realistic style pass. |
| 16 | CE-BLDG-002 | `CE-BLDG-002-est-prep-lab.png` | building | 1024x1024 | transparent PNG | revision-needed | Held back; needs a more realistic style pass. |
| 17 | CE-BLDG-003 | `CE-BLDG-003-megatrends-centre.png` | building | 1024x1024 | transparent PNG | revision-needed | Held back; needs a more realistic style pass. |
| 18 | CE-BLDG-004 | `CE-BLDG-004-lifelong-learning-hub.png` | building | 1024x1024 | transparent PNG | revision-needed | Held back; needs a more realistic style pass. |
| 19 | CE-BLDG-005 | `CE-BLDG-005-initiative-workshop.png` | building | 1024x1024 | transparent PNG | integrated | Integrated for Initiative Workshop; better realistic direction. |
| 20 | CE-BLDG-006 | `CE-BLDG-006-avatar-studio.png` | building | 1024x1024 | transparent PNG | revision-needed | Held back; needs a more realistic style pass. |
| 21 | CE-BLDG-007 | `CE-BLDG-007-global-shop.png` | building | 1024x1024 | transparent PNG | integrated | Integrated for Global Shop; better realistic direction. |
| 22 | CE-BLDG-008 | `CE-BLDG-008-town-hall.png` | building | 1024x1024 | transparent PNG | planned | Civic/community contribution building. |
| 23 | CE-BLDG-009 | `CE-BLDG-009-global-portal.png` | building | 1024x1024 | transparent PNG | planned | Portal building for interschool/global world. |
| 24 | CE-GREEN-001 | `CE-GREEN-001-coal-plant.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 0 old coal plant, dull/industrial. |
| 25 | CE-GREEN-002 | `CE-GREEN-002-cleanup-site.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 1 cleanup/remediation site. |
| 26 | CE-GREEN-003 | `CE-GREEN-003-solar-park.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 2 solar/wind park. |
| 27 | CE-GREEN-004 | `CE-GREEN-004-waterfall-gardens.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 3 lush park with waterfalls. |
| 28 | CE-DIGITAL-001 | `CE-DIGITAL-001-locked-lab.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 0 closed digital access building. |
| 29 | CE-DIGITAL-002 | `CE-DIGITAL-002-device-hub.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 1 devices arriving. |
| 30 | CE-DIGITAL-003 | `CE-DIGITAL-003-open-tech-hub.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 2 accessible open tech hub. |
| 31 | CE-DIGITAL-004 | `CE-DIGITAL-004-future-skills-campus.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 3 thriving digital campus. |
| 32 | CE-FAIR-001 | `CE-FAIR-001-empty-lot.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 0 empty/underused lot. |
| 33 | CE-FAIR-002 | `CE-FAIR-002-support-desk.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 1 support desk/community help point. |
| 34 | CE-FAIR-003 | `CE-FAIR-003-mentor-centre.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 2 mentor centre. |
| 35 | CE-FAIR-004 | `CE-FAIR-004-belonging-precinct.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 3 inclusive belonging precinct. |
| 36 | CE-GLOBAL-001 | `CE-GLOBAL-001-closed-road.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 0 blocked route. |
| 37 | CE-GLOBAL-002 | `CE-GLOBAL-002-departure-board.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 1 travel planning/departure area. |
| 38 | CE-GLOBAL-003 | `CE-GLOBAL-003-airport-link.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 2 airport link. |
| 39 | CE-GLOBAL-004 | `CE-GLOBAL-004-global-exchange-hub.png` | transformation | 1024x1024 | transparent PNG | planned | Stage 3 global exchange hub. |
| 40 | CE-AVATAR-B01 | `CE-AVATAR-B01-walk.png` | avatar | 2048x256 | sprite sheet PNG | planned | Boy walk cycle, 8 frames, one row. |
| 41 | CE-AVATAR-G01 | `CE-AVATAR-G01-walk.png` | avatar | 2048x256 | sprite sheet PNG | planned | Girl walk cycle, 8 frames, one row. |
| 42 | CE-AVATAR-B02 | `CE-AVATAR-B02-idle.png` | avatar | 1024x256 | sprite sheet PNG | planned | Boy idle cycle, 4 frames, one row. |
| 43 | CE-AVATAR-G02 | `CE-AVATAR-G02-idle.png` | avatar | 1024x256 | sprite sheet PNG | planned | Girl idle cycle, 4 frames, one row. |
| 44 | CE-AVATAR-B03 | `CE-AVATAR-B03-point.png` | avatar | 512x512 | transparent PNG | planned | Boy pointing pose. |
| 45 | CE-AVATAR-G03 | `CE-AVATAR-G03-point.png` | avatar | 512x512 | transparent PNG | planned | Girl pointing pose. |
| 46 | CE-AVATAR-B04 | `CE-AVATAR-B04-celebrate.png` | avatar | 512x512 | transparent PNG | planned | Boy celebration pose. |
| 47 | CE-AVATAR-G04 | `CE-AVATAR-G04-celebrate.png` | avatar | 512x512 | transparent PNG | planned | Girl celebration pose. |
| 48 | CE-PROP-001 | `CE-PROP-001-street-lamp.png` | prop | 512x512 | transparent PNG | planned | Futuristic campus lamp. |
| 49 | CE-PROP-002 | `CE-PROP-002-wayfinding-sign.png` | prop | 512x512 | transparent PNG | planned | Direction sign with no readable text. |
| 50 | CE-PROP-003 | `CE-PROP-003-hologram-marker.png` | prop | 512x512 | transparent PNG | planned | Location interaction marker. |
| 51 | CE-PROP-004 | `CE-PROP-004-campus-bench.png` | prop | 512x512 | transparent PNG | planned | Bench matching world scale. |
| 52 | CE-PROP-005 | `CE-PROP-005-planter.png` | prop | 512x512 | transparent PNG | planned | Planter/garden box. |
| 53 | CE-PROP-006 | `CE-PROP-006-tree-small.png` | prop | 512x512 | transparent PNG | planned | Small tree. |
| 54 | CE-PROP-007 | `CE-PROP-007-tree-large.png` | prop | 512x512 | transparent PNG | planned | Larger tree. |
| 55 | CE-PROP-008 | `CE-PROP-008-campus-bin.png` | prop | 512x512 | transparent PNG | planned | Waste/recycling bin. |
| 56 | CE-PROP-009 | `CE-PROP-009-bike-rack.png` | prop | 512x512 | transparent PNG | planned | Bike rack. |
| 57 | CE-PROP-010 | `CE-PROP-010-shop-display.png` | prop | 512x512 | transparent PNG | planned | Shop display kiosk. |
| 58 | CE-PROP-011 | `CE-PROP-011-community-banner.png` | prop | 512x512 | transparent PNG | planned | Decorative banner with no text. |
| 59 | CE-PROP-012 | `CE-PROP-012-solar-canopy.png` | prop | 512x512 | transparent PNG | planned | Solar shade/canopy prop. |
| 60 | CE-FX-001 | `CE-FX-001-portal-ring.png` | fx | 1024x1024 | transparent PNG | planned | Static portal ring. |
| 61 | CE-FX-002 | `CE-FX-002-portal-energy.png` | fx | 1024x1024 | transparent PNG | planned | Swirling portal energy. |
| 62 | CE-FX-003 | `CE-FX-003-hologram-column.png` | fx | 1024x1024 | transparent PNG | planned | Vertical blue hologram beam. |
| 63 | CE-FX-004 | `CE-FX-004-location-ping.png` | fx | 512x512 | transparent PNG | planned | Map/location marker ping. |
| 64 | CE-FX-005 | `CE-FX-005-reward-burst.png` | fx | 512x512 | transparent PNG | planned | Reward sparkle/burst. |
| 65 | CE-FX-006 | `CE-FX-006-build-upgrade-glow.png` | fx | 512x512 | transparent PNG | planned | Upgrade glow for community transformations. |

## First Asset Prompt

Use this exact first prompt after uploading the current style guide/reference images:

```text
Create ONE production game asset only.

Asset ID: CE-TERRAIN-001
Asset name: Base Grass Tile

Use the attached Career Empire World style references. Match the futuristic school/career city look: polished 2.5D/isometric game art, deep navy shadows, cyan/teal hologram lighting, green campus landscaping, restrained gold accents, clear readable silhouettes.

Output requirements:
- ONE asset only
- seamless square tile
- exactly 256x256
- no labels
- no text
- no UI
- no contact sheet
- no extra objects
- no background scene
- must repeat cleanly on all four edges
- game-ready for Phaser

Specific asset requirements:
Create the base repeatable grass tile for the Career Empire World campus. It should be lush but not busy, with subtle texture variation and enough open space that buildings and characters remain readable on top.
```
