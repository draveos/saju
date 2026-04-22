// 점쟁이 서사 생성. 엔진 출력 → 대사 라인.
// deterministic template 기반. 추후 LLM 연동시 이 인터페이스만 유지하고 구현 교체.

import { sinsalAt, sinsalDef } from "../data/sinsal";
import { unseongAt, unseongDef } from "../data/unseong";
import { getSipsin } from "./sajuLogic";

export interface NarrativeContext {
  name?: string;
  dayStemIdx: number;
  pillars: {
    year: [number, number];
    month: [number, number];
    day: [number, number];
    hour: [number, number];
  };
  dayMasterKey: string;   // DAY_MASTER_DATA[i].key (e.g. "갑목(甲木) — 큰 나무")
  counts: number[];       // 오행 분포 5개
  daewoon: { s: number; br: number; age_s: number }[];
  userAge?: number;
  forward: boolean;
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

// 신살별 톤 (encouraging / warning / neutral → insight)
const SINSAL_TONE: Record<string, FortuneMood> = {
  gyeopsal: "warning", jaesal: "warning", cheonsal: "warning",
  wolsal: "warning", mangsinsal: "warning", yukhaesal: "warning",
  jangseongsal: "encouraging", banansal: "encouraging",
  jisal: "insight", yeonsal: "insight",
  yeokmasal: "insight", hwagaesal: "insight",
};

const STEMS_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const BRANCHES_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const ELEMENTS = ["木", "火", "土", "金", "水"];
const ELEMENT_KR = ["목", "화", "토", "금", "수"];

const addr = (name?: string) => {
  if (name && name.trim()) return `${name.trim()}이여`;
  return "그대여";
};

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

  // 1. Opening
  lines.push({ text: `...${addr(ctx.name)}, 드디어 왔는가.`, pauseAfterMs: 500, mood: "welcome" });
  lines.push({ text: `내 앞에 그대의 별무늬가 펼쳐졌다. 천천히 읽어보겠노라.`, pauseAfterMs: 600, mood: "reading" });

  // 2. 일간 소개
  lines.push({
    text: `그대의 본질은 ${ctx.dayMasterKey.split("—")[0].trim()}. ` +
          `${ctx.dayMasterKey.split("—")[1]?.trim() ?? ""}의 성정이니라.`,
    pauseAfterMs: 500,
    mood: "insight",
  });

  // 3. 오행 편중
  if (dom.count >= 4) {
    lines.push({
      text: `${ELEMENTS[dom.idx]}의 기운이 ${dom.count}으로 넘치는구나. ` +
            `${ELEMENT_KR[dom.idx]} 기운이 지나치면 오히려 탈이 된다는 걸 잊지 말라.`,
      mood: "warning",
    });
  } else if (weak.count === 0) {
    lines.push({
      text: `허나 ${ELEMENTS[weak.idx]}의 자리가 비었구나. ` +
            `${ELEMENT_KR[weak.idx]}을(를) 보충하는 방향을 찾아야 하느니라.`,
      mood: "warning",
    });
  } else {
    lines.push({
      text: `오행이 고루 흐르니 큰 재앙은 없겠노라. 다만 ${ELEMENTS[dom.idx]}의 기운이 약간 강하다.`,
      mood: "insight",
    });
  }

  // 4. 일주 (일간 + 일지)
  lines.push({
    text: `일주는 ${dayStemKr}${dayBranchKr}. ` +
          `일지 ${dayBranchKr}에는 ${dayUnseong.nameKr}의 운성이 서렸으니 — ${dayUnseong.theme}의 별이다.`,
    pauseAfterMs: 500,
    mood: "insight",
  });

  // 5. 일지 신살 — 신살 톤에 따라 mood 결정
  lines.push({
    text: `년지로 비추어 보건대, 일지에 맺힌 신살은 ${daySinsal.nameKr}. 이는 ${daySinsal.theme}을(를) 뜻한다.`,
    mood: SINSAL_TONE[daySinsal.key] ?? "insight",
  });

  // 6. 시주 (hint)
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

  // 8. 방향 (대운 순/역)
  lines.push({
    text: ctx.forward
      ? `그대의 대운은 앞으로 나아간다. 시간이 그대의 편에 설 때가 있느니라.`
      : `그대의 대운은 거슬러 흐른다. 과거를 되짚어야 할 때가 오느니라.`,
    pauseAfterMs: 500,
    mood: ctx.forward ? "encouraging" : "warning",
  });

  // 9. Closing
  lines.push({
    text: `허나 기억하라 — 명(命)은 하늘이 정하나 운(運)은 그대가 움직인다. ` +
          `별이 가리키는 방향은 참고일 뿐, 걸음은 그대의 것이니라.`,
    pauseAfterMs: 700,
    mood: "closing",
  });
  lines.push({ text: `... 이것으로 오늘의 풀이를 마치겠노라.`, mood: "closing" });

  return lines;
}
