import { describe, it, expect } from "vitest";
import { gongmangFromDayPillar, isGongmang, GONGMANG_SOONS } from "../data/gongmang";

describe("gongmang data integrity", () => {
  it("6 순", () => {
    expect(GONGMANG_SOONS).toHaveLength(6);
  });

  it("12 지지가 정확히 한 번씩 공망이 됨", () => {
    const all = new Set<number>();
    for (const s of GONGMANG_SOONS) {
      for (const g of s.gongmang) {
        expect(all.has(g)).toBe(false);
        all.add(g);
      }
    }
    expect(all).toEqual(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
  });

  it("각 순의 공망 = (start+10, start+11) % 12", () => {
    for (const s of GONGMANG_SOONS) {
      expect(s.gongmang[0]).toBe((s.startBranch + 10) % 12);
      expect(s.gongmang[1]).toBe((s.startBranch + 11) % 12);
    }
  });
});

describe("gongmangFromDayPillar — 60갑자 전수", () => {
  it("60갑자 각 일주는 해당 순에 정확히 귀속", () => {
    const soonCounts = new Map<number, number>();
    for (let i = 0; i < 60; i++) {
      const stem = i % 10;
      const branch = i % 12;
      const { soonIdx } = gongmangFromDayPillar(stem, branch);
      soonCounts.set(soonIdx, (soonCounts.get(soonIdx) ?? 0) + 1);
    }
    // 6 순 × 10일 = 60
    expect([...soonCounts.values()].every((c) => c === 10)).toBe(true);
    expect(soonCounts.size).toBe(6);
  });

  it("대표 케이스", () => {
    // 갑자일 (0,0) → 갑자순, 공망 戌亥 (10, 11)
    const r1 = gongmangFromDayPillar(0, 0);
    expect(r1.soonNameKr).toBe("갑자순");
    expect([...r1.gongmang]).toEqual([10, 11]);

    // 갑술일 (0,10) → 갑술순, 공망 申酉 (8, 9)
    const r2 = gongmangFromDayPillar(0, 10);
    expect(r2.soonNameKr).toBe("갑술순");
    expect([...r2.gongmang]).toEqual([8, 9]);

    // 병자일 (2,0) → 갑술순 (start=10)
    const r3 = gongmangFromDayPillar(2, 0);
    expect(r3.soonNameKr).toBe("갑술순");
  });
});

describe("isGongmang", () => {
  it("갑자일 기준 戌·亥는 공망, 나머진 아님", () => {
    for (let b = 0; b < 12; b++) {
      const expected = b === 10 || b === 11;
      expect(isGongmang(0, 0, b)).toBe(expected);
    }
  });
});
