// 욕 200 돌파 시 다음 자정까지 잠금. 카운트다운 + 차분한 안내.
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  until: number | null;
}

function fmt(n: number) {
  return String(n).padStart(2, "0");
}

export function LockoutModal({ until }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!until) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [until]);

  if (!until || typeof document === "undefined") return null;

  const diff = Math.max(0, until - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return createPortal(
    <div className="lockout-overlay" aria-modal="true" role="dialog">
      <div className="lockout-card">
        <span className="lockout-icon" aria-hidden>😴</span>
        <p className="lockout-msg">
          오늘은 푹 쉬세요..
          <br />
          화는 건강에 안 좋아요.
        </p>
        <div className="lockout-timer">
          <span className="lockout-timer-label">내일 활성화까지</span>
          <span className="lockout-timer-value">
            {fmt(h)} : {fmt(m)} : {fmt(s)}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
