const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const layout = JSON.parse(fs.readFileSync(path.join(root, "data/world/town-layout.stage1-corrected.json"), "utf8"));
const assetRoot = path.join(root, "Assets/Images and Animations/Career Empire World");
const output = path.join(root, "docs/career-empire-stage1-corrected-preview.png");

const files = {
  homeBase: "buildings/CE-BLDG-001-home-base.png", skillsCentre: "buildings/CE-BLDG-005-initiative-workshop.png",
  estPrep: "buildings/CE-BLDG-002-est-prep-lab.png", megatrends: "buildings/CE-BLDG-003-megatrends-centre.png",
  townHall: "buildings/CE-BLDG-008-town-hall.png", shop: "buildings/CE-BLDG-007-global-shop.png",
  lamp: "props/CE-PROP-001-street-lamp.png", sign: "props/CE-PROP-002-wayfinding-sign.png",
  bench: "props/CE-PROP-004-campus-bench.png", planter: "props/CE-PROP-005-planter.png",
  treeSmall: "props/CE-PROP-006-tree-small.png", treeLarge: "props/CE-PROP-007-tree-large.png",
  bin: "props/CE-PROP-008-campus-bin.png", bikeRack: "props/CE-PROP-009-bike-rack.png",
  banner: "props/CE-PROP-011-community-banner.png",
  player: "avatars/CE-CHAR-B01/runtime/CE-CHAR-B01-idle-back-3q.png"
};
const bounds = {
  homeBase:[1024,1024,2,207,1020,609],skillsCentre:[1024,1024,2,196,1020,632],estPrep:[1024,1024,1,182,1022,659],
  megatrends:[1024,1024,2,153,1020,718],townHall:[1024,1024,22,200,982,632],shop:[1024,1024,2,167,1021,690],
  lamp:[512,512,190,16,132,484],sign:[512,512,88,16,335,484],bench:[512,512,12,143,488,357],
  planter:[512,512,19,34,474,466],treeSmall:[512,512,94,16,323,484],treeLarge:[512,512,19,16,473,483],
  bin:[512,512,50,16,412,484],bikeRack:[512,512,15,128,481,372],banner:[512,512,28,16,456,484]
};

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");}
const svg=[];
svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${layout.world.width}" height="${layout.world.height}">`);
svg.push(`<rect width="100%" height="100%" fill="#397249"/>`);
layout.precincts.forEach(p=>svg.push(`<rect x="${p.x}" y="${p.y}" width="${p.width}" height="${p.height}" rx="76" fill="${p.color}" fill-opacity=".28" stroke="${p.color}" stroke-width="4"/><text x="${p.x+28}" y="${p.y+48}" font-family="Arial" font-size="22" font-weight="700" fill="#efffff" stroke="#103127" stroke-width="5" paint-order="stroke">${esc(p.title.toUpperCase())}</text>`));
svg.push(`<ellipse cx="960" cy="-45" rx="610" ry="135" fill="#075170" stroke="#54bbc8" stroke-width="12"/>`);
layout.routes.forEach(r=>{const pts=r.points.map(p=>p.join(",")).join(" ");const w=r.type==="main"?104:58;svg.push(`<polyline points="${pts}" ${r.closed?`data-closed="true"`:""} fill="none" stroke="#091923" stroke-opacity=".55" stroke-width="${w+18}" stroke-linecap="round" stroke-linejoin="round"/>`);svg.push(`<polyline points="${pts}" fill="none" stroke="${r.type==="main"?"#354c5d":"#71847e"}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`);svg.push(`<polyline points="${pts}" fill="none" stroke="${r.type==="main"?"#55d7e8":"#a3f0bc"}" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`)});
svg.push(`<ellipse cx="960" cy="805" rx="175" ry="120" fill="#293b43" stroke="#6bd7ed" stroke-width="8"/><ellipse cx="960" cy="805" rx="125" ry="82" fill="#59604d" stroke="#ffd166" stroke-width="3"/><text x="960" y="813" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#fff">TOWN SQUARE</text>`);
svg.push(`</svg>`);

async function placed(key,x,baseY,objectHeight){const b=bounds[key];const scale=objectHeight/b[5];const width=Math.round(b[0]*scale),height=Math.round(b[1]*scale);const left=Math.round(x-width/2),top=Math.round(baseY-(b[3]+b[5])*scale);const input=await sharp(path.join(assetRoot,files[key])).resize(width,height).png().toBuffer();return{input,left,top,baseY};}

(async()=>{
  const items=[];
  for(const d of layout.destinations) if(d.asset) items.push(await placed(d.asset,d.x,d.baseY,d.objectHeight));
  for(const p of layout.props) items.push(await placed(p.asset,p.x,p.y,p.objectHeight));
  const playerInput=await sharp(path.join(assetRoot,files.player)).resize(96,144).png().toBuffer();
  items.push({input:playerInput,left:317,top:1125,baseY:1260});
  items.sort((a,b)=>a.baseY-b.baseY);
  await sharp(Buffer.from(svg.join(""))).png().composite(items.map(({input,left,top})=>({input,left,top}))).toFile(output);
  console.log(output);
})();
