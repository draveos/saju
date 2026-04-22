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
