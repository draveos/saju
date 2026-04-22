// 점쟁이 scene — mood별 캐릭터 이미지 전환 + 타이핑 대사.
// 이미지 없으면 ASCII fallback.

import { useEffect, useRef, useState } from "react";
import { FORTUNE_TELLER_ASCII } from "../data/asciiFortuneTeller";
import type { FortuneMood, NarrativeLine } from "../utils/narrative";

// 이미지 import는 ~/IdeaProjects/saju/src/assets/fortune_teller/README.md 참고.
// 이미지 준비되면 null을 import로 교체.
// 예: import insightImg from "../assets/fortune_teller/insight.png";
const MOOD_IMAGES: Record<FortuneMood, string | null> = {
  welcome: null,
  reading: null,
  insight: null,
  warning: null,
  encouraging: null,
  closing: null,
};

// 이미지 없는 mood는 어느 mood로 fallback할지 (결국 최후엔 ASCII)
const MOOD_FALLBACK: Record<FortuneMood, FortuneMood> = {
  welcome: "insight",
  reading: "insight",
  insight: "insight",
  warning: "insight",
  encouraging: "insight",
  closing: "insight",
};

function resolveImage(mood: FortuneMood): string | null {
  let cur: FortuneMood = mood;
  const seen = new Set<FortuneMood>();
  while (!seen.has(cur)) {
    if (MOOD_IMAGES[cur]) return MOOD_IMAGES[cur];
    seen.add(cur);
    cur = MOOD_FALLBACK[cur];
  }
  return null;
}

const CHAR_DELAY_MS = 28;
const DEFAULT_LINE_PAUSE_MS = 280;

interface Props {
  lines: NarrativeLine[];
}

export function FortuneTellerScene({ lines }: Props) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (done) return;
    if (skip) {
      setLineIdx(lines.length);
      setCharIdx(0);
      setDone(true);
      return;
    }
    if (lineIdx >= lines.length) {
      setDone(true);
      return;
    }
    const currentLine = lines[lineIdx];
    if (charIdx < currentLine.text.length) {
      timerRef.current = window.setTimeout(() => setCharIdx((c) => c + 1), CHAR_DELAY_MS);
    } else {
      const pause = currentLine.pauseAfterMs ?? DEFAULT_LINE_PAUSE_MS;
      timerRef.current = window.setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, pause);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [lineIdx, charIdx, skip, done, lines]);

  const shownLines = skip
    ? lines.map((l) => l.text)
    : [
        ...lines.slice(0, lineIdx).map((l) => l.text),
        ...(lineIdx < lines.length ? [lines[lineIdx].text.slice(0, charIdx)] : []),
      ];

  // 현재 진행중 라인의 mood (완료 후에는 마지막 라인의 mood 유지)
  const activeMood: FortuneMood =
    (lineIdx < lines.length ? lines[lineIdx]?.mood : lines[lines.length - 1]?.mood) ?? "insight";
  const activeImage = resolveImage(activeMood);

  return (
    <div className="fortune-teller-scene">
      <div className={`fortune-teller-figure mood-${activeMood}`}>
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt="점쟁이"
            className="fortune-teller-img"
          />
        ) : (
          <pre className="fortune-teller-art" aria-hidden="true">
            {FORTUNE_TELLER_ASCII}
          </pre>
        )}
      </div>
      <div className="fortune-teller-dialogue">
        {shownLines.map((t, i) => (
          <p key={i} className={`ft-line ${i === shownLines.length - 1 && !done ? "ft-line-typing" : ""}`}>
            {t}
            {i === shownLines.length - 1 && !done && <span className="ft-cursor">▍</span>}
          </p>
        ))}
        {!done && (
          <button className="ft-skip" onClick={() => setSkip(true)}>
            전체 보기 ▸
          </button>
        )}
      </div>
    </div>
  );
}
