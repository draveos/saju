// 점쟁이 서사 생성. 엔진 출력 → 대사 라인.
// 생년월일시 seeded random으로 bank에서 variation 선택 (같은 사람 = 같은 결과).
// 추후 LLM 연동시 이 인터페이스만 유지하고 구현 교체.

import { sinsalAt, sinsalDef } from "../data/sinsal";
import { unseongAt, unseongDef } from "../data/unseong";
import { isGongmang } from "../data/gongmang";
import { jiPairRelation, detectSamhyeong, detectJahyeong } from "../data/jiRelations";
import { yukhapPair, ganhapPair, detectSamhap, detectBanghap } from "../data/hapRelations";
import { iljuAt } from "../data/ilju60";
import { NARRATIVE_BANK } from "../data/narrativeBank";
import type { NarrativeBankKey } from "../data/narrativeBank";
import { findMatchingCombos } from "./comboEngine";
import type { ComboFacts } from "./comboEngine";
import { getSipsin, getSeededRandom } from "./sajuLogic";

export interface NarrativeContext {
  name?: string;
  dayStemIdx: number;
  pillars: {
    year: [number, number];
    month: [number, number];
    day: [number, number];
    hour: [number, number];
  };
  dayMasterKey: string;
  counts: number[];
  daewoon: { s: number; br: number; age_s: number }[];
  userAge?: number;
  forward: boolean;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
}

export type FortuneMood =
  | "welcome"
  | "reading"
  | "insight"
  | "warning"
  | "encouraging"
  | "closing";

export interface NarrativeLine {
  text: string;
  pauseAfterMs?: number;
  mood?: FortuneMood;
}

const SINSAL_TONE: Record<string, FortuneMood> = {
  gyeopsal: "warning", jaesal: "warning", cheonsal: "warning",
  wolsal: "warning", mangsinsal: "warning", yukhaesal: "warning",
  jangseongsal: "encouraging", banansal: "encouraging",
  jisal: "insight", yeonsal: "insight",
  yeokmasal: "insight", hwagaesal: "insight",
};

const STEMS_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const BRANCHES_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const ELEMENT_KEYS = ["wood", "fire", "earth", "metal", "water"] as const;

export function buildFacts(ctx: NarrativeContext): ComboFacts {
  const [yb, mb, hb] = [ctx.pillars.year[1], ctx.pillars.month[1], ctx.pillars.hour[1]];
  const [ds, db] = ctx.pillars.day;
  const dom = dominantElement(ctx.counts);
  const weak = weakestElement(ctx.counts);
  const dw = currentDaewoon(ctx);

  const allBr = [yb, mb, db, hb];
  const allStems = [ctx.pillars.year[0], ctx.pillars.month[0], ds, ctx.pillars.hour[0]];

  // 합 검출 (facts용)
  let hasYuk = false;
  const pairs: [number, number][] = [
    [yb, mb], [yb, db], [yb, hb], [mb, db], [mb, hb], [db, hb],
  ];
  for (const [a, b] of pairs) if (yukhapPair(a, b)) { hasYuk = true; break; }

  let hasGan = false;
  for (let i = 0; i < allStems.length; i++) {
    for (let j = i + 1; j < allStems.length; j++) {
      if (ganhapPair(allStems[i], allStems[j])) { hasGan = true; break; }
    }
    if (hasGan) break;
  }

  return {
    dayStem: ds,
    dayBranch: db,
    sinsalOn: {
      year: sinsalDef(sinsalAt(yb, yb)).key,
      month: sinsalDef(sinsalAt(yb, mb)).key,
      day: sinsalDef(sinsalAt(yb, db)).key,
      hour: sinsalDef(sinsalAt(yb, hb)).key,
    },
    unseongOn: {
      year: unseongDef(unseongAt(ds, yb)).key,
      month: unseongDef(unseongAt(ds, mb)).key,
      day: unseongDef(unseongAt(ds, db)).key,
      hour: unseongDef(unseongAt(ds, hb)).key,
    },
    domElement: ELEMENT_KEYS[dom.idx],
    lackElement: weak.count === 0 ? ELEMENT_KEYS[weak.idx] : null,
    gongmangOn: {
      year: isGongmang(ds, db, yb),
      month: isGongmang(ds, db, mb),
      hour: isGongmang(ds, db, hb),
    },
    hasSamhyeong: !!detectSamhyeong(allBr),
    hasJahyeong: detectJahyeong(allBr) !== null,
    forward: ctx.forward,
    currentDaewoonSipsin: dw ? getSipsin(ds, dw.s) : null,
    hasYukhap: hasYuk,
    hasSamhap: !!detectSamhap(allBr),
    hasBanghap: !!detectBanghap(allBr),
    hasGanhap: hasGan,
  };
}

function dominantElement(counts: number[]): { idx: number; count: number } {
  let maxI = 0;
  for (let i = 1; i < 5; i++) if (counts[i] > counts[maxI]) maxI = i;
  return { idx: maxI, count: counts[maxI] };
}

function weakestElement(counts: number[]): { idx: number; count: number } {
  let minI = 0;
  for (let i = 1; i < 5; i++) if (counts[i] < counts[minI]) minI = i;
  return { idx: minI, count: counts[minI] };
}

function currentDaewoon(ctx: NarrativeContext) {
  if (!ctx.daewoon.length || ctx.userAge == null) return null;
  for (let i = ctx.daewoon.length - 1; i >= 0; i--) {
    if (ctx.userAge >= ctx.daewoon[i].age_s) return ctx.daewoon[i];
  }
  return ctx.daewoon[0];
}

// seeded random picker factory
function makePicker(seed: number) {
  const rng = getSeededRandom(seed);
  return <T>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
}

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

function pick(key: NarrativeBankKey, picker: <T>(a: readonly T[]) => T): string {
  return picker(NARRATIVE_BANK[key]);
}

export function generateNarrative(ctx: NarrativeContext): NarrativeLine[] {
  const lines: NarrativeLine[] = [];
  const yb = ctx.pillars.year[1];
  const [ds, db] = ctx.pillars.day;
  const dayStemKr = STEMS_KR[ds];
  const dayBranchKr = BRANCHES_KR[db];

  const daySinsal = sinsalDef(sinsalAt(yb, db));
  const dayUnseong = unseongDef(unseongAt(ds, db));
  const hourUnseong = unseongDef(unseongAt(ds, ctx.pillars.hour[1]));

  const dom = dominantElement(ctx.counts);
  const weak = weakestElement(ctx.counts);

  // seed: 생년월일시 (같은 사람은 같은 결과, 다른 사람은 다름)
  const seed = ctx.birthYear * 100_000_000 + ctx.birthMonth * 1_000_000
             + ctx.birthDay * 10_000 + ctx.birthHour * 100 + 1;
  const p = makePicker(seed);

  // Combo rule facts + 매칭 (섹션별 그룹)
  const facts = buildFacts(ctx);
  const matchedCombos = findMatchingCombos(facts);
  const combosBySection = {
    opening: matchedCombos.filter((r) => r.insert.section === "opening"),
    main: matchedCombos.filter((r) => r.insert.section === "main"),
    closing: matchedCombos.filter((r) => r.insert.section === "closing"),
  };
  const pickComboLines = (section: "opening" | "main" | "closing", maxN: number) => {
    const pool = combosBySection[section];
    return pool.slice(0, maxN).map((r) => ({
      text: p(r.insert.variations),
      mood: (r.insert.mood ?? "insight") as FortuneMood,
    }));
  };

  // 1. Opening
  const hasName = !!(ctx.name && ctx.name.trim());
  const openTpl = hasName ? pick("opening_with_name", p) : pick("opening_no_name", p);
  lines.push({
    text: fill(openTpl, { name: ctx.name?.trim() ?? "" }),
    pauseAfterMs: 500,
    mood: "welcome",
  });

  lines.push({
    text: pick("reading", p),
    pauseAfterMs: 600,
    mood: "reading",
  });

  // 1b. opening section combos (최대 1)
  for (const l of pickComboLines("opening", 1)) lines.push(l);

  // 2. 일간 소개 (DAY_MASTER_DATA 기반 — bank 없이 직접 문장)
  lines.push({
    text: `그대의 본질은 ${ctx.dayMasterKey.split("—")[0].trim()}. ` +
          `${ctx.dayMasterKey.split("—")[1]?.trim() ?? ""}의 성정이니라.`,
    pauseAfterMs: 500,
    mood: "insight",
  });

  // 3. 오행 편중/결핍/균형 — bank에서 pick
  if (dom.count >= 4) {
    const key = `element_dom_${ELEMENT_KEYS[dom.idx]}` as NarrativeBankKey;
    lines.push({
      text: fill(pick(key, p), { count: dom.count }),
      mood: "warning",
    });
  } else if (weak.count === 0) {
    const key = `element_lack_${ELEMENT_KEYS[weak.idx]}` as NarrativeBankKey;
    lines.push({ text: pick(key, p), mood: "warning" });
  } else {
    lines.push({ text: pick("element_balance", p), mood: "insight" });
  }

  // 4. 일주 — 운성 theme 동적
  lines.push({
    text: `일주는 ${dayStemKr}${dayBranchKr}. ` +
          `일지 ${dayBranchKr}에는 ${dayUnseong.nameKr}의 운성이 서렸으니 — ${dayUnseong.theme}의 별이다.`,
    pauseAfterMs: 500,
    mood: "insight",
  });

  // 4b. ilju60 bank에서 해당 일주 variation (있을 경우만)
  const iljuEntry = iljuAt(ds, db);
  if (iljuEntry.variations.length > 0) {
    lines.push({
      text: p(iljuEntry.variations),
      mood: "insight",
    });
  }

  // 5. 일지 신살
  lines.push({
    text: `년지로 비추어 보건대, 일지에 맺힌 신살은 ${daySinsal.nameKr}. 이는 ${daySinsal.theme}을(를) 뜻한다.`,
    mood: SINSAL_TONE[daySinsal.key] ?? "insight",
  });

  // 6. 시주
  lines.push({
    text: `태어난 시의 지지에는 ${hourUnseong.nameKr}의 기운이 담겼으니, 인생 후반부의 결이 그러하다.`,
    pauseAfterMs: 400,
    mood: "insight",
  });

  // 6b. 공망 — 일지 기준으로 연/월/시 중 공망 걸린 곳 언급
  const yearBr = ctx.pillars.year[1];
  const monthBr = ctx.pillars.month[1];
  const hourBr = ctx.pillars.hour[1];
  if (isGongmang(ds, db, yearBr)) {
    lines.push({ text: pick("gongmang_year", p), mood: "warning" });
  }
  if (isGongmang(ds, db, monthBr)) {
    lines.push({ text: pick("gongmang_month", p), mood: "warning" });
  }
  if (isGongmang(ds, db, hourBr)) {
    lines.push({ text: pick("gongmang_hour", p), mood: "warning" });
  }

  // 6c. 지지 관계 (충·파·해·형) — 4주 6 pair 중 있는 것 + 삼형/자형
  const pillarPairs: Array<[string, string, number, number]> = [
    ["연지", "월지", yearBr, monthBr],
    ["연지", "일지", yearBr, db],
    ["연지", "시지", yearBr, hourBr],
    ["월지", "일지", monthBr, db],
    ["월지", "시지", monthBr, hourBr],
    ["일지", "시지", db, hourBr],
  ];
  // 삼형·자형은 특수 관계라 우선순위. 그 다음 pair 관계.
  type JiEvent = { text: string; priority: number };
  const jiEvents: JiEvent[] = [];
  const allBr = [yearBr, monthBr, db, hourBr];

  const sam = detectSamhyeong(allBr);
  if (sam) {
    jiEvents.push({
      priority: 0,
      text: fill(pick("ji_samhyeong", p), {
        a: BRANCHES_KR[sam[0]],
        b: BRANCHES_KR[sam[1]],
        c: BRANCHES_KR[sam[2]],
      }),
    });
  }
  const jah = detectJahyeong(allBr);
  if (jah !== null) {
    jiEvents.push({
      priority: 0,
      text: fill(pick("ji_jahyeong", p), { a: BRANCHES_KR[jah] }),
    });
  }
  for (const [posA, posB, brA, brB] of pillarPairs) {
    const rel = jiPairRelation(brA, brB);
    if (!rel) continue;
    // 충 > 파/해/상형 우선순위
    const prio = rel === "chung" ? 1 : 2;
    const key = `ji_${rel}` as NarrativeBankKey;
    jiEvents.push({
      priority: prio,
      text: fill(pick(key, p), { a: posA, b: posB }),
    });
  }
  // 우선순위 순으로 최대 2개
  jiEvents.sort((a, b) => a.priority - b.priority);
  for (const ev of jiEvents.slice(0, 2)) {
    lines.push({ text: ev.text, mood: "warning" });
  }

  // 6c-2. 합(合) 관계 — 긍정 톤, 형충파해와 대칭
  const hapEvents: Array<{ text: string; priority: number }> = [];

  // 삼합 (우선순위 최상)
  const sh = detectSamhap(allBr);
  if (sh) {
    hapEvents.push({
      priority: 0,
      text: fill(pick("hap_samhap", p), {
        a: BRANCHES_KR[sh.branches[0]],
        b: BRANCHES_KR[sh.branches[1]],
        c: BRANCHES_KR[sh.branches[2]],
        hap_name: sh.nameKr,
        produces: sh.produces,
      }),
    });
  }
  // 방합
  const bh = detectBanghap(allBr);
  if (bh) {
    hapEvents.push({
      priority: 1,
      text: fill(pick("hap_banghap", p), {
        hap_name: bh.nameKr,
        season: bh.seasonKr,
        produces: bh.produces,
      }),
    });
  }
  // 육합 pair 검출 (4주 중)
  for (const [posA, posB, brA, brB] of pillarPairs) {
    const yh = yukhapPair(brA, brB);
    if (!yh) continue;
    hapEvents.push({
      priority: 2,
      text: fill(pick("hap_yukhap", p), {
        a: posA, b: posB, produces: yh.produces,
      }),
    });
  }
  // 간합 (일간-월간/시간 등)
  const allStems = [
    { pos: "연간", stem: ctx.pillars.year[0] },
    { pos: "월간", stem: ctx.pillars.month[0] },
    { pos: "시간", stem: ctx.pillars.hour[0] },
  ];
  for (const { pos, stem } of allStems) {
    const gh = ganhapPair(ds, stem);
    if (!gh || stem === ds) continue;
    hapEvents.push({
      priority: 3,
      text: fill(pick("hap_ganhap", p), {
        a: "일간", b: pos, produces: gh.produces, hap_name: gh.nameKr,
      }),
    });
    break; // 한 번만
  }

  hapEvents.sort((a, b) => a.priority - b.priority);
  for (const ev of hapEvents.slice(0, 2)) {
    lines.push({ text: ev.text, mood: "encouraging" });
  }

  // 6d. main section combos (최대 2) — 개인화된 맞춤 대사
  for (const l of pickComboLines("main", 2)) lines.push(l);

  // 7. 현재 대운
  const dw = currentDaewoon(ctx);
  if (dw) {
    const dwStem = STEMS_KR[dw.s];
    const dwBranch = BRANCHES_KR[dw.br];
    const dwSipsin = getSipsin(ctx.dayStemIdx, dw.s);
    lines.push({
      text: `지금 그대는 ${dw.age_s}세부터 시작된 ${dwStem}${dwBranch} 대운. ` +
            `일간에 대해 ${dwSipsin}의 관계이니, 이 10년의 흐름을 여기서 본다.`,
      pauseAfterMs: 500,
      mood: "insight",
    });
  }

  // 8. 대운 방향 — bank
  lines.push({
    text: pick(ctx.forward ? "daewoon_forward" : "daewoon_backward", p),
    pauseAfterMs: 500,
    mood: ctx.forward ? "encouraging" : "warning",
  });

  // 8b. closing section combos (최대 1)
  for (const l of pickComboLines("closing", 1)) lines.push(l);

  // 9. Closing — bank
  lines.push({
    text: pick("closing_wisdom", p),
    pauseAfterMs: 700,
    mood: "closing",
  });
  lines.push({ text: pick("closing_final", p), mood: "closing" });

  return lines;
}
