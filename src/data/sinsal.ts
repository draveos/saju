// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/sinsal_12.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/sinsal_to_ts.py to regenerate.

export type SinsalKey = "gyeopsal" | "jaesal" | "cheonsal" | "jisal" | "yeonsal" | "wolsal" | "mangsinsal" | "jangseongsal" | "banansal" | "yeokmasal" | "yukhaesal" | "hwagaesal";

export interface SinsalDef {
  key: SinsalKey;
  nameKr: string;
  nameHanja: string;
  theme: string;
  order: number;
}

export const SINSALS: readonly SinsalDef[] = [
  { key: "gyeopsal", nameKr: "겁살", nameHanja: "劫煞", theme: "탈취·재물 손실·강제", order: 0 },
  { key: "jaesal", nameKr: "재살", nameHanja: "災煞", theme: "구속·관재·옥살이 (수옥살)", order: 1 },
  { key: "cheonsal", nameKr: "천살", nameHanja: "天煞", theme: "천재지변·윗사람 화", order: 2 },
  { key: "jisal", nameKr: "지살", nameHanja: "地煞", theme: "이동·변동·타향", order: 3 },
  { key: "yeonsal", nameKr: "년살", nameHanja: "年煞", theme: "이성·풍류 (도화살)", order: 4 },
  { key: "wolsal", nameKr: "월살", nameHanja: "月煞", theme: "고갈·단절 (고초살)", order: 5 },
  { key: "mangsinsal", nameKr: "망신살", nameHanja: "亡神煞", theme: "실패·체면 손상", order: 6 },
  { key: "jangseongsal", nameKr: "장성살", nameHanja: "將星煞", theme: "권위·리더십·장군", order: 7 },
  { key: "banansal", nameKr: "반안살", nameHanja: "攀鞍煞", theme: "승진·출세·명예", order: 8 },
  { key: "yeokmasal", nameKr: "역마살", nameHanja: "驛馬煞", theme: "이주·여행·변동", order: 9 },
  { key: "yukhaesal", nameKr: "육해살", nameHanja: "六害煞", theme: "질병·장애·방해", order: 10 },
  { key: "hwagaesal", nameKr: "화개살", nameHanja: "華蓋煞", theme: "고독·예술·종교", order: 11 },
] as const;

export const SINSAL_KEYS_ORDERED: readonly SinsalKey[] = [
  "gyeopsal",
  "jaesal",
  "cheonsal",
  "jisal",
  "yeonsal",
  "wolsal",
  "mangsinsal",
  "jangseongsal",
  "banansal",
  "yeokmasal",
  "yukhaesal",
  "hwagaesal",
] as const;

// year_branch(0..11) → array of target_branch, indexed by SINSAL_KEYS_ORDERED
export const SINSAL_TABLE: readonly (readonly number[])[] = [
  [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // 0
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1], // 1
  [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 2
  [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7], // 3
  [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // 4
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1], // 5
  [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 6
  [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7], // 7
  [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4], // 8
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1], // 9
  [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // 10
  [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7], // 11
] as const;

// 역방향 lookup: (year_branch, target_branch) → sinsal_key
// 각 (yb, tb)에 대해 정확히 하나의 sinsal 존재
const REVERSE: readonly (readonly SinsalKey[])[] = (() => {
  const out: SinsalKey[][] = Array.from({ length: 12 }, () => new Array(12) as SinsalKey[]);
  for (let yb = 0; yb < 12; yb++) {
    for (let i = 0; i < SINSAL_KEYS_ORDERED.length; i++) {
      const tb = SINSAL_TABLE[yb][i];
      out[yb][tb] = SINSAL_KEYS_ORDERED[i];
    }
  }
  return out;
})();

export function sinsalAt(yearBranch: number, targetBranch: number): SinsalKey {
  return REVERSE[yearBranch][targetBranch];
}

const DEF_BY_KEY: Record<SinsalKey, SinsalDef> = Object.fromEntries(
  SINSALS.map((s) => [s.key, s])
) as Record<SinsalKey, SinsalDef>;

export const sinsalDef = (k: SinsalKey): SinsalDef => DEF_BY_KEY[k];
