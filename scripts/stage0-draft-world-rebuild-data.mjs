import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inventoryPath = path.join(root, "data/world/asset-inventory.stage0.json");
const manifestPath = path.join(root, "data/world/asset-manifest.stage0.json");
const layoutPath = path.join(root, "data/world/town-layout.stage0.json");
const reportPath = path.join(root, "docs/career-empire-world-stage0-rebuild-audit.md");

const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));

function categoryFor(asset) {
  const id = asset.id;
  if (asset.family === "terrain") return "terrain";
  if (asset.family === "paths") return "path";
  if (asset.family === "water") return id.includes("bridge") ? "bridge" : "water";
  if (asset.family === "buildings") return "building";
  if (asset.family === "props") return "prop";
  if (asset.family === "fx") return "effect";
  if (asset.path.includes("/avatars/CE-CHAR-B01/runtime/")) return "player-character";
  if (asset.path.includes("/avatars/CE-CHAR-B01/source-poses/")) return "source-character";
  if (asset.family === "avatars") return "npc-character";
  if (asset.family === "transformations") return "transformation";
  if (asset.family === "planning") return "planning-reference";
  return asset.family;
}

function targetFor(asset) {
  const id = asset.id;
  const category = categoryFor(asset);
  if (category === "terrain" || category === "path") return { display: { width: 256, height: 256 }, origin: [0.5, 0.5], collision: "none-or-tile-specific", depthOffset: 0 };
  if (id === "CE-WATER-001-base-water") return { display: { width: 256, height: 256 }, origin: [0.5, 0.5], collision: "water-body", depthOffset: 0 };
  if (id === "CE-WATER-002-shore-edge") return { display: { width: 256, height: 166 }, origin: [0.5, 0.5], collision: "none", depthOffset: 0 };
  if (id === "CE-WATER-003-waterfall-small") return { display: { height: 380 }, origin: [0.5, 0.92], collision: { type: "ellipse", width: 180, height: 70, offsetY: 82 }, depthOffset: 0 };
  if (id === "CE-WATER-004-bridge") return { display: { width: 300 }, origin: [0.5, 0.78], collision: "walkable-bridge-deck", depthOffset: 0 };
  if (category === "building") return { display: { height: 300 }, origin: [0.5, 0.72], crop: "requires-per-asset-crop", collision: { type: "rect", width: 190, height: 95, offsetY: 78 }, interaction: { type: "entrance", offsetY: 170 }, depthOffset: 0 };
  if (id === "CE-PROP-001-street-lamp") return { display: { height: 325 }, origin: [0.5, 0.98], collision: { type: "circle", radius: 16, offsetY: -8 }, depthOffset: 0 };
  if (id === "CE-PROP-002-wayfinding-sign") return { display: { height: 178 }, origin: [0.5, 0.98], collision: { type: "rect", width: 42, height: 28, offsetY: -12 }, depthOffset: 0 };
  if (id === "CE-PROP-003-hologram-marker") return { display: { height: 155 }, origin: [0.5, 0.96], collision: { type: "circle", radius: 30 }, depthOffset: 0 };
  if (id === "CE-PROP-004-campus-bench") return { display: { height: 70 }, origin: [0.5, 0.92], collision: { type: "rect", width: 90, height: 28, offsetY: -12 }, depthOffset: 0 };
  if (id === "CE-PROP-005-planter") return { display: { height: 86 }, origin: [0.5, 0.92], collision: { type: "ellipse", width: 74, height: 28, offsetY: -10 }, depthOffset: 0 };
  if (id === "CE-PROP-006-tree-small") return { display: { height: 335 }, origin: [0.5, 0.98], collision: { type: "circle", radius: 24, offsetY: -10 }, depthOffset: 0 };
  if (id === "CE-PROP-007-tree-large") return { display: { height: 520 }, origin: [0.5, 0.98], collision: { type: "circle", radius: 34, offsetY: -12 }, depthOffset: 0 };
  if (id === "CE-PROP-008-campus-bin") return { display: { height: 76 }, origin: [0.5, 0.96], collision: { type: "rect", width: 34, height: 30, offsetY: -8 }, depthOffset: 0 };
  if (id === "CE-PROP-009-bike-rack") return { display: { height: 72 }, origin: [0.5, 0.92], collision: { type: "rect", width: 88, height: 22, offsetY: -8 }, depthOffset: 0 };
  if (id === "CE-PROP-010-shop-display") return { display: { height: 235 }, origin: [0.5, 0.94], collision: { type: "rect", width: 120, height: 48, offsetY: -18 }, depthOffset: 0 };
  if (id === "CE-PROP-011-community-banner") return { display: { height: 292 }, origin: [0.5, 0.98], collision: { type: "rect", width: 72, height: 26, offsetY: -10 }, depthOffset: 0 };
  if (id === "CE-PROP-012-solar-canopy") return { display: { height: 235 }, origin: [0.5, 0.92], collision: { type: "rect", width: 150, height: 32, offsetY: -10 }, depthOffset: 0 };
  if (category === "effect") return { display: { height: id.includes("portal") ? 80 : 150 }, origin: [0.5, 0.5], collision: "none", depthOffset: 1 };
  if (category === "player-character") return { display: { width: 96, height: 144 }, origin: [0.5, 0.9375], collision: { type: "feet", width: 32, height: 16 }, depthOffset: 42 };
  if (category === "npc-character") return { display: { width: 80, height: 118 }, origin: [0.5, 0.94], collision: "none", depthOffset: 20 };
  if (category === "transformation") return { display: { height: 300 }, origin: [0.5, 0.78], collision: { type: "rect", width: 210, height: 95, offsetY: 82 }, depthOffset: 0 };
  return { display: null, origin: [0.5, 0.5], collision: "unknown", depthOffset: 0 };
}

const manifest = {
  schema: "career-empire-world-asset-manifest.stage0",
  generatedFrom: "data/world/asset-inventory.stage0.json",
  playerReference: {
    assetId: "CE-CHAR-B01",
    runtimeFrame: { width: 256, height: 384 },
    displayedSize: { width: 96, height: 144 },
    origin: [0.5, 0.9375],
    note: "1 character height = 144 world px for the first rebuild slice."
  },
  assets: inventory.assets.map(asset => ({
    id: asset.id,
    category: categoryFor(asset),
    path: asset.path,
    sourceSize: { width: asset.width, height: asset.height },
    alphaBounds: asset.alphaBounds,
    occupiedPercent: asset.occupiedPercent,
    ...targetFor(asset)
  }))
};

const sx = 2560 / 1120;
const sy = 2304 / 965;
const mapOrigin = { x: 70, y: 135 };
function p(x, y) {
  return {
    x: Math.round((x - mapOrigin.x) * sx),
    y: Math.round((y - mapOrigin.y) * sy)
  };
}
function rect(id, title, blueprint, options = {}) {
  const center = p(blueprint.x + blueprint.width / 2, blueprint.y + blueprint.height / 2);
  return {
    id,
    title,
    precinct: options.precinct,
    assetId: options.assetId,
    role: options.role,
    href: options.href,
    x: center.x,
    y: center.y,
    width: Math.round(blueprint.width * sx),
    height: Math.round(blueprint.height * sy),
    entrance: { x: center.x, y: Math.round(center.y + blueprint.height * sy * 0.68) },
    status: options.status || "proposed"
  };
}

const layout = {
  schema: "career-empire-town-layout.stage0",
  sourceBlueprint: {
    png: "Assets/Images and Animations/Career Empire World/GamePlan/Career-Empire-Town-Blueprint.png",
    svg: "Assets/Images and Animations/Career Empire World/GamePlan/Career-Empire-Town-Blueprint.svg",
    blueprintCanvas: { width: 1600, height: 1200 },
    playableTownRectInBlueprint: { x: 70, y: 135, width: 1120, height: 965 },
    proposedWorldSize: { width: 2560, height: 2304 }
  },
  note: "Planning coordinates only. This file is not wired into the rendered Phaser world yet.",
  precincts: [
    { id: "home-identity", title: "Home and Identity Quarter", role: "arrival, identity, goals, personal choices", region: { x: 80, y: 1390, width: 875, height: 760 } },
    { id: "careers-learning", title: "Careers and Learning Quarter", role: "capabilities, pathways, applications, EST support", region: { x: 100, y: 370, width: 915, height: 860 } },
    { id: "civic-heart", title: "Civic Heart", role: "orientation, votes, class progress, events", region: { x: 850, y: 760, width: 900, height: 850 } },
    { id: "commerce-money", title: "Commerce and Money Quarter", role: "shop, budget, saving, spending, investment choices", region: { x: 1650, y: 1320, width: 900, height: 850 } },
    { id: "work-enterprise", title: "Work and Enterprise Quarter", role: "workplace, rights, safety, communication, teamwork", region: { x: 1660, y: 400, width: 900, height: 860 } },
    { id: "futures-transformation", title: "Futures and Transformation Edge", role: "megatrends, global portal, transformation gateways", region: { x: 900, y: 95, width: 890, height: 555 } }
  ],
  buildings: [
    rect("home-base", "Home Base", { x: 185, y: 790, width: 160, height: 95 }, { precinct: "home-identity", assetId: "CE-BLDG-001-home-base", role: "arrival and identity", href: "../dashboards/student.html?from=world" }),
    rect("avatar-studio", "Avatar Studio", { x: 340, y: 900, width: 145, height: 82 }, { precinct: "home-identity", assetId: "CE-BLDG-006-avatar-studio", role: "character identity", href: "../modules/avatar/index.html?from=world" }),
    rect("skills-centre", "Skills Centre", { x: 145, y: 405, width: 170, height: 95 }, { precinct: "careers-learning", assetId: "CE-BLDG-005-initiative-workshop", role: "capability badges; first lesson Initiative", href: "../modules/initiative/index.html?from=world" }),
    rect("career-studio", "Career Studio", { x: 290, y: 265, width: 180, height: 100 }, { precinct: "careers-learning", assetId: null, role: "jobs, pathways, labour market, applications and interviews", status: "needs asset or placeholder shell" }),
    rect("lifelong-learning", "Lifelong Learning Hub", { x: 395, y: 515, width: 155, height: 88 }, { precinct: "careers-learning", assetId: "CE-BLDG-004-lifelong-learning-hub", role: "retraining and pathway growth", href: "../modules/lifelong-learning/index.html?from=world" }),
    { id: "town-square", title: "Town Square", precinct: "civic-heart", role: "events and orientation", x: p(630, 625).x, y: p(630, 625).y, width: Math.round(236 * sx), height: Math.round(184 * sy), entrance: p(630, 725), status: "proposed-landmark" },
    rect("town-hall", "Town Hall", { x: 545, y: 730, width: 170, height: 100 }, { precinct: "civic-heart", assetId: "CE-BLDG-008-town-hall", role: "votes and community fund", href: "../dashboards/community.html?from=world" }),
    rect("market-street", "Market Street", { x: 885, y: 755, width: 175, height: 95 }, { precinct: "commerce-money", assetId: "CE-BLDG-007-global-shop", role: "shop, consumer choices, needs/wants", href: "../shop/index.html?from=world" }),
    rect("bank-budget", "Bank / Budget Point", { x: 915, y: 905, width: 155, height: 80 }, { precinct: "commerce-money", assetId: null, role: "budget, saving, investing, opportunity cost", status: "can start as UI/NPC interaction" }),
    rect("first-workplace", "First Workplace", { x: 900, y: 390, width: 185, height: 105 }, { precinct: "work-enterprise", assetId: null, role: "first job, income, workplace expectations", status: "needs flexible workplace asset decision" }),
    rect("rights-safety", "Rights + Safety", { x: 820, y: 530, width: 170, height: 92 }, { precinct: "work-enterprise", assetId: null, role: "WHS, Fair Work, EO, grievances", status: "needs asset or interior destination" }),
    rect("megatrends", "Megatrends Centre", { x: 555, y: 205, width: 165, height: 96 }, { precinct: "futures-transformation", assetId: "CE-BLDG-003-megatrends-centre", role: "future work and change events", href: "../index.html?screen=megatrends&from=world" }),
    rect("global-portal", "Global Portal", { x: 745, y: 230, width: 140, height: 86 }, { precinct: "futures-transformation", assetId: "CE-BLDG-009-global-portal", role: "global benchmarks and wider world", href: "../dashboards/global.html?from=world" })
  ],
  transformationGateways: [
    rect("green-futures-gateway", "Green Futures Gateway", { x: 90, y: 150, width: 150, height: 60 }, { precinct: "futures-transformation", role: "climate and sustainability transformation" }),
    rect("digital-access-gateway", "Digital Access Gateway", { x: 980, y: 150, width: 175, height: 60 }, { precinct: "futures-transformation", role: "technology education and inclusion transformation" }),
    rect("fairer-starts-gateway", "Fairer Starts Gateway", { x: 90, y: 1025, width: 160, height: 58 }, { precinct: "home-identity", role: "diversity, belonging and economic equity transformation" }),
    rect("wider-horizons-gateway", "Wider Horizons Gateway", { x: 975, y: 1025, width: 180, height: 58 }, { precinct: "commerce-money", role: "global opportunity transformation" })
  ],
  water: [
    { id: "north-water-edge", type: "coastline", points: [p(70, 195), p(430, 180), p(800, 165), p(1190, 195)] },
    { id: "south-water-edge", type: "coastline", points: [p(70, 1030), p(410, 1030), p(790, 1020), p(1190, 1010)] }
  ],
  routeNodes: [
    { id: "home-entry", ...p(265, 885) },
    { id: "avatar-entry", ...p(412, 982) },
    { id: "skills-entry", ...p(230, 500) },
    { id: "career-entry", ...p(380, 365) },
    { id: "lifelong-entry", ...p(472, 603) },
    { id: "town-square-centre", ...p(630, 625) },
    { id: "town-hall-entry", ...p(630, 830) },
    { id: "market-entry", ...p(972, 850) },
    { id: "budget-entry", ...p(992, 985) },
    { id: "workplace-entry", ...p(992, 495) },
    { id: "rights-entry", ...p(905, 622) },
    { id: "megatrends-entry", ...p(637, 301) },
    { id: "global-entry", ...p(815, 316) }
  ],
  routes: [
    {
      id: "main-life-loop",
      type: "main-street",
      note: "Blueprint Bezier loop; Stage 1 should approximate as route nodes then refine with sampled path points.",
      blueprintPath: "M285 820 C275 635 330 470 480 420 C570 385 720 390 835 440 C975 500 1035 645 985 810 C865 930 670 955 485 910 C385 885 320 855 285 820"
    },
    { id: "north-south-civic-cross", type: "cross-street", nodes: ["megatrends-entry", "town-square-centre", "town-hall-entry", "home-entry"] },
    { id: "west-east-civic-cross", type: "cross-street", nodes: ["skills-entry", "lifelong-entry", "town-square-centre", "rights-entry", "market-entry"] }
  ]
};

const report = `# Career Empire World Stage 0 Rebuild Audit

Generated: ${new Date().toISOString()}

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

- ${inventory.assets.length} PNG assets measured.
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
`;

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(layoutPath, `${JSON.stringify(layout, null, 2)}\n`);
fs.writeFileSync(reportPath, report);

console.log(manifestPath);
console.log(layoutPath);
console.log(reportPath);
