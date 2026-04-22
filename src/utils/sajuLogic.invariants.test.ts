import { describe, it, expect } from "vitest";
import { calcSaju, getSipsin, STEMS_KR, BRANCHES_KR } from "./sajuLogic";

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const callAt = (date: Date, hour = 12, gender = "M") =>
  calcSaju(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, gender);

describe("구조적 불변 — 60갑자 일주 주기", () => {
  it("연속 N일 일간은 +1씩 진행 (mod 10)", () => {
    const start = new Date(2000, 5, 15);
    let prev = callAt(start).pillars.day;
    for (let i = 1; i <= 30; i++) {
      const cur = callAt(addDays(start, i)).pillars;
      expect(cur.day[0]).toBe((prev[0] + 1) % 10);
      prev = cur.day;
    }
  });

  it("연속 N일 일지는 +1씩 진행 (mod 12)", () => {
    const start = new Date(2000, 5, 15);
    let prev = callAt(start).pillars.day;
    for (let i = 1; i <= 30; i++) {
      const cur = callAt(addDays(start, i)).pillars;
      expect(cur.day[1]).toBe((prev[1] + 1) % 12);
      prev = cur.day;
    }
  });

  it("60일 후 일주는 동일 (60갑자 주기)", () => {
    const start = new Date(2000, 5, 15);
    const a = callAt(start).pillars.day;
    const b = callAt(addDays(start, 60)).pillars.day;
    expect(b).toEqual(a);
  });
});

describe("구조적 불변 — 五虎遁 (年上起月)", () => {
  // 갑기년→병인월(2), 을경년→무인월(4), 병신년→경인월(6), 정임년→임인월(8), 무계년→갑인월(0)
  const expectedInwolStem = [2, 4, 6, 8, 0];

  it.each([
    [1984, 0], // 갑자년 (1984=갑자)
    [1985, 1], // 을축
    [1986, 2], // 병인
    [1987, 3], // 정묘
    [1988, 4], // 무진
    [1989, 5], // 기사
    [1990, 6], // 경오
    [1991, 7], // 신미
    [1992, 8], // 임신
    [1993, 9], // 계유
  ])("년도 %i (연간 idx %i) → 인월 천간 = %i번째 그룹 규칙 준수", (year, yearStemIdx) => {
    // Feb 20 is solidly in 寅月 (입춘 ~ 경칩)
    const result = callAt(new Date(year, 1, 20));
    const [inwolStem, inwolBranch] = result.pillars.month;
    expect(inwolBranch).toBe(2); // 인(寅)월
    expect(inwolStem).toBe(expectedInwolStem[yearStemIdx % 5]);
  });
});

describe("구조적 불변 — 五鼠遁 (日上起時)", () => {
  // 갑기일→갑자시(0), 을경일→병자시(2), 병신일→무자시(4), 정임일→경자시(6), 무계일→임자시(8)
  const expectedJasiStem = [0, 2, 4, 6, 8];

  it("자시(h=0) 천간은 일간×五鼠遁 규칙을 따른다", () => {
    for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
      const d = addDays(new Date(2000, 5, 1), dayOffset);
      const r = callAt(d, 0);
      const dayStem = r.pillars.day[0];
      const hourStem = r.pillars.hour[0];
      const hourBranch = r.pillars.hour[1];
      expect(hourBranch).toBe(0); // 자시
      expect(hourStem).toBe(expectedJasiStem[dayStem % 5]);
    }
  });
});

describe("구조적 불변 — 시지 배정", () => {
  const expectedBranch = (h: number) => {
    if (h === 23) return 0;
    return Math.floor((h + 1) / 2);
  };

  it.each(Array.from({ length: 24 }, (_, h) => h))("h=%i 시지 올바른 배정", (h) => {
    const r = callAt(new Date(2000, 5, 15), h);
    expect(r.pillars.hour[1]).toBe(expectedBranch(h));
  });

  it("같은 일자 h=23과 h=0은 동일 자시 지지 (0), but 일주 다름 (야자시파)", () => {
    const d = new Date(2000, 5, 15);
    const at23 = callAt(d, 23);
    const at0Next = callAt(addDays(d, 1), 0);
    // 23시는 다음날 일주로 계산되므로 at23.pillars.day === at0Next.pillars.day
    expect(at23.pillars.day).toEqual(at0Next.pillars.day);
  });
});

describe("구조적 불변 — 출력 범위", () => {
  it("모든 4주는 [0..9, 0..11] 범위 내", () => {
    for (let m = 1; m <= 12; m++) {
      for (let d of [1, 15, 28]) {
        for (let h of [0, 6, 12, 18, 23]) {
          const r = callAt(new Date(2000, m - 1, d), h);
          for (const [s, b] of Object.values(r.pillars)) {
            expect(s).toBeGreaterThanOrEqual(0);
            expect(s).toBeLessThan(10);
            expect(b).toBeGreaterThanOrEqual(0);
            expect(b).toBeLessThan(12);
          }
        }
      }
    }
  });

  it("오행 카운트 합 = 8 (천간 4 + 지지 4)", () => {
    const r = callAt(new Date(1990, 4, 5), 14);
    const total = r.counts.reduce((a, b) => a + b, 0);
    expect(total).toBe(8);
  });
});

describe("구조적 불변 — 십신 대칭성", () => {
  it("일간 자기자신과의 십신은 '비견'", () => {
    for (let i = 0; i < 10; i++) {
      expect(getSipsin(i, i)).toBe("비견");
    }
  });

  it("같은 오행·다른 음양은 '겁재'", () => {
    // 0(갑,목양) ↔ 1(을,목음)
    expect(getSipsin(0, 1)).toBe("겁재");
    expect(getSipsin(2, 3)).toBe("겁재"); // 병정 화
    expect(getSipsin(4, 5)).toBe("겁재"); // 무기 토
  });
});

describe("구조적 불변 — 대운 방향", () => {
  it("양년생 남자는 순행, 음년생 남자는 역행", () => {
    // 1984 갑자년 (양) 남자 → forward
    const r1 = callAt(new Date(1984, 5, 15), 12, "M");
    expect(r1.forward).toBe(true);
    // 1985 을축년 (음) 남자 → 역행
    const r2 = callAt(new Date(1985, 5, 15), 12, "M");
    expect(r2.forward).toBe(false);
  });

  it("양년생 여자는 역행, 음년생 여자는 순행", () => {
    const r1 = callAt(new Date(1984, 5, 15), 12, "F");
    expect(r1.forward).toBe(false);
    const r2 = callAt(new Date(1985, 5, 15), 12, "F");
    expect(r2.forward).toBe(true);
  });
});

describe("참고 — 인덱스 매핑 확인용", () => {
  it("천간/지지 길이", () => {
    expect(STEMS_KR.length).toBe(10);
    expect(BRANCHES_KR.length).toBe(12);
  });
});
