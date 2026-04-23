// 포춘쿠키 까기 연출. 클릭 또는 자동 시작 → 쿠키 이미지를 좌우 절반으로 쪼갬 (clip-path) →
// 쪼개진 사이에서 쿠키 조각 튐 + 메시지 fade-in.

import { useState, useEffect, useRef } from "react";

interface Props {
  message: string;
  detail?: string;
  autoOpenMs?: number;  // 자동으로 까지는 딜레이 (null이면 클릭 대기)
}

export function CookieCrack({ message, detail, autoOpenMs = 800 }: Props) {
  const [cracked, setCracked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (autoOpenMs != null && !cracked) {
      timerRef.current = window.setTimeout(() => setCracked(true), autoOpenMs);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [autoOpenMs, cracked]);

  useEffect(() => {
    if (cracked) {
      const t = setTimeout(() => setRevealed(true), 550);
      return () => clearTimeout(t);
    }
  }, [cracked]);

  const cookieUrl = `${import.meta.env.BASE_URL}fortune_cookie.jpg`;

  return (
    <div className="cookie-scene">
      <div
        className={`cookie-stage ${cracked ? "cracked" : "intact"}`}
        onClick={() => !cracked && setCracked(true)}
        role="button"
        tabIndex={0}
        aria-label={cracked ? "쿠키가 열렸습니다" : "쿠키 까기"}
      >
        <img src={cookieUrl} alt="" className="cookie-half cookie-half-left" />
        <img src={cookieUrl} alt="" className="cookie-half cookie-half-right" />
        {cracked && (
          <div className="cookie-shards" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="cookie-shard" style={{
                left: `${45 + Math.random() * 10}%`,
                top: `${45 + Math.random() * 10}%`,
                animationDelay: `${i * 40}ms`,
                animationDuration: `${600 + Math.random() * 400}ms`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}>✦</span>
            ))}
          </div>
        )}
        {!cracked && (
          <div className="cookie-hint">톡, 쥐어짜듯 클릭하세요</div>
        )}
      </div>

      {revealed && (
        <div className="cookie-message">
          <p className="cookie-message-text">{message}</p>
          {detail && <p className="cookie-message-detail">{detail}</p>}
        </div>
      )}
    </div>
  );
}
