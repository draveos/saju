import { describe, it, expect } from "vitest";
import { sinsalAt, SINSALS, SINSAL_KEYS_ORDERED, SINSAL_TABLE } from "../data/sinsal";

describe("sinsal data integrity", () => {
  it("12개 신살 정의", () => {
    expect(SINSALS).toHaveLength(12);
    expect(SINSAL_KEYS_ORDERED).toHaveLength(12);
  });

  it("SINSAL_TABLE 각 행의 값은 0..11 bijection", () => {
    for (let yb = 0; yb < 12; yb++) {
      const row = SINSAL_TABLE[yb];
      expect(row).toHaveLength(12);
      expect(new Set(row).size).toBe(12);
      expect(Math.min(...row)).toBe(0);
      expect(Math.max(...row)).toBe(11);
    }
  });

  it("역방향 sinsalAt 일관성 — 표 기반 왕복 확인", () => {
    for (let yb = 0; yb < 12; yb++) {
      for (let i = 0; i < SINSAL_KEYS_ORDERED.length; i++) {
        const target = SINSAL_TABLE[yb][i];
        const key = SINSAL_KEYS_ORDERED[i];
        expect(sinsalAt(yb, target)).toBe(key);
      }
    }
  });
});

describe("sinsal rulebook 합의 — 핵심 invariants", () => {
  // 각 국의 장성살 = 왕지, 화개살 = 묘지, 역마살 = 장생의 충
  const checks = [
    { group: "수국", members: [8, 0, 4], prosperity: 0, storage: 4, generation: 8 },
    { group: "화국", members: [2, 6, 10], prosperity: 6, storage: 10, generation: 2 },
    { group: "금국", members: [5, 9, 1], prosperity: 9, storage: 1, generation: 5 },
    { group: "목국", members: [11, 3, 7], prosperity: 3, storage: 7, generation: 11 },
  ];

  for (const c of checks) {
    describe(c.group, () => {
      it.each(c.members)("년지 %i: 왕지=장성살", (yb) => {
        expect(sinsalAt(yb, c.prosperity)).toBe("jangseongsal");
      });
      it.each(c.members)("년지 %i: 묘지=화개살", (yb) => {
        expect(sinsalAt(yb, c.storage)).toBe("hwagaesal");
      });
      it.each(c.members)("년지 %i: 장생지=지살", (yb) => {
        expect(sinsalAt(yb, c.generation)).toBe("jisal");
      });
      it.each(c.members)("년지 %i: 장생 충=역마살", (yb) => {
        expect(sinsalAt(yb, (c.generation + 6) % 12)).toBe("yeokmasal");
      });
    });
  }
});
