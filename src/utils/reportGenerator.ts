// 사주 리포트 생성. facts + rules → category별 2-3줄 카드 content.
// lucky_ages는 대운 unseong 기반 별도 계산.

import { REPORT_CATEGORIES, REPORT_FALLBACKS, REPORT_RULES } from "../data/reportRules";
import type { ReportCategory } from "../data/reportRules";
import { unseongAt, unseongDef } from "../data/unseong";
import { matchesWhen } from "./comboEngine";
import type { ComboFacts } from "./comboEngine";
import { getSeededRandom } from "./sajuLogic";

const STEMS_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const BRANCHES_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

export interface ReportCard {
  category: ReportCategory;
  labelKr: string;
  icon: string;
  lines: string[];          // 일반 카테고리
  luckyAges?: LuckyAge[];   // lucky_ages 카테고리만
}

export interface LuckyAge {
  ageStart: number;
  ageEnd: number;
  stemKr: string;
  branchKr: string;
  reason: string;
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

export function generateReport(
  facts: ComboFacts,
  daewoon: readonly { s: number; br: number; age_s: number }[],
  seed: number
): ReportCard[] {
  const rng = getSeededRandom(seed);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

  // category별 매칭 rule 모으기
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
      return {
        category: cat.key,
        labelKr: cat.labelKr,
        icon: cat.icon,
        lines,
        luckyAges: lucky,
      };
    }
    const matched = byCat.get(cat.key) ?? [];
    const lines = matched.length > 0 ? matched.slice(0, 2) : [pick(REPORT_FALLBACKS[cat.key])];
    return {
      category: cat.key,
      labelKr: cat.labelKr,
      icon: cat.icon,
      lines,
    };
  });
}
