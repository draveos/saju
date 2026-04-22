// 사주 리포트 생성. facts + rules → category별 2-3줄 카드 content.
// lucky_ages·marriage_age는 대운 기반 별도 계산.

import { REPORT_CATEGORIES, REPORT_FALLBACKS, REPORT_RULES } from "../data/reportRules";
import type { ReportCategory } from "../data/reportRules";
import { unseongAt, unseongDef } from "../data/unseong";
import { matchesWhen } from "./comboEngine";
import type { ComboFacts } from "./comboEngine";
import { getSeededRandom, getSipsin } from "./sajuLogic";

const STEMS_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const BRANCHES_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

export interface ReportCard {
  category: ReportCategory;
  labelKr: string;
  icon: string;
  lines: string[];
  luckyAges?: LuckyAge[];
  marriageAges?: MarriageAge[];
}

export interface LuckyAge {
  ageStart: number;
  ageEnd: number;
  stemKr: string;
  branchKr: string;
  reason: string;
}

export interface MarriageAge {
  ageStart: number;
  ageEnd: number;
  stemKr: string;
  branchKr: string;
  sipsin: string;
}

const STRONG_UNSEONG = new Set(["jangsaeng", "geonnok", "jewang", "gwandae"]);

export function computeLuckyAges(
  daewoon: readonly { s: number; br: number; age_s: number }[],
  dayStem: number
): LuckyAge[] {
  const out: LuckyAge[] = [];
  for (const dw of daewoon) {
    const u = unseongAt(dayStem, dw.br);
    if (STRONG_UNSEONG.has(u)) {
      out.push({
        ageStart: dw.age_s,
        ageEnd: dw.age_s + 9,
        stemKr: STEMS_KR[dw.s],
        branchKr: BRANCHES_KR[dw.br],
        reason: unseongDef(u).nameKr,
      });
    }
  }
  return out;
}

/**
 * 결혼 가능 시기 — 대운 천간이 배우자성(남: 정/편재, 여: 정/편관)인 구간 추출.
 * 25~45세 범위로 제한 (현실성).
 */
export function computeMarriageAges(
  daewoon: readonly { s: number; br: number; age_s: number }[],
  dayStem: number,
  gender: "M" | "F"
): MarriageAge[] {
  const target = gender === "M" ? new Set(["정재", "편재"]) : new Set(["정관", "편관"]);
  const out: MarriageAge[] = [];
  for (const dw of daewoon) {
    if (dw.age_s > 50 || dw.age_s < 15) continue; // 현실 범위
    const sipsin = getSipsin(dayStem, dw.s);
    if (target.has(sipsin)) {
      out.push({
        ageStart: dw.age_s,
        ageEnd: dw.age_s + 9,
        stemKr: STEMS_KR[dw.s],
        branchKr: BRANCHES_KR[dw.br],
        sipsin,
      });
    }
  }
  return out;
}

export function generateReport(
  facts: ComboFacts,
  daewoon: readonly { s: number; br: number; age_s: number }[],
  seed: number
): ReportCard[] {
  const rng = getSeededRandom(seed);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

  const byCat = new Map<ReportCategory, string[]>();
  for (const r of REPORT_RULES) {
    if (!matchesWhen(r.when, facts)) continue;
    const cur = byCat.get(r.category) ?? [];
    cur.push(pick(r.lines));
    byCat.set(r.category, cur);
  }

  return REPORT_CATEGORIES.map((cat) => {
    if (cat.key === "lucky_ages") {
      const lucky = computeLuckyAges(daewoon, facts.dayStem);
      const lines = lucky.length > 0
        ? [pick(REPORT_FALLBACKS.lucky_ages)]
        : [
            "대운 8구간 전체가 평탄한 흐름이다. 한 구간에 몰아주기보단 긴 호흡으로 길을 내라.",
            ...REPORT_FALLBACKS.lucky_ages.slice(0, 1),
          ];
      return { category: cat.key, labelKr: cat.labelKr, icon: cat.icon, lines, luckyAges: lucky };
    }
    if (cat.key === "marriage_age") {
      const mages = computeMarriageAges(daewoon, facts.dayStem, facts.gender);
      const matched = byCat.get(cat.key) ?? [];
      const lines = matched.length > 0
        ? matched.slice(0, 1)
        : [pick(REPORT_FALLBACKS.marriage_age)];
      if (mages.length === 0) {
        lines.push("대운 기준 뚜렷한 결혼 가능 구간이 잡히지 않는다. 인연의 시기는 환경에 더 좌우될 수 있다.");
      }
      return { category: cat.key, labelKr: cat.labelKr, icon: cat.icon, lines, marriageAges: mages };
    }
    const matched = byCat.get(cat.key) ?? [];
    const lines = matched.length > 0 ? matched.slice(0, 2) : [pick(REPORT_FALLBACKS[cat.key])];
    return { category: cat.key, labelKr: cat.labelKr, icon: cat.icon, lines };
  });
}
