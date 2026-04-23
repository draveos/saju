// Grade별 연출.
// 대길: 파티클 전역 + 무한 낙하, 은은한 배경 glow (지속)
// 중길: 측면 파티클(1회) + warm glow (지속)
// 길  : subtle glow (지속)
// 평·소흉·흉: 마스코트 슬라이드-in → 고정 (말풍선 유지)
// 모든 레이어는 React Portal로 body에 직접 렌더 (stacking context 이탈).

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Grade = "대길" | "길" | "중길" | "평" | "소흉" | "흉" | string;

const MASCOT_LINES: Record<string, string> = {
  "평":   "평화로운 날이네요.",
  "소흉": "힘내요, 좋은 날은 언제나 와요.",
  "흉":   "괜찮아요, 이 또한 지나갑니다.",
};

const PARTICLE_CHARS = ["✦", "✧", "❈", "✿", "◆", "♦"];

interface Props {
  grade?: Grade;
}

export function FortuneGradeFX({ grade }: Props) {
  const [mascotVisible, setMascotVisible] = useState(false);

  const hasMascot = grade ? !!MASCOT_LINES[grade] : false;
  // 대길은 전역 무한 낙하 (30개), 중길은 측면 1회 (14개)
  const particleCount = grade === "대길" ? 30 : grade === "중길" ? 14 : 0;
  const isDaegil = grade === "대길";

  useEffect(() => {
    if (!hasMascot) return;
    const t = setTimeout(() => setMascotVisible(true), 500);
    return () => clearTimeout(t);
  }, [hasMascot, grade]);

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  return createPortal(
    <>
      {particleCount > 0 && (
        <div
          className={`fx-particles fx-particles-${isDaegil ? "daegil" : "jungil"}`}
          aria-hidden
        >
          {Array.from({ length: particleCount }).map((_, i) => {
            // 대길: 전역 (0~100%, 골고루) · 중길: 좌/우 측면(0~18 / 82~100)
            let left: number;
            if (isDaegil) {
              left = Math.random() * 100;
            } else {
              left = i % 2 === 0 ? Math.random() * 18 : 82 + Math.random() * 18;
            }
            const style: React.CSSProperties = {
              left: `${left}%`,
              animationDelay: `${Math.random() * 4000}ms`,
              animationDuration: `${3000 + Math.random() * 2500}ms`,
              fontSize: `${12 + Math.random() * 12}px`,
            };
            const ch = PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)];
            return (
              <span key={i} className="fx-particle" style={style}>{ch}</span>
            );
          })}
        </div>
      )}

      {grade === "길"   && <div className="fx-subtle-glow" aria-hidden />}
      {grade === "중길" && <div className="fx-warm-glow"   aria-hidden />}
      {isDaegil         && <div className="fx-big-glow"    aria-hidden />}

      {hasMascot && mascotVisible && (
        <div className="fx-mascot-wrap" aria-hidden>
          <img
            src={`${import.meta.env.BASE_URL}front_character.png`}
            alt=""
            className="fx-mascot-img"
          />
          <div className="fx-mascot-bubble">{MASCOT_LINES[grade!]}</div>
        </div>
      )}
    </>,
    portalTarget
  );
}
