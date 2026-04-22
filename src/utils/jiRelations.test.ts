import { describe, it, expect } from "vitest";
import {
  jiPairRelation,
  detectSamhyeong,
  detectJahyeong,
  CHUNG_PAIRS,
  PA_PAIRS,
  HAE_PAIRS,
  SANGHYEONG_PAIRS,
  SAMHYEONG_TRIPLES,
  JAHYEONG_BRANCHES,
} from "../data/jiRelations";

describe("ji relations data integrity", () => {
  it("6충 = 6쌍, 각 diff=6", () => {
    expect(CHUNG_PAIRS).toHaveLength(6);
    for (const [a, b] of CHUNG_PAIRS) {
      expect(Math.abs(a - b)).toBe(6);
    }
  });

  it("6파·6해 = 각 6쌍", () => {
    expect(PA_PAIRS).toHaveLength(6);
    expect(HAE_PAIRS).toHaveLength(6);
  });

  it("삼형 2세트 × 3지지", () => {
    expect(SAMHYEONG_TRIPLES).toHaveLength(2);
    for (const t of SAMHYEONG_TRIPLES) expect(t).toHaveLength(3);
  });

  it("자형 4지지 (辰午酉亥)", () => {
    expect([...JAHYEONG_BRANCHES].sort((a, b) => a - b)).toEqual([4, 6, 9, 11]);
  });

  it("상형 1쌍 (子卯)", () => {
    expect(SANGHYEONG_PAIRS).toEqual([[0, 3]]);
  });
});

describe("jiPairRelation — lookups", () => {
  it("충 pair 양방향", () => {
    expect(jiPairRelation(0, 6)).toBe("chung");
    expect(jiPairRelation(6, 0)).toBe("chung");
    expect(jiPairRelation(2, 8)).toBe("chung");
  });

  it("파 pair 양방향", () => {
    expect(jiPairRelation(0, 9)).toBe("pa");
    expect(jiPairRelation(9, 0)).toBe("pa");
  });

  it("해 pair 양방향", () => {
    expect(jiPairRelation(0, 7)).toBe("hae");
    expect(jiPairRelation(7, 0)).toBe("hae");
  });

  it("상형 (子卯) 양방향", () => {
    expect(jiPairRelation(0, 3)).toBe("sanghyeong");
    expect(jiPairRelation(3, 0)).toBe("sanghyeong");
  });

  it("같은 지지는 null (자형은 별도 체크)", () => {
    for (let i = 0; i < 12; i++) expect(jiPairRelation(i, i)).toBeNull();
  });

  it("관계 없는 pair는 null", () => {
    // 자(0)-인(2): 충도 파도 해도 상형도 아님
    expect(jiPairRelation(0, 2)).toBeNull();
  });
});

describe("detectSamhyeong / detectJahyeong", () => {
  it("寅巳申 삼형 검출", () => {
    expect(detectSamhyeong([2, 5, 8])).toEqual([2, 5, 8]);
    expect(detectSamhyeong([0, 2, 5, 8, 1])).toEqual([2, 5, 8]);
  });

  it("丑戌未 삼형 검출", () => {
    expect(detectSamhyeong([1, 10, 7])).toEqual([1, 10, 7]);
  });

  it("삼형 2개 중 하나만 있어도 검출 (2개 중 pick)", () => {
    expect(detectSamhyeong([2, 5])).toBeNull(); // 2개만: 아직 삼형 성립 X
  });

  it("자형 지지 2번 반복", () => {
    expect(detectJahyeong([4, 4, 0, 1])).toBe(4);  // 진진
    expect(detectJahyeong([6, 6, 0, 1])).toBe(6);
    expect(detectJahyeong([0, 1, 2, 3])).toBeNull();
    expect(detectJahyeong([4, 0, 1, 2])).toBeNull(); // 진 1번만
  });

  it("자형 branches 외 중복은 감지 안함", () => {
    expect(detectJahyeong([0, 0, 1, 2])).toBeNull(); // 자는 자형 대상 아님
  });
});
