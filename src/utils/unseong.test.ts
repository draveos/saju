import { describe, it, expect } from "vitest";
import { unseongAt, UNSEONGS } from "../data/unseong";

describe("unseong data integrity", () => {
  it("12 stages", () => {
    expect(UNSEONGS).toHaveLength(12);
  });

  it("10 stems × 12 branches = 120 unique lookups, each returns valid key", () => {
    const validKeys = new Set(UNSEONGS.map((u) => u.key));
    for (let s = 0; s < 10; s++) {
      const stages = new Set<string>();
      for (let b = 0; b < 12; b++) {
        const k = unseongAt(s, b);
        expect(validKeys.has(k)).toBe(true);
        stages.add(k);
      }
      // 한 일간 안에서 12 스테이지 전부 등장 (bijection)
      expect(stages.size).toBe(12);
    }
  });
});

describe("unseong 핵심 invariants", () => {
  // 건록지: 일간 오행 = 지지 오행인 자리
  const geonnokExpected: Record<number, number> = {
    0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0,
  };

  it.each(Object.entries(geonnokExpected))(
    "일간 %s 건록지 = %s",
    (stem, branch) => {
      expect(unseongAt(Number(stem), Number(branch))).toBe("geonnok");
    }
  );

  it("음간(1,3,5,7,9)의 장생지 = 직전 양간의 사지", () => {
    const findBranchWith = (stem: number, key: string) => {
      for (let b = 0; b < 12; b++) if (unseongAt(stem, b) === key) return b;
      throw new Error("not found");
    };
    for (const eumStem of [1, 3, 5, 7, 9]) {
      const eumJangsaeng = findBranchWith(eumStem, "jangsaeng");
      const yangSa = findBranchWith(eumStem - 1, "sa");
      expect(eumJangsaeng).toBe(yangSa);
    }
  });
});
