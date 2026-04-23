// 명언 디스플레이 — 아바타·말풍선 없이 텍스트 중심.
// 큰 따옴표 ornament + 글자별 gold flash 타이핑 + em-dash 작가 라인.

interface Props {
  author: string;
  text: string;
}

export function QuoteAvatar({ author, text }: Props) {
  const chars = Array.from(text);
  return (
    <div className="quote-display">
      <span className="quote-mark quote-mark-open" aria-hidden>"</span>
      <p className="quote-display-body">
        {chars.map((c, i) => (
          <span
            key={i}
            className="quote-char"
            style={{ animationDelay: `${i * 34}ms` }}
          >
            {c === " " ? " " : c}
          </span>
        ))}
      </p>
      <p className="quote-display-author">— {author}</p>
    </div>
  );
}
