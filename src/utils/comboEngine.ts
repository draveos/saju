// Combo rule 매칭 엔진. facts와 rule.when을 AND 비교해서 매칭되는 rule 반환.
// 새 조건 추가시 (1) ComboFacts에 필드 (2) checkCondition의 switch case 추가.

import { NARRATIVE_COMBOS } from "../data/narrativeCombos";
import type { ComboRule, ComboWhen } from "../data/narrativeCombos";

export interface ComboFacts {
  dayStem: number;
  dayBranch: number;
  sinsalOn: { year: string; month: string; day: string; hour: string };
  unseongOn: { year: string; month: string; day: string; hour: string };
  domElement: string;       // "wood" | "fire" | "earth" | "metal" | "water"
  lackElement: string | null;
  gongmangOn: { year: boolean; month: boolean; hour: boolean };
  hasSamhyeong: boolean;
  hasJahyeong: boolean;
  forward: boolean;
  currentDaewoonSipsin: string | null;
  hasYukhap: boolean;
  hasSamhap: boolean;
  hasBanghap: boolean;
  hasGanhap: boolean;
}

function checkCondition(key: keyof ComboWhen, expected: unknown, f: ComboFacts): boolean {
  switch (key) {
    case "day_stem":          return f.dayStem === expected;
    case "day_stem_in":       return Array.isArray(expected) && (expected as number[]).includes(f.dayStem);
    case "day_branch":        return f.dayBranch === expected;
    case "day_branch_in":     return Array.isArray(expected) && (expected as number[]).includes(f.dayBranch);
    case "sinsal_on_year":    return f.sinsalOn.year === expected;
    case "sinsal_on_month":   return f.sinsalOn.month === expected;
    case "sinsal_on_day":     return f.sinsalOn.day === expected;
    case "sinsal_on_hour":    return f.sinsalOn.hour === expected;
    case "unseong_on_year":   return f.unseongOn.year === expected;
    case "unseong_on_month":  return f.unseongOn.month === expected;
    case "unseong_on_day":    return f.unseongOn.day === expected;
    case "unseong_on_hour":   return f.unseongOn.hour === expected;
    case "dom_element":       return f.domElement === expected;
    case "lack_element":      return f.lackElement === expected;
    case "gongmang_on_year":  return f.gongmangOn.year === expected;
    case "gongmang_on_month": return f.gongmangOn.month === expected;
    case "gongmang_on_hour":  return f.gongmangOn.hour === expected;
    case "has_samhyeong":     return f.hasSamhyeong === expected;
    case "has_jahyeong":      return f.hasJahyeong === expected;
    case "forward":           return f.forward === expected;
    case "current_daewoon_sipsin": return f.currentDaewoonSipsin === expected;
    case "has_yukhap":    return f.hasYukhap === expected;
    case "has_samhap":    return f.hasSamhap === expected;
    case "has_banghap":   return f.hasBanghap === expected;
    case "has_ganhap":    return f.hasGanhap === expected;
  }
}

export function matchesWhen(when: ComboWhen, facts: ComboFacts): boolean {
  for (const key of Object.keys(when) as (keyof ComboWhen)[]) {
    const expected = when[key];
    if (expected === undefined) continue;
    if (!checkCondition(key, expected, facts)) return false;
  }
  return true;
}

export function findMatchingCombos(facts: ComboFacts): ComboRule[] {
  return NARRATIVE_COMBOS.filter((r) => matchesWhen(r.when, facts));
}
