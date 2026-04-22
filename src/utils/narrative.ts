// 점쟁이 서사 생성. 엔진 출력 → 대사 라인.
// 생년월일시 seeded random으로 bank에서 variation 선택 (같은 사람 = 같은 결과).
// 추후 LLM 연동시 이 인터페이스만 유지하고 구현 교체.

import { sinsalAt, sinsalDef } from "../data/sinsal";
import { unseongAt, unseongDef } from "../data/unseong";
import { NARRATIVE_BANK } from "../data/narrativeBank";
import type { NarrativeBankKey } from "../data/narrativeBank";
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

  // 9. Closing — bank
  lines.push({
    text: pick("closing_wisdom", p),
    pauseAfterMs: 700,
    mood: "closing",
  });
  lines.push({ text: pick("closing_final", p), mood: "closing" });

  return lines;
}
