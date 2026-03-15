// src/utils/fortune.ts

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const STEMS_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "오", "미", "신", "유", "술", "해"];
export const BRANCHES_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
export const ELEMENTS = ["木", "火", "土", "金", "水"];
export const ELEM_COLORS = ["#2ecc71", "#e74c3c", "#f1c40f", "#bdc3c7", "#3498db"];

const STEM_E = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
const BRANCH_E = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

// 절기 데이터
const JEOLGI_MO = [[1,6],[2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,7],[9,8],[10,8],[11,7],[12,7]];
const JEOLGI_BR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

// 일주 기준점: 2000-01-01 (경진일)
const REF_DATE = new Date(2000, 0, 1);
const REF_STEM = 6;
const REF_BRANCH = 4;

export const getSipsin = (dayStemIdx: number, otherStemIdx: number) => {
    const de = STEM_E[dayStemIdx];
    const oe = STEM_E[otherStemIdx];
    const samePol = (dayStemIdx % 2 === otherStemIdx % 2);
    const GEN = [1, 2, 3, 4, 0];
    const OVR = [2, 3, 4, 0, 1];

    if (de === oe) return samePol ? "비견" : "겁재";
    if (GEN[de] === oe) return samePol ? "식신" : "상관";
    if (GEN[oe] === de) return samePol ? "편인" : "정인";
    if (OVR[de] === oe) return samePol ? "편재" : "정재";
    if (OVR[oe] === de) return samePol ? "편관" : "정관";
    return "";
};

export const calcSaju = (y: number, m: number, d: number, h: number, gender: string) => {
    const birth = new Date(y, m - 1, d);

    // 연주
    const sajuYear = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y;
    const ys = (sajuYear - 4) % 10;
    const yb = (sajuYear - 4) % 12;

    // 월주
    let mbIdx = 0;
    for (let i = 11; i >= 0; i--) {
        const [jm, jd] = JEOLGI_MO[i];
        if (m > jm || (m === jm && d >= jd)) {
            mbIdx = JEOLGI_BR[i];
            break;
        }
    }
    const msBase = [2, 4, 6, 8, 0][ys % 5];
    const ms = (msBase + (mbIdx - 2 + 12) % 12) % 10;

    // 일주
    const diffDays = Math.floor((birth.getTime() - REF_DATE.getTime()) / (1000 * 60 * 60 * 24)) + (h === 23 ? 1 : 0);
    const ds = (REF_STEM + (diffDays % 10) + 10) % 10;
    const db = (REF_BRANCH + (diffDays % 12) + 12) % 12;

    // 시주
    const hb = h === 23 ? 0 : Math.floor((h + 1) / 2);
    const hsBase = [0, 2, 4, 6, 8][ds % 5];
    const hs = (hsBase + hb) % 10;

    // 오행 카운트
    const pillars = [[ys,yb], [ms,mbIdx], [ds,db], [hs,hb]];
    const counts = [0, 0, 0, 0, 0];
    pillars.forEach(([s, b]) => {
        counts[STEM_E[s]]++;
        counts[BRANCH_E[b]]++;
    });

    // 대운수 (간략화)
    const yangYear = (ys % 2 === 0);
    const isMale = (gender === "M");
    const forward = (yangYear && isMale) || (!yangYear && !isMale);

    return {
        pillars: {
            year: [ys, yb], month: [ms, mbIdx], day: [ds, db], hour: [hs, hb]
        },
        counts,
        forward,
        sajuYear
    };
};