// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/report_rules.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/report_rules_to_ts.py to regenerate.

export type ReportCategory = "strengths" | "cautions" | "love" | "partner" | "marriage" | "wealth" | "career" | "academic" | "health" | "friendship" | "lucky_ages";

export interface ReportCategoryMeta {
  key: ReportCategory;
  labelKr: string;
  icon: string;
  order: number;
}

export const REPORT_CATEGORIES: readonly ReportCategoryMeta[] = [
  { key: "strengths", labelKr: "좋은 점", icon: "✦", order: 0 },
  { key: "cautions", labelKr: "주의할 점", icon: "⚠", order: 1 },
  { key: "love", labelKr: "연애운", icon: "❤", order: 2 },
  { key: "partner", labelKr: "연애 상대", icon: "♡", order: 3 },
  { key: "marriage", labelKr: "결혼 상대", icon: "◈", order: 4 },
  { key: "wealth", labelKr: "재물운", icon: "⟡", order: 5 },
  { key: "career", labelKr: "직업운", icon: "◇", order: 6 },
  { key: "academic", labelKr: "학업운", icon: "✎", order: 7 },
  { key: "health", labelKr: "건강운", icon: "♆", order: 8 },
  { key: "friendship", labelKr: "친구관계", icon: "◍", order: 9 },
  { key: "lucky_ages", labelKr: "대길 나이", icon: "☀", order: 10 },
] as const;

export const REPORT_FALLBACKS: Record<ReportCategory, readonly string[]> = {
  strengths: [
    `일간의 본래 성정을 신뢰하되, 틈틈이 밖의 조언도 섞어 쓸 수 있다면 그대의 장점이 더 오래간다.`,
    `그대가 가진 오행의 결이 또렷하다 — 무리하게 맞추려 하지 말고, 자신의 축을 중심으로 뻗어라.`
  ],
  cautions: [
    `큰 탈은 없으나, 자신의 기운이 한쪽으로 쏠리지 않는지 주기적으로 점검이 필요하다.`,
    `조급함이 가장 큰 적이다. 결정을 서두르는 자리에서 손실이 생기기 쉽다.`
  ],
  love: [
    `관계는 속도보단 결. 감정이 갑자기 타오르는 때일수록 한 걸음 물러서서 볼 것.`,
    `연(緣)은 오는 것이지 억지로 여는 것이 아니다. 자신을 정돈해 둔 자리에서 인연이 찾아든다.`
  ],
  partner: [
    `그대와 기질이 정반대인 사람에게 끌리기 쉬우나, 오래 함께할 결은 가치관이 통하는 쪽이다.`,
    `자신의 오행 중 약한 부분을 채워주는 상대를 의식해서 보라. 그런 만남이 오래간다.`
  ],
  marriage: [
    `결혼은 사주의 큰 매듭 중 하나다 — 한 번에 결정하려 하기보단 시기와 흐름을 함께 보라.`,
    `같은 리듬을 가진 사람보다, 다른 리듬에 호흡을 맞출 수 있는 사람이 평생의 동반자가 된다.`
  ],
  wealth: [
    `재물은 그대의 오행 균형이 잡혀있을 때 따라붙는다. 한쪽으로 쏠린 욕심이 샛길을 만든다.`,
    `큰 돈보단 흐름이 끊기지 않는 구조를 만드는 게 그대 사주에 맞는 방식이다.`
  ],
  career: [
    `일간의 성정에 맞는 직군에서 빛난다 — 억지로 다른 색을 덧칠하려 하지 말라.`,
    `30대 이후 대운의 방향을 보고 업을 굳히는 것이 좋다. 젊은 시기의 시행착오는 재료가 된다.`
  ],
  academic: [
    `공부의 힘은 인성(印星)에서 온다. 조용히 혼자 집중하는 시간이 그대에게 가장 큰 투자다.`,
    `단기 암기보단 구조적 이해에 맞는 사주. 급하게 밀어붙이면 오히려 길어진다.`
  ],
  health: [
    `편중된 오행이 있다면 그 장부(臟腑)를 의식해서 돌봐야 한다. 작은 신호를 무시하지 말 것.`,
    `과로보단 리듬의 붕괴가 더 큰 타격이 된다. 규칙적인 생활이 그대의 가장 강한 약이다.`
  ],
  friendship: [
    `넓게 사귀기보단 깊게 사귀는 쪽이 그대에게 맞는다. 오래 볼 수 있는 몇을 소중히 하라.`,
    `비견·겁재의 기운을 가진 동료가 때론 경쟁자로 보이나, 결국 서로 성장시키는 관계가 된다.`
  ],
  lucky_ages: [
    `대운 중 본인의 기운이 가장 안정되는 구간을 아래에 정리해 두었다. 큰 결단은 이 시기에 가깝게.`,
    `대길의 시기는 한 번에 오지 않는다. 여러 번의 작은 봉우리를 차곡차곡 쌓으라.`
  ],
};

// ComboWhen 스키마는 narrativeCombos.ts와 동일 — 재사용
import type { ComboWhen } from "./narrativeCombos";

export interface ReportRule {
  id: string;
  category: ReportCategory;
  when: ComboWhen;
  lines: readonly string[];
}

export const REPORT_RULES: readonly ReportRule[] = [
  { id: "love_doha_day", category: "love", when: { sinsal_on_day: "yeonsal" }, lines: [`일지에 도화가 박혔다 — 타인의 시선을 끄는 매력을 타고났다. 다만 그 매력에 스스로가 휩쓸리지 않도록 경계하라.`, `도화의 기운이 일지에 있으니 연애 운동성이 강하다. 다가오는 사람이 많을수록 선별하는 지혜가 중요하다.`] },
  { id: "marriage_chung_year_day", category: "marriage", when: { has_samhyeong: false, forward: true }, lines: [`결혼의 시기에 대운이 순행하니, 급하게 결정하기보단 시기가 익을 때를 기다리는 편이 좋다.`, `정관·편관의 기운이 안정된 시기에 결혼이 수월하다. 대운 중 관성(官星)이 드러나는 구간을 눈여겨 보라.`] },
  { id: "wealth_metal_dom", category: "wealth", when: { dom_element: "metal" }, lines: [`金의 기운이 강한 사주는 재물의 흐름을 정확히 계산하는 능력이 타고났다. 다만 너무 냉정해 인덕이 흐려질 수 있다.`, `결단과 절단의 기운이 강하니 재물 관리에서 손절·진입 타이밍이 중요하다.`] },
  { id: "career_fire_dom", category: "career", when: { dom_element: "fire" }, lines: [`火의 기운이 강해 표현력·리더십이 드러나는 직군에 적합하다 — 교육, 방송, 영업, 예술.`, `불의 기운이 넘치니 정적인 업무보단 사람을 상대하는 자리에서 빛난다.`] },
  { id: "career_water_dom", category: "career", when: { dom_element: "water" }, lines: [`水의 기운이 강해 사고·기획·연구의 영역에서 강점이 드러난다. 반복 실무보단 구조를 짜는 자리가 맞는다.`, `물의 지혜가 흐르니, 분석·전략·컨설팅 같은 지적 설계 업무에 어울린다.`] },
  { id: "health_fire_dom", category: "health", when: { dom_element: "fire" }, lines: [`火 편중 — 심장·혈압·안과 계통을 의식해서 챙기는 것이 좋다. 스트레스가 곧바로 몸으로 드러나는 결이다.`, `불이 강한 사주는 열이 차오르기 쉬우니, 수분 보충과 충분한 수면이 평범한 건강법보다 훨씬 중요하다.`] },
  { id: "health_water_dom", category: "health", when: { dom_element: "water" }, lines: [`水 편중 — 신장·비뇨기·하체 순환을 의식하라. 찬 기운에 특히 약한 결이다.`, `물이 많은 사주는 몸이 쉽게 무거워질 수 있다. 꾸준한 운동이 그대의 가장 좋은 보약이다.`] },
  { id: "academic_inseong_strong", category: "academic", when: { unseong_on_month: "jangsaeng" }, lines: [`월지에 장생의 기운이 있으니 학문·연구로 뻗어나가는 힘이 본래 강하다. 긴 호흡의 공부가 어울린다.`, `성장의 기운이 월지에 자리잡았다 — 꾸준히 쌓아가는 방식에서 실력이 드러난다.`] },
  { id: "cautions_samhyeong", category: "cautions", when: { has_samhyeong: true }, lines: [`삼형의 기운이 엉켜 있으니, 관재·시비·법적 분쟁을 가장 경계해야 한다. 직접 맞서지 말고 돌아서 가라.`, `세 지지가 얽히는 사주는 극단의 선택이 쉽게 유혹한다. 결정 전에 하루 묵히는 습관을 들일 것.`] },
  { id: "cautions_jahyeong", category: "cautions", when: { has_jahyeong: true }, lines: [`자형의 기운이 있으니 스스로를 너무 몰아붙이는 것이 가장 큰 위험이다. 자기 점검의 시간을 두어라.`, `같은 기운이 반복되는 자형은 고집·독선을 키우기 쉽다. 의식해서 밖의 소리를 들이는 훈련이 필요하다.`] },
  { id: "friendship_water_dom", category: "friendship", when: { dom_element: "water" }, lines: [`水가 강한 사주는 친구 관계가 깊고 끈끈하다. 한번 맺은 인연은 오래가되, 소수를 선택하는 편이다.`, `물의 기운이 강하니 말수보단 경청에서 신뢰가 쌓인다 — 그대의 친구관계는 조용히 깊어진다.`] },
  { id: "strengths_forward", category: "strengths", when: { forward: true }, lines: [`대운이 순행하니, 쌓을수록 돌아오는 구조다. 꾸준함이 그대의 가장 큰 강점이 된다.`, `시간이 그대 편에 서 있는 사주다. 서두르지 않아도 결과가 붙는 결이니 조급해 말 것.`] },
  { id: "strengths_jangseong_day", category: "strengths", when: { sinsal_on_day: "jangseongsal" }, lines: [`일지에 장성살이 박혔다 — 리더십과 카리스마를 타고난 사주. 무리 속에서 자연스럽게 중심이 된다.`, `장성의 별이 일지에 있으니, 결단을 내려야 할 자리에서 주저하지 말라. 타고난 자리다.`] },
  { id: "strengths_wood_dom", category: "strengths", when: { dom_element: "wood" }, lines: [`木의 기운이 강해 성장·확장의 의지가 타고났다. 한 분야에 뿌리를 박고 뻗어가는 결이다.`, `뻗어가는 힘이 강한 사주 — 새로운 도전 앞에서 머뭇거림이 적다는 것이 그대의 가장 큰 자산이다.`] },
  { id: "cautions_chung_day_year", category: "cautions", when: { has_samhyeong: false, forward: false }, lines: [`대운이 역행하니 젊은 날에 시행착오가 많을 수 있다. 조급한 결정보단 천천히 방향을 다듬어라.`, `거스르는 흐름이 있는 사주 — 정면 돌파보단 돌아가는 길이 그대에게 맞는 선택이다.`] },
  { id: "cautions_lack_water", category: "cautions", when: { lack_element: "water" }, lines: [`水가 빠져있으니 감정에 휘둘리기 쉽다. 중요한 결정은 한 번 자고 나서 내리는 습관을 들여라.`, `물의 기운이 없어 조급함이 쌓인다. 깊이 생각하는 시간을 억지로라도 확보해야 한다.`] },
  { id: "cautions_gongmang_year", category: "cautions", when: { gongmang_on_year: true }, lines: [`연주 공망이 있어 가족·뿌리의 덕이 약하다. 의지할 곳이 적은 만큼 자립심이 곧 생존력이다.`, `뿌리 자리가 비어있는 사주 — 스스로의 기반을 쌓는 데 특히 신경 써야 한다.`] },
  { id: "love_wood_dom", category: "love", when: { dom_element: "wood" }, lines: [`木이 강한 사주는 관계에서도 직진형. 좋아하는 마음을 숨기지 못하고 표현하는 편이다.`, `성장하는 기운이 강해 연인과 함께 발전해 나가는 관계를 선호한다. 정체된 관계는 금방 질린다.`] },
  { id: "love_water_dom", category: "love", when: { dom_element: "water" }, lines: [`水의 기운이 깊어 은근한 매력이 있다. 첫인상보단 오래 볼수록 빠지는 타입이다.`, `물의 결이라 감정의 파고를 상대가 읽기 어렵다. 말로 더 표현하는 습관이 관계를 편하게 한다.`] },
  { id: "partner_gap_eul", category: "partner", when: { day_stem_in: [0,1] }, lines: [`목(木) 일간의 그대는 庚·辛(금)을 다루는 사람이나, 壬·癸(수)로 감싸주는 사람에게서 깊은 안정을 느낀다.`, `갑·을 일간은 현실적이고 단호한 파트너에게 끌리는 편. 서로 결핍을 채워주는 관계가 오래간다.`] },
  { id: "partner_byeong_jeong", category: "partner", when: { day_stem_in: [2,3] }, lines: [`화(火) 일간의 그대는 壬·癸(수)로 식혀주는 사람이나, 戊·己(토)로 담아주는 사람에게서 균형을 찾는다.`, `병·정 일간은 감정 기복을 받아줄 수 있는 묵직한 파트너가 평생의 쉼터가 된다.`] },
  { id: "marriage_gongmang_hour", category: "marriage", when: { gongmang_on_hour: true }, lines: [`시주 공망으로 결혼 시기의 결이 흐릿하다. 서두른 결혼보다 자신의 자리를 먼저 안정시키고 보라.`, `말년 자리가 비어있으니, 배우자의 기반까지 함께 살피는 안목이 필요하다.`] },
  { id: "marriage_jangseong_day", category: "marriage", when: { sinsal_on_day: "jangseongsal" }, lines: [`일지 장성 — 결혼 이후 본인이 관계의 중심이 되기 쉽다. 파트너의 자율을 의식해서 존중하라.`, `장성의 별이 배우자궁에 있으니, 자기주장이 강한 사주. 양보의 순간이 관계를 유지한다.`] },
  { id: "wealth_earth_dom", category: "wealth", when: { dom_element: "earth" }, lines: [`土의 기운이 두터워 재물을 쌓는 안정감이 있다. 큰 기회보단 꾸준한 축적으로 결실을 본다.`, `흙이 많은 사주는 부동산·저축 같은 형태의 재산이 어울린다. 변동성 큰 투자는 조심.`] },
  { id: "wealth_lack_metal", category: "wealth", when: { lack_element: "metal" }, lines: [`金이 빠져있어 손절·결단의 타이밍이 약하다. 손실을 인정하는 훈련이 재물 관리의 핵심이다.`, `끊어낼 때 끊지 못하는 결이니, 규칙(손실 한도·매도 기준)을 먼저 정해놓고 지키는 습관이 필요하다.`] },
  { id: "career_metal_dom", category: "career", when: { dom_element: "metal" }, lines: [`金의 기운이 강해 결단·법·공학 계열에서 빛난다 — 판사, 엔지니어, 군인, 감사직 등이 어울린다.`, `쇠의 원칙이 강한 사주 — 모호한 자리보다 룰이 명확한 조직에서 역량을 발휘한다.`] },
  { id: "career_earth_dom", category: "career", when: { dom_element: "earth" }, lines: [`土가 강한 사주는 사람과 자본을 매개하는 직군이 어울린다 — 중개, 부동산, 금융, 교육행정.`, `흙의 기운이 두터워 신뢰가 쌓이는 자리에서 오래간다. 단기 성과보단 관계로 승부하는 업이 맞는다.`] },
  { id: "academic_lack_fire", category: "academic", when: { lack_element: "fire" }, lines: [`火가 빠져있어 추진력보다 지구력이 공부의 축이 된다. 단기 집중보단 긴 호흡으로 쌓는 방식이 맞는다.`, `불의 기운이 약하니 혼자 공부보단 스터디·멘토 같은 외부 에너지를 들이는 게 큰 도움이 된다.`] },
  { id: "academic_mogyok_month", category: "academic", when: { unseong_on_month: "mogyok" }, lines: [`월지에 목욕의 기운이 있어 배움의 결이 예술·감성 쪽으로 기운다. 논리만이 아니라 감각을 살리는 과목에서 힘을 얻는다.`, `목욕운성의 월지 — 공부의 몰입도는 좋으나 한 곳에 오래 매이기 어렵다. 주제를 여러 번 바꾸는 것도 그대의 방식이다.`] },
  { id: "health_wood_dom", category: "health", when: { dom_element: "wood" }, lines: [`木 편중 — 간·담·근육 계통을 의식하라. 분노와 짜증이 곧바로 몸의 긴장으로 옮겨가기 쉬운 결이다.`, `나무의 기운이 강한 사주는 스트레칭·유산소가 약이다. 몸을 굳히는 습관이 가장 큰 적이다.`] },
  { id: "health_earth_dom", category: "health", when: { dom_element: "earth" }, lines: [`土 편중 — 비·위·소화기 쪽을 특히 살펴야 한다. 불규칙한 식사는 곧바로 몸의 신호로 돌아온다.`, `흙이 많은 사주는 몸이 무거워지기 쉽다. 식사량 조절과 규칙적인 걷기가 가장 효과적인 건강법이다.`] },
  { id: "friendship_wood_dom", category: "friendship", when: { dom_element: "wood" }, lines: [`木의 기운이 강해 친구를 가볍게 사귀기보단 깊이 있는 소수를 선택한다. 인맥보단 동반자에 가까운 관계를 원하는 결이다.`, `나무의 결 — 친구에게 헌신하는 편이나, 배신에 큰 타격을 받는다. 경계를 설정하는 연습이 필요하다.`] },
  { id: "friendship_jahyeong", category: "friendship", when: { has_jahyeong: true }, lines: [`자형이 있어 자기 세계에 갇히기 쉬우니, 성향이 다른 친구를 의식적으로 곁에 두는 게 좋다.`, `같은 결의 사람과만 어울리면 오히려 자기 한계가 도드라진다. 다양한 배경의 친구가 약이 된다.`] },
  { id: "strengths_samhap", category: "strengths", when: { has_samhap: true }, lines: [`삼합이 성립하는 사주 — 사회적 성취와 집단의 흐름이 그대 편에 서는 큰 축복의 결이다.`, `세 지지가 하나로 뭉치니, 혼자보다 함께할 때 훨씬 큰 힘을 낸다. 팀 속에서 빛나는 사주다.`] },
  { id: "strengths_ganhap", category: "strengths", when: { has_ganhap: true }, lines: [`천간에 간합이 있어 내면의 결속이 강하다. 겉과 속이 어긋나지 않는 단단한 사주다.`, `간합의 기운이 있으니 본질적 변화의 순간에 긍정적인 방향으로 나아간다.`] },
  { id: "love_yukhap", category: "love", when: { has_yukhap: true }, lines: [`사주에 육합이 있어 연(緣)이 잘 맺히는 결이다. 좋은 인연이 자연스럽게 찾아드는 사주.`, `합의 기운이 있으니 연애에서 갈등보단 조화가 많다. 다만 이별 후에도 미련이 깊은 편이다.`] },
  { id: "marriage_ganhap", category: "marriage", when: { has_ganhap: true }, lines: [`천간합이 있어 결혼 후 배우자와 서로 비슷해지는 경향. 세월이 흐를수록 닮아가는 부부가 된다.`, `간합의 축 — 결혼이 그대의 본질을 한 번 바꿔놓는 결정이 될 가능성이 크다.`] },
  { id: "wealth_samhap", category: "wealth", when: { has_samhap: true }, lines: [`삼합의 기운이 있어 재물도 사람을 통해 들어오는 결이다. 혼자 모으기보단 좋은 동료·파트너가 열쇠가 된다.`, `집단의 합을 타는 재운 — 신뢰하는 팀 속에서 기회가 열리는 사주다.`] },
  { id: "career_banghap", category: "career", when: { has_banghap: true }, lines: [`방합이 있어 시기·환경이 그대에게 유리하게 흐른다. 흐름을 거스르지 않고 타는 방식이 맞는다.`, `계절의 기운이 밀어주는 사주 — 조직 안에서 자연스럽게 올라가는 결이다.`] },
  { id: "partner_metal_dom", category: "partner", when: { day_stem_in: [6,7] }, lines: [`금(金) 일간의 그대는 丙·丁(화)로 녹여주는 사람이나, 甲·乙(목)로 다스리는 관계에서 균형을 찾는다.`, `경·신 일간은 원칙이 뚜렷해, 부드럽고 유연한 파트너가 오래 함께하는 상대가 된다.`] },
  { id: "partner_water_dom", category: "partner", when: { day_stem_in: [8,9] }, lines: [`수(水) 일간의 그대는 戊·己(토)로 담아주는 사람이나, 丙·丁(화)로 데워주는 관계에 끌린다.`, `임·계 일간은 사유가 깊어, 그 깊이를 읽어줄 수 있는 사람을 만나야 오래 간다.`] },
  { id: "health_metal_dom", category: "health", when: { dom_element: "metal" }, lines: [`金 편중 — 폐·대장·호흡기 계통을 의식하라. 건조한 환경에 특히 약한 결이다.`, `쇠가 많은 사주는 근육 긴장·뻣뻣함이 쉽게 쌓인다. 깊은 호흡과 유연성 운동이 보약이다.`] },
  { id: "academic_lack_water", category: "academic", when: { lack_element: "water" }, lines: [`水가 빠져 깊이 있는 사고·연구가 어려울 수 있다. 노트·요약·정리 같은 외부 도구가 그대의 기억을 돕는다.`, `물의 기운이 없으니 혼자 깊이 파기보단, 토론·발표로 지식을 정리해가는 방식이 효율적이다.`] },
  { id: "cautions_lack_metal", category: "cautions", when: { lack_element: "metal" }, lines: [`金이 빠져 결단의 순간을 미루는 버릇이 최대의 적이다. 미루지 말고 끊어내는 연습이 필요하다.`, `쇠의 기운이 없어 경계가 흐릿해지기 쉽다. 자신만의 원칙 리스트를 문서로 남겨두는 것이 도움이 된다.`] },
  { id: "friendship_yukhap", category: "friendship", when: { has_yukhap: true }, lines: [`사주에 합이 있어 친구 관계가 자연스럽게 맺어진다. 억지로 다가가지 않아도 끌리는 사람이 나타나는 결이다.`, `육합의 기운이 있으니 인연이 끈끈하다. 한번 만난 친구와 십 년 넘는 관계가 되기 쉽다.`] },
  { id: "wealth_wood_dom", category: "wealth", when: { dom_element: "wood" }, lines: [`木의 기운이 강해 성장형 자산에서 이익을 본다. 장기 투자·교육·콘텐츠 같은 '키우는' 종류의 재물이 맞는다.`, `나무가 자라는 시간이 필요한 사주 — 단기 차익보단 긴 호흡의 축적이 자기 결에 맞는 방식이다.`] },
  { id: "strengths_lack_element_balance", category: "strengths", when: { lack_element: "fire" }, lines: [`火가 빠진 사주지만, 그것이 오히려 차분한 판단력을 선물한다. 감정에 덜 휘둘리는 결이다.`, `불의 기운이 없어 조급함이 적다 — 장기전에서 이기는 사주다.`] },
  { id: "strengths_yeokma_day", category: "strengths", when: { sinsal_on_day: "yeokmasal" }, lines: [`일지 역마 — 변화에 두려움이 없는 결이다. 새 환경이 오히려 그대를 키운다.`, `역마의 별이 일지에 — 이동·여행·해외와 인연이 깊다. 그 자리가 곧 기회다.`] },
  { id: "strengths_unseong_jangsaeng_day", category: "strengths", when: { unseong_on_day: "jangsaeng" }, lines: [`일지에 장생의 운성 — 사주의 시작이 깨끗하고 맑다. 새로 시작하는 일에 강한 결이다.`, `장생의 자리에 일주가 박힌 사주 — 처음 마주하는 일에 두려움이 적은 사람이다.`] },
  { id: "cautions_dom_fire_lack_water", category: "cautions", when: { dom_element: "fire", lack_element: "water" }, lines: [`火 편중 + 水 결핍 — 감정이 폭발하기 쉬운 결이다. 하루 한 번이라도 침잠하는 시간이 약이 된다.`, `불은 많고 물이 없으니 식힐 길이 없다. 의식해서 멈춤·휴식을 일정에 박아두어라.`] },
  { id: "cautions_dom_metal_lack_fire", category: "cautions", when: { dom_element: "metal", lack_element: "fire" }, lines: [`金 편중 + 火 결핍 — 차갑게 잘라내기만 하다가 인덕을 잃기 쉽다. 따뜻한 표현을 의식해서 더하라.`, `쇠가 강하고 불이 없으니 사람이 무서워한다. 부드러운 한 마디가 그대를 살리는 결이다.`] },
  { id: "love_jangseong_day", category: "love", when: { sinsal_on_day: "jangseongsal" }, lines: [`일지 장성 — 연애에서도 본인이 주도권을 쥐는 편. 다만 상대를 누르지 않도록 의식해야 한다.`, `장성의 별이 배우자궁에 — 강한 매력의 소유자이나, 동등한 관계가 오래 간다.`] },
  { id: "love_lack_fire", category: "love", when: { lack_element: "fire" }, lines: [`火가 없어 표현이 서툴 수 있다. 마음을 말로 옮기는 연습이 그대의 가장 큰 연애 기술이 된다.`, `불의 기운이 없으니 먼저 다가가는 데 시간이 걸린다 — 그래도 진심은 결국 전해지는 결이다.`] },
  { id: "partner_fire_dom", category: "partner", when: { dom_element: "fire" }, lines: [`火가 강한 그대는 차분하고 깊이 있는 사람과 균형이 맞는다. 비슷하게 뜨거운 상대와는 부딪히기 쉽다.`, `불의 기운이 강하니, 들어주는 사람·받아주는 사람이 평생의 짝이 된다.`] },
  { id: "marriage_yukhap", category: "marriage", when: { has_yukhap: true }, lines: [`사주에 육합이 있으니, 결혼이 자연스럽게 흘러오는 결이다. 너무 따지지 않아도 인연이 맺어진다.`, `합의 기운 — 결혼 후 부부 관계가 원만하다. 큰 충돌보다 잔잔한 일상이 이어지는 사주다.`] },
  { id: "wealth_dom_water", category: "wealth", when: { dom_element: "water" }, lines: [`水 편중 — 정보·아이디어로 재물을 만드는 결이다. 머리를 쓰는 자리에서 수익이 따른다.`, `물의 기운이 강한 사주는 흐름을 읽는 힘이 강하다. 금융·트렌드·콘텐츠 분야가 어울린다.`] },
  { id: "career_wood_dom", category: "career", when: { dom_element: "wood" }, lines: [`木이 강한 그대는 성장형 산업·교육·창업 영역에서 빛난다. 키우는 일이 그대의 결이다.`, `나무의 기운 — 정해진 매뉴얼보단 새로운 영역을 개척하는 자리가 적성이다.`] },
  { id: "career_jewang_day", category: "career", when: { unseong_on_day: "jewang" }, lines: [`일지 제왕 — 자기 사업·자영·임원직에서 가장 빛난다. 누군가 밑에 있는 자리는 답답하다.`, `본인 자리가 강한 운성 — 결정권을 쥐는 자리에 본래 어울리는 사주다.`] },
  { id: "academic_inseong_day", category: "academic", when: { unseong_on_day: "geonnok" }, lines: [`일지 건록 — 자립 정신이 강해 스스로 학습 계획을 짜는 방식이 어울린다. 외부 강제는 오히려 비효율.`, `건록의 운성 — 직업·자격증 같은 실용 학습에 강한 결이다.`] },
  { id: "health_lack_water", category: "health", when: { lack_element: "water" }, lines: [`水가 빠져 신장·방광·생식기 계통이 약하다. 충분한 수분 섭취와 따뜻한 하체 관리를 의식하라.`, `물의 기운이 부족하니 피로가 쉽게 쌓인다 — 휴식의 양과 질을 우선순위로 두어라.`] },
  { id: "friendship_metal_dom", category: "friendship", when: { dom_element: "metal" }, lines: [`金의 기운이 강해 친구 관계에서 호불호가 분명하다. 한번 끊은 인연은 다시 잘 잇지 않는 편이다.`, `쇠의 결 — 친구를 가려 사귀는 사주. 폭은 좁아도 깊이는 어느 누구보다 단단하다.`] },
] as const;
