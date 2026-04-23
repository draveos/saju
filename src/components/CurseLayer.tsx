// 사이드 "욕하기" 버튼 + 날아가는 특수기호. body-level Portal로 stacking context 이탈.
import { createPortal } from "react-dom";

export interface CurseProjectile {
  id: number;
  symbol: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Props {
  active: boolean;          // 홈(intro)에서만 true
  disabled?: boolean;
  count: number;
  projectiles: CurseProjectile[];
  onThrow: () => void;
}

export function CurseLayer({ active, disabled, count, projectiles, onThrow }: Props) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <>
      {active && (
        <button
          type="button"
          className="curse-btn"
          onClick={onThrow}
          disabled={disabled}
          aria-label="욕하기"
          title={disabled ? "오늘은 잠시 쉬어요" : "스트레스 풀기 — 캐릭터에게 특수기호 던지기"}
        >
          <span className="curse-btn-icon">{disabled ? "😴" : "😤"}</span>
          <span className="curse-btn-label">{disabled ? "쉬는 중" : "욕하기"}</span>
          {count > 0 && <span className="curse-btn-count">{count}</span>}
        </button>
      )}
      {projectiles.map((p) => (
        <span
          key={p.id}
          className="curse-projectile"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            ["--dx" as unknown as string]: `${p.dx}px`,
            ["--dy" as unknown as string]: `${p.dy}px`,
          } as React.CSSProperties}
          aria-hidden
        >
          {p.symbol}
        </span>
      ))}
    </>,
    document.body
  );
}
