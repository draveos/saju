# 점쟁이 캐릭터 이미지

`src/components/FortuneTellerScene.tsx`가 대사 mood에 맞춰 자동 전환.

## 파일명 & mood

| 파일명 | mood | 쓰임 |
|---|---|---|
| `welcome.png`     | welcome     | 첫 인사 — "드디어 왔는가" |
| `reading.png`     | reading     | 집중 — 사주를 펼쳐 읽는 자세 |
| `insight.png`     | insight     | 기본 설명 (가장 많이 쓰임) |
| `warning.png`     | warning     | 우려 — 오행 편중·부정 신살 |
| `encouraging.png` | encouraging | 격려 — 긍정 신살·대운 순행 |
| `closing.png`     | closing     | 마무리 — 끝맺음 |

## Tier

- **Tier 1 (필수 3장)**: `welcome`, `insight`, `closing`
- **Tier 2 (+3장)**: `reading`, `warning`, `encouraging`

Tier 1만 있어도 fallback 로직이 `insight`로 대체해서 작동함.

## 스펙

- 포맷: `.png` (투명 배경 권장) 또는 `.webp`
- 해상도: **세로 400~600px**, 가로는 비율대로 (초상화 비율 권장 3:4)
- 같은 캐릭터의 **다른 표정/포즈** — 일관된 스타일 필수
- 배경 투명 (scene의 어두운 그라디언트에 얹힘)

## 연결 방법

파일을 이 디렉토리에 넣은 뒤 `FortuneTellerScene.tsx` 상단의 `MOOD_IMAGES`에 import 경로 추가:

```ts
import insightImg from "../assets/fortune_teller/insight.png";

const MOOD_IMAGES: Record<FortuneMood, string | null> = {
  ...
  insight: insightImg,  // null에서 import로 바꾸기
  ...
};
```

null인 mood는 자동으로 ASCII fallback으로 표시됨.
