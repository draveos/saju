// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/narrative_combos.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/narrative_combos_to_ts.py to regenerate.

export type ComboSection = "opening" | "main" | "closing";
export type ComboMood = "welcome" | "reading" | "insight" | "warning" | "encouraging" | "closing";

export interface ComboWhen {
  day_stem?: number;
  day_stem_in?: readonly number[];
  day_branch?: number;
  day_branch_in?: readonly number[];
  sinsal_on_year?: string;
  sinsal_on_month?: string;
  sinsal_on_day?: string;
  sinsal_on_hour?: string;
  unseong_on_year?: string;
  unseong_on_month?: string;
  unseong_on_day?: string;
  unseong_on_hour?: string;
  dom_element?: string;
  lack_element?: string;
  gongmang_on_year?: boolean;
  gongmang_on_month?: boolean;
  gongmang_on_hour?: boolean;
  has_samhyeong?: boolean;
  has_jahyeong?: boolean;
  forward?: boolean;
  current_daewoon_sipsin?: string;
  has_yukhap?: boolean;
  has_samhap?: boolean;
  has_banghap?: boolean;
  has_ganhap?: boolean;
}

export interface ComboInsert {
  section: ComboSection;
  mood?: ComboMood;
  variations: readonly string[];
}

export interface ComboRule {
  id: string;
  when: ComboWhen;
  insert: ComboInsert;
}

export const NARRATIVE_COMBOS: readonly ComboRule[] = [
  {
    id: "sample_gap_yeokma_day",
    when: { day_stem_in: [0,1], sinsal_on_day: "yeokmasal" },
    insert: { section: "main", mood: "insight", variations: [`목(木)의 기운에 역마가 겹쳐 있으니, 뿌리를 옮기며 성장하는 사주다. 한 자리에 오래 머무르기 어려운 결이다.`, `갑·을 일간이 역마살을 일지에 품었다. 움직임이 곧 그대의 생장이니, 머무르면 말라 들어간다.`] },
  },
  {
    id: "sample_byeong_jewang_day",
    when: { day_stem: 2, unseong_on_day: "jewang" },
    insert: { section: "main", mood: "encouraging", variations: [`병화가 일지에 제왕을 깔았구나. 본인의 자리가 가장 빛나는 형국이니, 스스로의 판단을 믿어도 좋다.`, `태양이 정오에 떠 있는 사주다. 다만 너무 뜨거워 주변을 태울 수 있음을 경계하라.`] },
  },
  {
    id: "sample_water_dom_samhyeong",
    when: { dom_element: "water", has_samhyeong: true },
    insert: { section: "main", mood: "warning", variations: [`水의 기운이 넘치는데 삼형까지 엉켰다. 생각이 많아 갈등을 키우는 결이니, 결정을 미루지 말라.`, `물이 가득한데 세 갈래로 꼬인 사주. 아는 것이 오히려 족쇄가 될 수 있다.`] },
  },
  {
    id: "sample_day_master_wood_lack_earth",
    when: { day_stem_in: [0,1], lack_element: "earth" },
    insert: { section: "main", mood: "warning", variations: [`나무가 뿌리 내릴 흙이 없는 사주다. 추상이 구체로 내려앉는 자리를 스스로 마련해야 한다.`, `木의 기운이 있으되 土가 없다 — 큰 뜻을 안아도 땅을 잃기 쉬우니, 생활의 기반부터 살펴라.`] },
  },
  {
    id: "opening_wood_master",
    when: { day_stem_in: [0,1] },
    insert: { section: "opening", mood: "reading", variations: [`그대의 본질은 木 — 뻗어나가는 기운이 사주의 축이다. 차근히 결을 따라가 보자.`, `목(木) 일간이 보인다. 자라는 속성이 그대의 모든 흐름을 관통하고 있구나.`] },
  },
  {
    id: "opening_fire_master",
    when: { day_stem_in: [2,3] },
    insert: { section: "opening", mood: "reading", variations: [`그대의 본질은 火 — 빛을 내는 기운이 사주의 중심이다. 그 빛이 어디로 향하는지 함께 보자.`, `병·정 일간의 사주 — 표현하고 드러나는 결이 그대를 움직이는 가장 큰 동력이다.`] },
  },
  {
    id: "opening_earth_master",
    when: { day_stem_in: [4,5] },
    insert: { section: "opening", mood: "reading", variations: [`그대의 본질은 土 — 품고 쌓는 기운이 사주의 결이다. 단단한 자리부터 살펴보자.`, `무·기 일간 — 묵직함이 그대의 가장 큰 무기다. 서두르지 않는 만큼 멀리 간다.`] },
  },
  {
    id: "opening_metal_master",
    when: { day_stem_in: [6,7] },
    insert: { section: "opening", mood: "reading", variations: [`그대의 본질은 金 — 가르고 정제하는 기운이 사주를 다스린다. 그 단단함의 뿌리를 보자.`, `경·신 일간 — 원칙이 곧 그대의 정체성이다. 그 칼끝이 향하는 방향을 따라가 보자.`] },
  },
  {
    id: "opening_water_master",
    when: { day_stem_in: [8,9] },
    insert: { section: "opening", mood: "reading", variations: [`그대의 본질은 水 — 흐르고 스미는 기운이 사주의 축이다. 그 깊이를 함께 들여다보자.`, `임·계 일간 — 보이지 않는 곳에서 움직이는 결이다. 침잠한 지혜가 그대의 무기다.`] },
  },
  {
    id: "main_samhap_success",
    when: { has_samhap: true },
    insert: { section: "main", mood: "encouraging", variations: [`삼합의 큰 국이 사주에 자리 잡았다 — 혼자보단 함께할 때 큰 흐름을 만든다.`, `세 지지가 한 국으로 묶이니, 사회적 인연이 그대의 운을 키우는 핵심 축이 된다.`] },
  },
  {
    id: "main_banghap_environment",
    when: { has_banghap: true },
    insert: { section: "main", mood: "encouraging", variations: [`방합이 있어 환경이 그대 편이다. 시기·자리만 잘 잡으면 자연스럽게 풀리는 결이다.`, `계절의 기운이 모인 사주 — 흐름을 거슬러 가지 말고 타고 가야 한다.`] },
  },
  {
    id: "main_ganhap_inner_change",
    when: { has_ganhap: true },
    insert: { section: "main", mood: "insight", variations: [`천간합이 있으니 내면의 결속이 단단하다. 변화의 방향이 본질에서부터 일어나는 결이다.`, `간합의 축 — 그대를 가장 깊이 변화시키는 것은 외부 사건이 아니라 내면의 결심이다.`] },
  },
  {
    id: "main_jewang_day",
    when: { unseong_on_day: "jewang" },
    insert: { section: "main", mood: "insight", variations: [`일지에 제왕의 기운 — 자기 자리에 가장 강하게 박힌 사주다. 자신의 판단을 신뢰해도 된다.`, `본인 자리가 가장 강한 형국 — 다만 그 힘이 주변을 누르지 않도록 의식해야 한다.`] },
  },
  {
    id: "main_jangseong_month",
    when: { sinsal_on_month: "jangseongsal" },
    insert: { section: "main", mood: "encouraging", variations: [`월지에 장성살 — 사회적 자리에서 권위가 자연스럽게 따라오는 결이다.`, `조직·사회 자리의 별이 장성이니, 리더의 자리에 어색함이 없을 사주다.`] },
  },
  {
    id: "main_earth_dom_lack_water",
    when: { dom_element: "earth", lack_element: "water" },
    insert: { section: "main", mood: "warning", variations: [`土가 두텁고 水가 빠진 사주 — 안정은 있으나 흐름이 막히기 쉬운 결이다. 새로운 자극을 의식적으로 끌어와야 한다.`, `흙은 많고 물이 없어 묵직하나 굳어버리기 쉬운 사주. 변화를 두려워하면 그 자리가 늪이 된다.`] },
  },
  {
    id: "main_jisal_year_yeokma_day",
    when: { sinsal_on_year: "jisal", sinsal_on_day: "yeokmasal" },
    insert: { section: "main", mood: "insight", variations: [`연지에 지살, 일지에 역마 — 평생을 통해 이동·변동이 잦은 사주. 한 자리에 묶이려 하면 답답해진다.`, `지살과 역마가 함께한 결 — 새로운 환경에서 오히려 진가가 드러난다.`] },
  },
  {
    id: "closing_samhap_forward",
    when: { has_samhap: true, forward: true },
    insert: { section: "closing", mood: "encouraging", variations: [`삼합이 있고 대운이 순행하니, 멀리 보고 차곡차곡 쌓는 자리에서 그대의 사주가 가장 빛난다.`, `큰 합과 순행의 흐름 — 시간을 두고 뿌리를 깊이 박는 사주. 조급해 말고 가라.`] },
  },
  {
    id: "closing_chung_caution",
    when: { has_samhyeong: false, forward: false },
    insert: { section: "closing", mood: "closing", variations: [`거스르는 흐름 속에서도 길은 있다. 빠른 길보단 단단한 길을 찾는 것이 그대의 사주에 맞는다.`, `역행 대운이지만 두려워 말라 — 거꾸로 가는 시간이 결국 그대를 더 깊은 곳으로 데려간다.`] },
  },
] as const;
