/** Midday campus lighting for the playable-3d outdoor town (not night neon). */

export const DAYTIME = {
  sky: 0x6bb8e8,
  skyHorizon: 0xc5e4f6,
  fog: 0xb7d9ee,
  fogNear: 170,
  fogFar: 290,
  sunColor: 0xfff3d0,
  sunIntensity: 5.4,
  sunPosition: [-22, 46, 16],
  hemiSky: 0xcfe8ff,
  hemiGround: 0x6f9454,
  hemiIntensity: 1.55,
  ambientColor: 0xdceeff,
  ambientIntensity: 0.28,
  environmentIntensity: 0.95,
  interiorEnvironmentIntensity: 0.62,
  toneMappingExposure: 1.08,
  cameraFar: 300,
  emissiveCap: 0.34,
  lampEmissive: 0.22,
  curbEmissive: 0.07,
  grassTint: 0xd2ee9a,
  water: 0x2e96b8,
  leafByPhase: {
    disrepair: 0x4f7d42,
    growth: 0x3d8a36,
    flourishing: 0x2f8c32,
  },
};

export function clampEmissiveIntensity(value, cap = DAYTIME.emissiveCap) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, cap);
}

export function daytimeLampIntensity(phaseName, index) {
  if (phaseName === 'disrepair') return index < 2 ? DAYTIME.lampEmissive * 0.55 : 0;
  return DAYTIME.lampEmissive;
}

export function daytimeLeafHex(phaseName) {
  return Object.hasOwn(DAYTIME.leafByPhase, phaseName)
    ? DAYTIME.leafByPhase[phaseName]
    : DAYTIME.leafByPhase.growth;
}

export function isBrightDaytimeSky(hex) {
  const n = Number(hex);
  if (!Number.isFinite(n)) return false;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance >= 0.62 && b > r && b >= 180;
}

export function collectDaytimeSnapshot(values = {}) {
  const sky = Number(values.sky);
  const fogNear = Number(values.fogNear);
  const sunIntensity = Number(values.sunIntensity);
  const environmentIntensity = Number(values.environmentIntensity);
  const toneMappingExposure = Number(values.toneMappingExposure);
  const emissiveMax = Number(values.emissiveMax);
  return {
    sky,
    fog: Number(values.fog),
    fogNear,
    fogFar: Number(values.fogFar),
    sunIntensity,
    environmentIntensity,
    toneMappingExposure,
    emissiveMax,
    readsAsDaytime:
      isBrightDaytimeSky(sky) &&
      fogNear >= 120 &&
      sunIntensity >= 5 &&
      environmentIntensity >= 0.8 &&
      toneMappingExposure >= 1.05 &&
      emissiveMax <= DAYTIME.emissiveCap + 0.001,
  };
}

export function applyDaytimeTownAtmosphere(THREE, scene) {
  scene.background = new THREE.Color(DAYTIME.sky);
  scene.fog = new THREE.Fog(DAYTIME.fog, DAYTIME.fogNear, DAYTIME.fogFar);
  const sky = createDaytimeSkyDome(THREE);
  scene.add(sky);
  return sky;
}

export function createDaytimeSkyDome(THREE) {
  const geometry = new THREE.SphereGeometry(200, 32, 20);
  const count = geometry.attributes.position.count;
  const colors = new Float32Array(count * 3);
  const zenith = new THREE.Color(DAYTIME.sky);
  const horizon = new THREE.Color(DAYTIME.skyHorizon);
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const y = geometry.attributes.position.getY(i) / 200;
    const t = Math.min(1, Math.max(0, (y + 0.12) / 0.88));
    color.copy(horizon).lerp(zenith, t);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'daytime-sky';
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  const sunDir = new THREE.Vector3(...DAYTIME.sunPosition).normalize().multiplyScalar(168);
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(5.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfff4cc, fog: false, depthWrite: false, toneMapped: false }),
  );
  sunDisc.name = 'daytime-sun-disc';
  sunDisc.position.copy(sunDir);
  mesh.add(sunDisc);
  return mesh;
}

export function createDaytimeSun(THREE) {
  const sun = new THREE.DirectionalLight(DAYTIME.sunColor, DAYTIME.sunIntensity);
  sun.name = 'daytime-sun';
  sun.position.set(...DAYTIME.sunPosition);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -36;
  sun.shadow.camera.right = 36;
  sun.shadow.camera.top = 38;
  sun.shadow.camera.bottom = -32;
  sun.shadow.camera.far = 120;
  sun.shadow.normalBias = 0.035;
  return sun;
}

export function createDaytimeFillLights(THREE) {
  const hemi = new THREE.HemisphereLight(DAYTIME.hemiSky, DAYTIME.hemiGround, DAYTIME.hemiIntensity);
  hemi.name = 'daytime-hemi';
  const ambient = new THREE.AmbientLight(DAYTIME.ambientColor, DAYTIME.ambientIntensity);
  ambient.name = 'daytime-ambient';
  return { hemi, ambient };
}

export function restrainDaytimeEmissives(root, cap = DAYTIME.emissiveCap) {
  let changed = 0;
  root?.traverse?.(object => {
    if (!object.isMesh || !object.material) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material || typeof material.emissiveIntensity !== 'number') continue;
      const next = clampEmissiveIntensity(material.emissiveIntensity, cap);
      if (next !== material.emissiveIntensity) {
        material.emissiveIntensity = next;
        changed += 1;
      }
    }
  });
  return changed;
}

export function createDaytimeEnvironmentTexture(THREE, renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(DAYTIME.skyHorizon);
  const hemi = new THREE.HemisphereLight(DAYTIME.hemiSky, DAYTIME.hemiGround, 1.65);
  const sun = new THREE.DirectionalLight(DAYTIME.sunColor, 2.5);
  sun.position.set(...DAYTIME.sunPosition);
  envScene.add(hemi, sun);
  const env = pmrem.fromScene(envScene, 0.04);
  envScene.remove(hemi, sun);
  pmrem.dispose();
  return env.texture;
}
