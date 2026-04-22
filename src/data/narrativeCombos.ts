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
] as const;
