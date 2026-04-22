import { describe, it, expect } from "vitest";
import { calcSaju, STEMS_KR, BRANCHES_KR } from "./sajuLogic";
import refCases from "./__fixtures__/manseryeok_ref.json";

type Case = {
  y: number; m: number; d: number; h: number;
  year: [number, number];
  month: [number, number];
  day: [number, number];
  hour: [number, number];
};

const fmt = (p: number[]) => `${STEMS_KR[p[0]]}${BRANCHES_KR[p[1]]}`;

const pillarEq = (a: number[], b: [number, number]) =>
  a[0] === b[0] && a[1] === b[1];

describe("외부 만세력 대조 (sxtwl 기준)", () => {
  const cases = refCases as Case[];

  it.each(cases)(
    "$y-$m-$d h=$h",
    ({ y, m, d, h, year, month, day, hour }) => {
      const r = calcSaju(y, m, d, h, "M");
      const mismatches: string[] = [];
      if (!pillarEq(r.pillars.year, year))
        mismatches.push(`year: got ${fmt(r.pillars.year)} expected ${fmt(year)}`);
      if (!pillarEq(r.pillars.month, month))
        mismatches.push(`month: got ${fmt(r.pillars.month)} expected ${fmt(month)}`);
      if (!pillarEq(r.pillars.day, day))
        mismatches.push(`day: got ${fmt(r.pillars.day)} expected ${fmt(day)}`);
      if (!pillarEq(r.pillars.hour, hour))
        mismatches.push(`hour: got ${fmt(r.pillars.hour)} expected ${fmt(hour)}`);
      expect(mismatches, mismatches.join("\n")).toEqual([]);
    }
  );
});
