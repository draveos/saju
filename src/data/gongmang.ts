// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/gongmang.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/gongmang_to_ts.py to regenerate.

export interface GongmangSoon {
  idx: number;
  nameKr: string;
  nameHanja: string;
  startBranch: number;
  gongmang: readonly [number, number];
}

export const GONGMANG_SOONS: readonly GongmangSoon[] = [
  { idx: 0, nameKr: "갑자순", nameHanja: "甲子旬", startBranch: 0, gongmang: [10, 11] },
  { idx: 1, nameKr: "갑술순", nameHanja: "甲戌旬", startBranch: 10, gongmang: [8, 9] },
  { idx: 2, nameKr: "갑신순", nameHanja: "甲申旬", startBranch: 8, gongmang: [6, 7] },
  { idx: 3, nameKr: "갑오순", nameHanja: "甲午旬", startBranch: 6, gongmang: [4, 5] },
  { idx: 4, nameKr: "갑진순", nameHanja: "甲辰旬", startBranch: 4, gongmang: [2, 3] },
  { idx: 5, nameKr: "갑인순", nameHanja: "甲寅旬", startBranch: 2, gongmang: [0, 1] },
] as const;

/** 일간·일지로부터 공망 2지지 계산. 순 idx도 함께 반환. */
export function gongmangFromDayPillar(dayStem: number, dayBranch: number): {
  soonIdx: number;
  soonNameKr: string;
  gongmang: readonly [number, number];
} {
  const start = ((dayBranch - dayStem) % 12 + 12) % 12;
  const soon = GONGMANG_SOONS.find((s) => s.startBranch === start);
  if (!soon) throw new Error(`invalid day pillar: stem=${dayStem} branch=${dayBranch}`);
  return { soonIdx: soon.idx, soonNameKr: soon.nameKr, gongmang: soon.gongmang };
}

/** 주어진 branch가 해당 일주의 공망인지 */
export function isGongmang(dayStem: number, dayBranch: number, targetBranch: number): boolean {
  const { gongmang } = gongmangFromDayPillar(dayStem, dayBranch);
  return gongmang[0] === targetBranch || gongmang[1] === targetBranch;
}
