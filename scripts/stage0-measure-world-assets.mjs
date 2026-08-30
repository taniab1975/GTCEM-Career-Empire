import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = process.cwd();
const assetRoot = path.join(root, "Assets/Images and Animations/Career Empire World");
const outputPath = path.join(root, "data/world/asset-inventory.stage0.json");

function listPngs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listPngs(fullPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith(".png") ? [fullPath] : [];
  });
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function bytesPerPixel(colorType) {
  if (colorType === 6) return 4;
  if (colorType === 2) return 3;
  if (colorType === 4) return 2;
  if (colorType === 0) return 1;
  throw new Error(`Unsupported PNG colour type ${colorType}`);
}

function parsePng(buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") throw new Error("Not a PNG");

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8) {
    return { width, height, bitDepth, colorType, alphaBounds: null, note: "Unsupported bit depth for alpha scan" };
  }

  const bpp = bytesPerPixel(colorType);
  const rowBytes = width * bpp;
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(rowBytes * height);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    const rowOffset = y * rowBytes;
    const previousRowOffset = rowOffset - rowBytes;

    for (let x = 0; x < rowBytes; x += 1) {
      const raw = inflated[inputOffset + x];
      const left = x >= bpp ? pixels[rowOffset + x - bpp] : 0;
      const up = y > 0 ? pixels[previousRowOffset + x] : 0;
      const upLeft = y > 0 && x >= bpp ? pixels[previousRowOffset + x - bpp] : 0;
      let value = raw;
      if (filter === 1) value = raw + left;
      if (filter === 2) value = raw + up;
      if (filter === 3) value = raw + Math.floor((left + up) / 2);
      if (filter === 4) value = raw + paeth(left, up, upLeft);
      pixels[rowOffset + x] = value & 255;
    }
    inputOffset += rowBytes;
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  const hasAlpha = colorType === 6 || colorType === 4;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelOffset = y * rowBytes + x * bpp;
      const alpha = hasAlpha ? pixels[pixelOffset + bpp - 1] : 255;
      if (alpha <= 8) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  const empty = maxX < 0;
  return {
    width,
    height,
    bitDepth,
    colorType,
    alphaBounds: empty ? null : {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    }
  };
}

function familyFor(relativePath) {
  const first = relativePath.split(path.sep)[0];
  if (first === "GamePlan") return "planning";
  return first;
}

const assets = listPngs(assetRoot).map(fullPath => {
  const relativePath = path.relative(root, fullPath);
  const relativeAssetPath = path.relative(assetRoot, fullPath);
  const parsed = parsePng(fs.readFileSync(fullPath));
  const bounds = parsed.alphaBounds;
  return {
    id: path.basename(fullPath, ".png"),
    family: familyFor(relativeAssetPath),
    path: relativePath,
    width: parsed.width,
    height: parsed.height,
    colorType: parsed.colorType,
    alphaBounds: bounds,
    occupiedPercent: bounds ? Number(((bounds.width * bounds.height) / (parsed.width * parsed.height) * 100).toFixed(2)) : 0
  };
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), assetRoot: path.relative(root, assetRoot), assets }, null, 2)}\n`);
console.log(`Measured ${assets.length} PNG assets`);
console.log(outputPath);
