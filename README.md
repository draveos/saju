<div align="center">

```
           ╭─────────╮
          ╱   ◉   ◉   ╲
         │      ▿      │
          ╲   ─────   ╱
           ╰─────────╯
           ╱│ ≡ ≡ ≡ │╲
          ╱ │   ✦   │ ╲
         │  │       │  │
         │  │   ☾   │  │
          ╲ │       │ ╱
           ╲│═══════│╱
            ╱‾‾‾‾‾‾‾╲
           ╱    ✦    ╲
          ╱ ═════════ ╲
```

# Celestial Oracle · 사주 웹앱

_별의 결을 읽고, 그대의 오늘을 속삭입니다._

[![Live Demo](https://img.shields.io/badge/live-draveos.github.io%2Fsaju-c9a84c?style=flat-square)](https://draveos.github.io/saju/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## ✨ 무엇을 하는 사이트인가요

생년월일시와 성별을 알려주시면, 자평명리 기반으로 **사주 팔자**를 펼쳐 **21 가지 카테고리의 리포트**를 읽어드립니다. 점쟁이가 직접 말을 거는 서사, 운세·포춘쿠키·명언을 한 번에 보는 **All in One**, 그리고 사이드에서 살짝 튀어나와 위로해주는 마스코트까지 — 차가운 계산 결과가 아닌, 조금은 따뜻한 한 장면을 지향합니다.

## 🔮 메뉴

| # | 메뉴 | 설명 |
|---|---|---|
| 01 | **타고난 사주와 성격 분석** | 생년월일시 입력 → 4주 팔자·오행·대운·21 카테고리 리포트 |
| 02 | **오늘의 전체 운세** | 등급(대길·길·중길·평·소흉·흉) + 맞춤 메시지 + 전역 연출 |
| 03 | **신비로운 포춘쿠키** | 클릭하면 쪼개지는 쿠키 + 메시지 + 럭키 넘버 |
| 04 | **오늘의 명언** | 명언을 글자 단위로 타이핑 · 인물 이름 낭독 |
| 05 | **All in One** | 위 셋을 한 눈에 + 클립보드 전체 복사 |

## 🏛️ 사주 엔진 (결정론)

- **만세력**: 한국천문연구원 기준 절기 **100년치(1919–2031)** UTC 시각 내장. 일주는 `2000-01-01 = 戊午일` 기준 계산. DST·timezone 이슈 방지.
- **유파 고정**: 자평명리, 야자시파(23시 → 다음날 일주), KST 경도보정 없음
- **6 Topics**: 12신살 · 12운성 · 공망 · 형충파해 · 합(육·삼·방·간합) · 절기
- **Harness → Codegen**: 각 주제의 rulebook JSON → Python codegen → 타입 안전한 TS 데이터 파일 생성
- **테스트**: 구조적 invariant 46 + ground-truth 55 + 각 topic tests = **213 passing**

## 📜 리포트 21 카테고리

| 그룹 | 카테고리 |
|---|---|
| 기본 | 좋은 점 · 주의할 점 · 타고난 인품(品) |
| 인생 단계 | 초년운(初) · 중년운(中) · 말년운(末) |
| 연애·결혼 | 연애운 · 연애 상대 · 연애 상대 인상 · 결혼 상대 · 결혼 상대 인상 · 결혼 시기 |
| 재물 | 재물운 · 재물 모으는 법(得) · 재물 지키는 법(防) |
| 능력·몸 | 직업운 · 학업운 · 건강운 · 체질운(體) · 친구관계 |
| 특수 계산 | 대길 나이(☀) · 결혼 시기 — 대운 구간 자동 추출 |

각 카테고리는 카테고리별 색상 + dashed separator + PDF 사주 책 톤의 긴 문단(`~라 하겠습니다`, `~가 되겠습니다`)으로 렌더링됩니다.

## 🎭 연출 (Portal 기반, stacking context 독립)

- **등급별 전역 연출** — 대길/중길은 파티클 비처럼·배경 glow·은은한 호흡 / 길은 subtle glow / 평·소흉·흉은 마스코트가 슬라이드-in 후 말풍선 고정
- **쿠키 까기** — 이미지가 좌우 절반으로 갈라지며 반짝이는 shard가 튕김
- **명언 타이핑** — 글자마다 gold flash → 흰색 정착, 작가 라인은 letter-spacing 좁혀지며 fade-in
- **욕하기 버튼** — 우하단 고정. 클릭할 때마다 특수기호가 캐릭터로 날아가 shake. 카운트에 따라 대사가 단계적으로 변합니다 (5/10/20/35/50/75/120). **200 도달 시 자정까지 잠금 + 카운트다운 모달**.

## 🛠 기술 스택

- **프런트**: React 19 · TypeScript · Vite 8 · Tailwind 4
- **엔진**: TypeScript (결정론 계산) · React Portal (전역 연출)
- **하네스**: Python 3 + sxtwl (만세력 검증용 — 로컬 전용)
- **테스트**: Vitest
- **배포**: GitHub Pages (`gh-pages` 브랜치)

## 🚀 로컬 실행

```bash
git clone https://github.com/draveos/saju.git
cd saju
npm install

npm run dev        # 개발 서버
npm test           # 213 tests
npm run build      # 프로덕션 번들 (dist/)
npm run deploy     # gh-pages 배포
```

## 📂 주요 구조

```
src/
├── App.tsx                    # 전체 라우팅·렌더
├── utils/
│   ├── sajuLogic.ts           # 만세력·십신·대운·오행
│   ├── narrative.ts           # 점쟁이 서사 생성
│   ├── reportGenerator.ts     # 21 카테고리 리포트
│   ├── comboEngine.ts         # 조건 매칭 엔진
│   └── *.test.ts              # 테스트
├── data/                      # ⚠ 자동 생성 — 수동 편집 금지
│   ├── sinsal.ts / unseong.ts / jeolgi.ts
│   ├── gongmang.ts / jiRelations.ts / hapRelations.ts
│   ├── ilju60.ts              # 60갑자 일주 해석 120 variations
│   ├── narrativeBank.ts       # 서사 대사 뱅크
│   ├── narrativeCombos.ts     # 조건부 서사 rule
│   └── reportRules.ts         # 21 카테고리 rules + fallbacks
├── components/
│   ├── FortuneTellerScene.tsx # ASCII 점쟁이 + 타이핑
│   ├── FortuneGradeFX.tsx     # 등급별 전역 연출
│   ├── CookieCrack.tsx / QuoteAvatar.tsx
│   ├── CurseLayer.tsx         # 욕하기 + 마스코트
│   ├── LockoutModal.tsx       # 자정 잠금 모달
│   └── Toast.tsx
└── assets/
    └── fortune_teller/        # mood별 이미지 슬롯 (선택)
```

## 🌙 설계 원칙

1. **결정론 먼저, 서사 나중** — 같은 생일은 언제 와도 같은 결과. seeded random으로 variation만 골라짐.
2. **학파 고정** — 자평명리만. 소스가 충돌하면 자평명리 기준으로 해소.
3. **계산과 콘텐츠 분리** — 엔진은 rulebook JSON에서 codegen. 콘텐츠 추가는 JSON 편집 → 재생성 한 번.
4. **Portal로 레이아웃 해방** — 연출 오버레이는 `document.body`에 직접 렌더해서 stacking context 무관하게 viewport 전체에 퍼짐.
5. **구조적 invariants 테스트** — 60갑자 주기, 五虎遁·五鼠遁, 합충의 대칭성 같은 수학적 속성은 데이터가 바뀌어도 깨지지 않도록 테스트로 고정.

## ⚠️ 면책

본 사이트는 **재미와 성찰**을 위한 서비스입니다. 제공되는 해석은 전통 명리 이론에 근거하되 현실의 의학·법률·재정 조언을 대체하지 않습니다. 결혼·투자·인간관계 같은 중요한 결정은 사주가 아니라 **당신의 판단**에 맡기시기 바랍니다.

## 📜 라이선스

MIT — 자유롭게 포크·수정·배포하셔도 좋습니다. 다만 사주의 해석 톤과 뉘앙스는 수동으로 다듬은 부분이 많으니, 참고하실 때는 원 저자를 한 번 떠올려주시면 감사하겠습니다.

---

<div align="center">

_명(命)은 하늘이 정하나, 운(運)은 그대가 움직입니다._

Made with 🌟 by [draveos](https://github.com/draveos)

</div>
