// src/utils/sajuLogic.ts

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const STEMS_KR = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const BRANCHES_KR = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
export const ELEMENTS = ["木", "火", "土", "金", "水"];
export const ELEM_COLORS = ["#4ade80", "#f87171", "#fbbf24", "#94a3b8", "#60a5fa"];

const STEM_E = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4];
const BRANCH_E = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

const JEOLGI_MO = [[1,6],[2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,7],[9,8],[10,8],[11,7],[12,7]];
const JEOLGI_BR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

// 2000-01-01 = 戊午일 (한국천문연구원/만세력 기준). 과거 庚辰로 하드코딩되어 모든 일주가 38일 어긋나있었음.
// UTC 기준으로 통일해서 historical DST(예: 한국 1948-1951, 1987-88) 영향 회피.
const REF_UTC_MS = Date.UTC(2000, 0, 1);
const REF_STEM = 4; // 戊
const REF_BRANCH = 6; // 午

export const getSeededRandom = (seed: number) => {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
};

export const getSipsin = (dayStemIdx: number, otherStemIdx: number): string => {
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
    return "—";
};

export const calcSaju = (y: number, m: number, d: number, h: number, gender: string) => {
    const birthUtcMs = Date.UTC(y, m - 1, d);

    // 연주
    const sajuYear = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y;
    const ys = ((sajuYear - 4) % 10 + 10) % 10;
    const yb = ((sajuYear - 4) % 12 + 12) % 12;

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
    const diffDays = Math.floor((birthUtcMs - REF_UTC_MS) / (1000 * 60 * 60 * 24)) + (h === 23 ? 1 : 0);
    const ds = ((REF_STEM + (diffDays % 10)) % 10 + 10) % 10;
    const db = ((REF_BRANCH + (diffDays % 12)) % 12 + 12) % 12;

    // 시주
    const hb = h === 23 ? 0 : Math.floor((h + 1) / 2);
    const hsBase = [0, 2, 4, 6, 8][ds % 5];
    const hs = (hsBase + hb) % 10;

    // 오행 카운트
    const pillars: [number, number][] = [[ys, yb], [ms, mbIdx], [ds, db], [hs, hb]];
    const counts = [0, 0, 0, 0, 0];
    pillars.forEach(([s, b]) => {
        counts[STEM_E[s]]++;
        counts[BRANCH_E[b]]++;
    });

    const yangYear = (ys % 2 === 0);
    const isMale = (gender === "M");
    const forward = (yangYear && isMale) || (!yangYear && !isMale);

    return {
        pillars: { year: [ys, yb], month: [ms, mbIdx], day: [ds, db], hour: [hs, hb] } as Record<string, number[]>,
        counts,
        forward,
        sajuYear,
        dayStemIdx: ds,
    };
};

export const getDaewoon = (monthStem: number, monthBranch: number, forward: boolean, startAge: number) => {
    const result = [];
    for (let i = 1; i <= 8; i++) {
        const dir = forward ? i : -i;
        const s = ((monthStem + dir) % 10 + 10) % 10;
        const br = ((monthBranch + dir) % 12 + 12) % 12;
        result.push({ s, br, age_s: startAge + (i - 1) * 10 });
    }
    return result;
};

export const getWesternZodiac = (m: number, d: number): { sign: string; symbol: string; desc: string } => {
    const signs = [
        { sign: "염소자리", symbol: "♑", desc: "인내와 야망의 상징" },
        { sign: "물병자리", symbol: "♒", desc: "혁신과 자유의 상징" },
        { sign: "물고기자리", symbol: "♓", desc: "직관과 감성의 상징" },
        { sign: "양자리",   symbol: "♈", desc: "용기와 도전의 상징" },
        { sign: "황소자리", symbol: "♉", desc: "안정과 풍요의 상징" },
        { sign: "쌍둥이자리", symbol: "♊", desc: "지성과 적응의 상징" },
        { sign: "게자리",   symbol: "♋", desc: "보호와 감정의 상징" },
        { sign: "사자자리", symbol: "♌", desc: "권위와 창조의 상징" },
        { sign: "처녀자리", symbol: "♍", desc: "분석과 완벽의 상징" },
        { sign: "천칭자리", symbol: "♎", desc: "균형과 조화의 상징" },
        { sign: "전갈자리", symbol: "♏", desc: "변환과 열정의 상징" },
        { sign: "사수자리", symbol: "♐", desc: "자유와 탐험의 상징" },
        { sign: "염소자리", symbol: "♑", desc: "인내와 야망의 상징" },
    ];
    const cutoffs = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    const idx = d < cutoffs[m - 1] ? m - 1 : m;
    return signs[idx];
};

export const DAY_MASTER_DATA: Record<number, { key: string; desc: string; strength: string; weakness: string; color: string }> = {
    0: { key: "갑목(甲木) — 큰 나무", desc: "곧은 의지와 강한 자존심을 지닌 리더형입니다. 새로운 것을 개척하는 힘이 있습니다.", strength: "결단력, 진취성, 리더십", weakness: "고집, 타협 어려움", color: "#4ade80" },
    1: { key: "을목(乙木) — 풀, 덩굴", desc: "유연하게 상황에 적응하는 능력이 뛰어납니다. 섬세한 감수성과 예술적 재능을 지닙니다.", strength: "적응력, 감수성, 친화력", weakness: "우유부단, 의존성", color: "#86efac" },
    2: { key: "병화(丙火) — 태양", desc: "밝고 열정적인 에너지로 주변을 따뜻하게 합니다. 카리스마와 표현력이 뛰어납니다.", strength: "열정, 사교성, 카리스마", weakness: "충동적, 과욕", color: "#f97316" },
    3: { key: "정화(丁火) — 촛불, 등불", desc: "따뜻한 마음과 섬세한 통찰력을 지닙니다. 예술과 감성 분야에서 빛을 발합니다.", strength: "통찰력, 예술성, 배려심", weakness: "감정기복, 소심함", color: "#fb923c" },
    4: { key: "무토(戊土) — 큰 산, 대지", desc: "묵직한 안정감과 신뢰감을 줍니다. 어떤 상황에서도 중심을 잡는 힘이 있습니다.", strength: "안정감, 신뢰성, 포용력", weakness: "고집, 변화 거부", color: "#a78bfa" },
    5: { key: "기토(己土) — 논밭, 평원", desc: "성실하고 부지런하며 실용적입니다. 사람들을 돕고 조화를 이끄는 능력이 있습니다.", strength: "성실함, 실용성, 조화", weakness: "걱정 많음, 소극적", color: "#c4b5fd" },
    6: { key: "경금(庚金) — 원석, 큰 쇠", desc: "강직하고 원칙을 중시합니다. 결단력과 추진력으로 목표를 달성합니다.", strength: "결단력, 정의감, 추진력", weakness: "냉혹함, 융통성 부족", color: "#94a3b8" },
    7: { key: "신금(辛金) — 보석, 칼", desc: "날카로운 직관과 심미안을 지닙니다. 완벽을 추구하며 자신만의 스타일이 있습니다.", strength: "심미안, 직관력, 완벽주의", weakness: "예민함, 자존심 강함", color: "#cbd5e1" },
    8: { key: "임수(壬水) — 큰 바다, 강", desc: "넓은 포용력과 지혜로 많은 것을 담아냅니다. 아이디어가 풍부하고 창의적입니다.", strength: "포용력, 창의성, 지혜", weakness: "변덕, 집중력 부족", color: "#38bdf8" },
    9: { key: "계수(癸水) — 빗물, 샘물", desc: "섬세하고 직관적이며 영적인 감수성이 있습니다. 깊이 있는 통찰로 사람을 이해합니다.", strength: "직관력, 감수성, 이해심", weakness: "우울감, 의심 많음", color: "#7dd3fc" },
};