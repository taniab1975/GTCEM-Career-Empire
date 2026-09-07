import { describe, expect, test } from "vitest";
import {
  DAYTIME,
  clampEmissiveIntensity,
  collectDaytimeSnapshot,
  daytimeLampIntensity,
  daytimeLeafHex,
  isBrightDaytimeSky,
  restrainDaytimeEmissives
} from "../../playable-3d/daytime-lighting.js";

describe("daytime outdoor lighting", () => {
  test("uses a bright midday sky, distant fog, strong sun, and high environment fill", () => {
    expect(isBrightDaytimeSky(DAYTIME.sky)).toBe(true);
    expect(DAYTIME.fogNear).toBeGreaterThanOrEqual(120);
    expect(DAYTIME.fogFar).toBeGreaterThan(DAYTIME.fogNear);
    expect(DAYTIME.sunIntensity).toBeGreaterThanOrEqual(5);
    expect(DAYTIME.sunPosition[1]).toBeGreaterThan(35);
    expect(DAYTIME.environmentIntensity).toBeGreaterThanOrEqual(0.9);
    expect(DAYTIME.toneMappingExposure).toBeGreaterThanOrEqual(1.1);
    expect(DAYTIME.cameraFar).toBeGreaterThanOrEqual(DAYTIME.fogFar);
  });

  test("keeps cyan / neon emissives below a daytime cap", () => {
    expect(DAYTIME.emissiveCap).toBeLessThanOrEqual(0.4);
    expect(DAYTIME.lampEmissive).toBeLessThanOrEqual(DAYTIME.emissiveCap);
    expect(DAYTIME.curbEmissive).toBeLessThan(DAYTIME.lampEmissive);
    expect(clampEmissiveIntensity(2.4)).toBe(DAYTIME.emissiveCap);
    expect(clampEmissiveIntensity(0.12)).toBe(0.12);
    expect(clampEmissiveIntensity(-1)).toBe(0);
  });

  test("boosts leaf greens and restrains lamps across world phases", () => {
    expect(daytimeLeafHex("disrepair")).toBe(DAYTIME.leafByPhase.disrepair);
    expect(daytimeLeafHex("flourishing")).toBe(DAYTIME.leafByPhase.flourishing);
    expect(daytimeLeafHex("unknown")).toBe(DAYTIME.leafByPhase.growth);
    expect(daytimeLampIntensity("disrepair", 0)).toBeGreaterThan(0);
    expect(daytimeLampIntensity("disrepair", 3)).toBe(0);
    expect(daytimeLampIntensity("flourishing", 0)).toBe(DAYTIME.lampEmissive);
    expect(daytimeLampIntensity("flourishing", 0)).toBeLessThan(1);
  });

  test("rejects the previous dull night-leaning snapshot", () => {
    const previous = collectDaytimeSnapshot({
      sky: 0xc8e6f2,
      fog: 0xc8e6f2,
      fogNear: 64,
      fogFar: 175,
      sunIntensity: 4.2,
      environmentIntensity: 0.28,
      toneMappingExposure: 1.03,
      emissiveMax: 2.4
    });
    expect(previous.readsAsDaytime).toBe(false);

    const next = collectDaytimeSnapshot({
      sky: DAYTIME.sky,
      fog: DAYTIME.fog,
      fogNear: DAYTIME.fogNear,
      fogFar: DAYTIME.fogFar,
      sunIntensity: DAYTIME.sunIntensity,
      environmentIntensity: DAYTIME.environmentIntensity,
      toneMappingExposure: DAYTIME.toneMappingExposure,
      emissiveMax: DAYTIME.emissiveCap
    });
    expect(next.readsAsDaytime).toBe(true);
  });

  test("clamps mesh emissives on a traversed scene graph", () => {
    const neon = { emissiveIntensity: 2.4 };
    const alreadyDay = { emissiveIntensity: 0.2 };
    const root = {
      traverse(visitor) {
        visitor({ isMesh: true, material: [neon, alreadyDay] });
        visitor({ isMesh: false, material: { emissiveIntensity: 9 } });
      }
    };
    expect(restrainDaytimeEmissives(root)).toBe(1);
    expect(neon.emissiveIntensity).toBe(DAYTIME.emissiveCap);
    expect(alreadyDay.emissiveIntensity).toBe(0.2);
  });
});
