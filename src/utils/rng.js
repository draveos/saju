// Mulberry32 알고리즘 기반 시드 난수 생성
export function seededRandom(seed) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// 오늘 날짜 기준 배열에서 랜덤 추출 (운세, 명언 등에 사용)
export function getRandomItems(array, count) {
    const today = new Date();
    const seed = parseInt(`${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`);
    const randomGen = seededRandom(seed);

    let shuffled = [...array].sort(() => 0.5 - randomGen());
    return shuffled.slice(0, count);
}