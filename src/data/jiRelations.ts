// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/ji_relations.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/ji_relations_to_ts.py to regenerate.

export type JiPairRelation = "chung" | "pa" | "hae" | "sanghyeong";
export type JiHyeongType = "samhyeong" | "sanghyeong" | "jahyeong";

export const CHUNG_PAIRS: readonly (readonly [number, number])[] = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
export const PA_PAIRS: readonly (readonly [number, number])[] = [[0,9],[1,4],[2,11],[3,6],[5,8],[7,10]];
export const HAE_PAIRS: readonly (readonly [number, number])[] = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
export const SANGHYEONG_PAIRS: readonly (readonly [number, number])[] = [[0,3]];

export const SAMHYEONG_TRIPLES: readonly (readonly [number, number, number])[] = [[2,5,8],[1,10,7]];
export const JAHYEONG_BRANCHES: readonly number[] = [4,6,9,11];

const PAIR_LOOKUP = new Map<number, JiPairRelation>();
function _key(a: number, b: number) { return Math.min(a,b) * 12 + Math.max(a,b); }
function _registerPairs(pairs: readonly (readonly [number, number])[], rel: JiPairRelation) {
  for (const [a,b] of pairs) PAIR_LOOKUP.set(_key(a,b), rel);
}
_registerPairs(CHUNG_PAIRS, 'chung');
_registerPairs(PA_PAIRS, 'pa');
_registerPairs(HAE_PAIRS, 'hae');
_registerPairs(SANGHYEONG_PAIRS, 'sanghyeong');

/** 두 지지 사이의 pair 관계. 없으면 null. 같은 지지는 jahyeong이면 호출자가 별도 처리. */
export function jiPairRelation(a: number, b: number): JiPairRelation | null {
  if (a === b) return null;
  return PAIR_LOOKUP.get(_key(a,b)) ?? null;
}

/** 여러 지지에서 삼형 triple이 성립하는지. 성립하면 해당 triple 반환. */
export function detectSamhyeong(branches: readonly number[]): readonly [number, number, number] | null {
  const set = new Set(branches);
  for (const t of SAMHYEONG_TRIPLES) {
    if (set.has(t[0]) && set.has(t[1]) && set.has(t[2])) return t;
  }
  return null;
}

/** 여러 지지에서 자형 지지가 2번 이상 반복되는지. 있으면 해당 지지 반환. */
export function detectJahyeong(branches: readonly number[]): number | null {
  const count = new Map<number, number>();
  for (const b of branches) count.set(b, (count.get(b) ?? 0) + 1);
  for (const b of JAHYEONG_BRANCHES) {
    if ((count.get(b) ?? 0) >= 2) return b;
  }
  return null;
}
