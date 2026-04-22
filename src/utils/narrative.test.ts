import { describe, it, expect } from "vitest";
import { generateNarrative } from "./narrative";
import { NARRATIVE_BANK } from "../data/narrativeBank";

const baseCtx = {
  name: "테스트",
  dayStemIdx: 4,
  pillars: {
    year: [0, 0] as [number, number],
    month: [2, 2] as [number, number],
    day: [4, 6] as [number, number],
    hour: [0, 0] as [number, number],
  },
  dayMasterKey: "무토(戊土) — 큰 산",
  counts: [1, 2, 2, 2, 1],
  daewoon: [
    { s: 3, br: 3, age_s: 5 },
    { s: 4, br: 4, age_s: 15 },
    { s: 5, br: 5, age_s: 25 },
  ],
  userAge: 30,
  forward: true,
  birthYear: 2000,
  birthMonth: 6,
  birthDay: 15,
  birthHour: 12,
  gender: "M" as "M" | "F",
};

describe("narrative generateNarrative", () => {
  it("같은 생년월일시 → 같은 문장 (deterministic)", () => {
    const a = generateNarrative(baseCtx);
    const b = generateNarrative(baseCtx);
    expect(a.map((l) => l.text)).toEqual(b.map((l) => l.text));
  });

  it("다른 생년월일시 → (대개) 다른 opening", () => {
    const texts = new Set<string>();
    for (let d = 1; d <= 10; d++) {
      const ctx = { ...baseCtx, birthDay: d };
      texts.add(generateNarrative(ctx)[0].text);
    }
    // 최소 2개 이상의 variation이 선택됨 (4-variation bank에서 10 seeds)
    expect(texts.size).toBeGreaterThanOrEqual(2);
  });

  it("이름 있으면 opening_with_name, 없으면 opening_no_name 사용", () => {
    const withName = generateNarrative({ ...baseCtx, name: "민수" });
    const noName = generateNarrative({ ...baseCtx, name: "" });
    expect(NARRATIVE_BANK.opening_with_name.some((t) =>
      withName[0].text === t.replace("{name}", "민수")
    )).toBe(true);
    expect(NARRATIVE_BANK.opening_no_name).toContain(noName[0].text);
  });

  it("{name} 토큰이 완전히 치환됨 (리크 없음)", () => {
    const lines = generateNarrative({ ...baseCtx, name: "홍길동" });
    for (const l of lines) {
      expect(l.text).not.toContain("{name}");
      expect(l.text).not.toContain("{count}");
    }
  });

  it("모든 라인에 mood 지정", () => {
    const lines = generateNarrative(baseCtx);
    for (const l of lines) expect(l.mood).toBeDefined();
  });

  it("연지/월지/시지가 공망이면 해당 대사 삽입", () => {
    // 갑자일 (0,0): 공망 = [10, 11] (戌, 亥)
    // year_branch=11(亥)로 공망 맞추기
    const ctx = {
      ...baseCtx,
      dayStemIdx: 0,
      pillars: {
        year: [0, 11] as [number, number],   // 연지 亥 — 공망
        month: [2, 2] as [number, number],
        day: [0, 0] as [number, number],
        hour: [0, 10] as [number, number],   // 시지 戌 — 공망
      },
    };
    const lines = generateNarrative(ctx);
    const texts = lines.map((l) => l.text);
    const hasYearGongmang = NARRATIVE_BANK.gongmang_year.some((t) => texts.includes(t));
    const hasHourGongmang = NARRATIVE_BANK.gongmang_hour.some((t) => texts.includes(t));
    const hasMonthGongmang = NARRATIVE_BANK.gongmang_month.some((t) => texts.includes(t));
    expect(hasYearGongmang).toBe(true);
    expect(hasHourGongmang).toBe(true);
    expect(hasMonthGongmang).toBe(false); // 월지 寅은 공망 아님
  });

  it("지지 충(沖) 관계가 있으면 ji_chung 대사 삽입", () => {
    // 연지 子(0) vs 월지 午(6) = 충
    const ctx = {
      ...baseCtx,
      pillars: {
        year: [0, 0] as [number, number],
        month: [2, 6] as [number, number],
        day: [4, 4] as [number, number],
        hour: [0, 4] as [number, number],  // 진진 자형
      },
    };
    const lines = generateNarrative(ctx);
    const hasChungLine = lines.some((l) =>
      l.text.includes("충(沖)") || l.text.includes("충 ") || l.text.includes("연지와 월지")
    );
    expect(hasChungLine).toBe(true);
  });

  it("자형(辰辰) 검출 시 ji_jahyeong 대사", () => {
    const ctx = {
      ...baseCtx,
      pillars: {
        year: [0, 4] as [number, number],  // 진
        month: [2, 4] as [number, number], // 진 (자형)
        day: [4, 0] as [number, number],
        hour: [0, 1] as [number, number],
      },
    };
    const lines = generateNarrative(ctx);
    const hasJahyeong = lines.some((l) => l.text.includes("자형"));
    expect(hasJahyeong).toBe(true);
  });

  it("일주 variations가 있으면 해당 일주 대사 삽입 (갑자일주)", () => {
    // 갑자일주 (stem=0, branch=0)
    const ctx = {
      ...baseCtx,
      dayStemIdx: 0,
      pillars: {
        year: [0, 0] as [number, number],
        month: [2, 2] as [number, number],
        day: [0, 0] as [number, number],
        hour: [0, 1] as [number, number],
      },
    };
    const lines = generateNarrative(ctx);
    const hasIlju = lines.some((l) => l.text.includes("갑자일주"));
    expect(hasIlju).toBe(true);
  });

  it("combo rule 매칭: 수 편중 + 삼형 → 맞춤 대사 삽입", () => {
    // 삼형 丑戌未 (1, 10, 7) + 水 dom. 모든 pillar는 60갑자 유효 (stem%2 === branch%2)
    const ctx = {
      ...baseCtx,
      dayStemIdx: 1,  // 乙
      pillars: {
        year: [9, 1] as [number, number],   // 계축
        month: [0, 10] as [number, number], // 갑술
        day: [1, 7] as [number, number],    // 을미
        hour: [0, 0] as [number, number],   // 갑자
      },
      counts: [0, 0, 0, 0, 5],  // 水 편중
    };
    const lines = generateNarrative(ctx);
    const hasComboLine = lines.some((l) =>
      l.text.includes("삼형") || l.text.includes("세 갈래") || l.text.includes("水의 기운이 넘치는데")
    );
    expect(hasComboLine).toBe(true);
  });

  it("오행 편중 케이스(dom ≥ 4)는 element_dom_* bank에서 pick + {count} 치환", () => {
    const ctx = { ...baseCtx, counts: [0, 4, 2, 1, 1] };  // 火 편중 (count=4)
    const lines = generateNarrative(ctx);
    // bank의 element_dom_fire variations 중 하나와 일치해야
    const expected = NARRATIVE_BANK.element_dom_fire.map((t) => t.replace("{count}", "4"));
    const dominantLine = lines.find((l) => expected.includes(l.text));
    expect(dominantLine).toBeDefined();
    expect(dominantLine!.text).not.toContain("{count}");
  });
});
