import { describe, it, expect } from "vitest";
import {
  yukhapPair, ganhapPair, detectSamhap, detectBanghap, detectBanhap,
  YUKHAP_PAIRS, SAMHAP_GROUPS, BANGHAP_GROUPS, GANHAP_PAIRS,
} from "../data/hapRelations";

describe("hap data integrity", () => {
  it("육합 6쌍, 12지 전부 커버", () => {
    expect(YUKHAP_PAIRS).toHaveLength(6);
    const all = new Set<number>();
    for (const p of YUKHAP_PAIRS) {
      for (const b of p.branches) {
        expect(all.has(b)).toBe(false);
        all.add(b);
      }
    }
    expect(all).toEqual(new Set([0,1,2,3,4,5,6,7,8,9,10,11]));
  });

  it("삼합 4세트 × 3지지 = 12지 전부", () => {
    expect(SAMHAP_GROUPS).toHaveLength(4);
    const all = new Set<number>();
    for (const g of SAMHAP_GROUPS) {
      for (const b of g.branches) {
        expect(all.has(b)).toBe(false);
        all.add(b);
      }
    }
    expect(all).toEqual(new Set([0,1,2,3,4,5,6,7,8,9,10,11]));
  });

  it("방합 4세트 × 3지지 = 12지 전부", () => {
    expect(BANGHAP_GROUPS).toHaveLength(4);
    const all = new Set<number>();
    for (const g of BANGHAP_GROUPS) {
      for (const b of g.branches) all.add(b);
    }
    expect(all).toEqual(new Set([0,1,2,3,4,5,6,7,8,9,10,11]));
  });

  it("간합 5쌍, 10천간 전부", () => {
    expect(GANHAP_PAIRS).toHaveLength(5);
    const all = new Set<number>();
    for (const p of GANHAP_PAIRS) {
      for (const s of p.stems) all.add(s);
    }
    expect(all).toEqual(new Set([0,1,2,3,4,5,6,7,8,9]));
  });
});

describe("yukhapPair / ganhapPair lookups", () => {
  it("자축합(0,1) → earth", () => {
    expect(yukhapPair(0, 1)?.produces).toBe("earth");
    expect(yukhapPair(1, 0)?.produces).toBe("earth");
  });
  it("사신합(5,8) → water", () => {
    expect(yukhapPair(5, 8)?.produces).toBe("water");
  });
  it("관계 없는 쌍은 null", () => {
    expect(yukhapPair(0, 3)).toBeNull();
  });
  it("같은 지지는 null", () => {
    expect(yukhapPair(5, 5)).toBeNull();
  });
  it("갑기합(0,5) → earth", () => {
    expect(ganhapPair(0, 5)?.produces).toBe("earth");
    expect(ganhapPair(5, 0)?.produces).toBe("earth");
  });
  it("간합 아닌 쌍", () => {
    expect(ganhapPair(0, 1)).toBeNull();
  });
});

describe("detectSamhap / detectBanghap / detectBanhap", () => {
  it("신자진(8,0,4) → water 국", () => {
    const r = detectSamhap([8, 0, 4]);
    expect(r?.produces).toBe("water");
  });
  it("인오술(2,6,10) → fire 국", () => {
    const r = detectSamhap([2, 6, 10, 1]);
    expect(r?.produces).toBe("fire");
  });
  it("2지지만 있으면 detectSamhap null, detectBanhap은 반합", () => {
    expect(detectSamhap([8, 0])).toBeNull();
    const bh = detectBanhap([8, 0]);
    expect(bh?.group.produces).toBe("water");
  });
  it("인묘진 방합 → 봄 목방", () => {
    const r = detectBanghap([2, 3, 4]);
    expect(r?.produces).toBe("wood");
    expect(r?.seasonKr).toBe("봄");
  });
  it("2지지만 있으면 방합 null", () => {
    expect(detectBanghap([2, 3])).toBeNull();
  });
});
