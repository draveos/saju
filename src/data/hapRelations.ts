// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/hap_relations.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/hap_relations_to_ts.py to regenerate.

export type HapElement = "wood" | "fire" | "earth" | "metal" | "water";
export type HapType = "yukhap" | "samhap" | "banghap" | "ganhap";

export interface YukhapPair { branches: readonly [number, number]; produces: HapElement; nameKr: string; }
export const YUKHAP_PAIRS: readonly YukhapPair[] = [
  { branches: [0, 1], produces: "earth", nameKr: "자축합 → 토" },
  { branches: [2, 11], produces: "wood", nameKr: "인해합 → 목" },
  { branches: [3, 10], produces: "fire", nameKr: "묘술합 → 화" },
  { branches: [4, 9], produces: "metal", nameKr: "진유합 → 금" },
  { branches: [5, 8], produces: "water", nameKr: "사신합 → 수" },
  { branches: [6, 7], produces: "fire", nameKr: "오미합 → 화" },
] as const;

export interface SamhapGroup { branches: readonly [number, number, number]; produces: HapElement; nameKr: string; }
export const SAMHAP_GROUPS: readonly SamhapGroup[] = [
  { branches: [8, 0, 4], produces: "water", nameKr: "신자진 수국" },
  { branches: [2, 6, 10], produces: "fire", nameKr: "인오술 화국" },
  { branches: [11, 3, 7], produces: "wood", nameKr: "해묘미 목국" },
  { branches: [5, 9, 1], produces: "metal", nameKr: "사유축 금국" },
] as const;

export interface BanghapGroup { branches: readonly [number, number, number]; produces: HapElement; nameKr: string; seasonKr: string; }
export const BANGHAP_GROUPS: readonly BanghapGroup[] = [
  { branches: [2, 3, 4], produces: "wood", nameKr: "인묘진 목방", seasonKr: "봄" },
  { branches: [5, 6, 7], produces: "fire", nameKr: "사오미 화방", seasonKr: "여름" },
  { branches: [8, 9, 10], produces: "metal", nameKr: "신유술 금방", seasonKr: "가을" },
  { branches: [11, 0, 1], produces: "water", nameKr: "해자축 수방", seasonKr: "겨울" },
] as const;

export interface GanhapPair { stems: readonly [number, number]; produces: HapElement; nameKr: string; }
export const GANHAP_PAIRS: readonly GanhapPair[] = [
  { stems: [0, 5], produces: "earth", nameKr: "갑기합 → 토" },
  { stems: [1, 6], produces: "metal", nameKr: "을경합 → 금" },
  { stems: [2, 7], produces: "water", nameKr: "병신합 → 수" },
  { stems: [3, 8], produces: "wood", nameKr: "정임합 → 목" },
  { stems: [4, 9], produces: "fire", nameKr: "무계합 → 화" },
] as const;

const YUKHAP_LOOKUP = new Map<number, YukhapPair>();
for (const p of YUKHAP_PAIRS) {
  const key = Math.min(p.branches[0], p.branches[1]) * 12 + Math.max(p.branches[0], p.branches[1]);
  YUKHAP_LOOKUP.set(key, p);
}
const GANHAP_LOOKUP = new Map<number, GanhapPair>();
for (const p of GANHAP_PAIRS) {
  const key = Math.min(p.stems[0], p.stems[1]) * 10 + Math.max(p.stems[0], p.stems[1]);
  GANHAP_LOOKUP.set(key, p);
}

export function yukhapPair(a: number, b: number): YukhapPair | null {
  if (a === b) return null;
  return YUKHAP_LOOKUP.get(Math.min(a,b) * 12 + Math.max(a,b)) ?? null;
}

export function ganhapPair(a: number, b: number): GanhapPair | null {
  if (a === b) return null;
  return GANHAP_LOOKUP.get(Math.min(a,b) * 10 + Math.max(a,b)) ?? null;
}

export function detectSamhap(branches: readonly number[]): SamhapGroup | null {
  const set = new Set(branches);
  for (const g of SAMHAP_GROUPS) {
    if (set.has(g.branches[0]) && set.has(g.branches[1]) && set.has(g.branches[2])) return g;
  }
  return null;
}

export function detectBanghap(branches: readonly number[]): BanghapGroup | null {
  const set = new Set(branches);
  for (const g of BANGHAP_GROUPS) {
    if (set.has(g.branches[0]) && set.has(g.branches[1]) && set.has(g.branches[2])) return g;
  }
  return null;
}

/** 삼합 반합: 3지지 중 2개만 있을 때 */
export function detectBanhap(branches: readonly number[]): { group: SamhapGroup; pair: [number, number] } | null {
  const set = new Set(branches);
  for (const g of SAMHAP_GROUPS) {
    const present = g.branches.filter((b) => set.has(b));
    if (present.length === 2) return { group: g, pair: [present[0], present[1]] };
  }
  return null;
}
