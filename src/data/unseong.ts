// ⚠ AUTO-GENERATED from ~/.harness/saju/rulebook/unseong_12.json
// ⚠ DO NOT EDIT BY HAND. Run ~/.harness/saju/codegen/unseong_to_ts.py to regenerate.

export type UnseongKey = "jangsaeng" | "mogyok" | "gwandae" | "geonnok" | "jewang" | "soe" | "byeong" | "sa" | "myo" | "jeol" | "tae" | "yang";

export interface UnseongDef {
  key: UnseongKey;
  nameKr: string;
  nameHanja: string;
  theme: string;
  order: number;
}

export const UNSEONGS: readonly UnseongDef[] = [
  { key: "jangsaeng", nameKr: "장생", nameHanja: "長生", theme: "탄생·시작·순수한 생명력", order: 0 },
  { key: "mogyok", nameKr: "목욕", nameHanja: "沐浴", theme: "정화·변덕·이성운(도화성)", order: 1 },
  { key: "gwandae", nameKr: "관대", nameHanja: "冠帶", theme: "성장·독립·자기주장", order: 2 },
  { key: "geonnok", nameKr: "건록", nameHanja: "建祿", theme: "자립·직업운·번영", order: 3 },
  { key: "jewang", nameKr: "제왕", nameHanja: "帝旺", theme: "최전성기·리더십·권위", order: 4 },
  { key: "soe", nameKr: "쇠", nameHanja: "衰", theme: "쇠퇴·성찰·안정 추구", order: 5 },
  { key: "byeong", nameKr: "병", nameHanja: "病", theme: "약화·감수성·예술성", order: 6 },
  { key: "sa", nameKr: "사", nameHanja: "死", theme: "소멸·정리·마무리", order: 7 },
  { key: "myo", nameKr: "묘", nameHanja: "墓", theme: "수렴·저장·고독", order: 8 },
  { key: "jeol", nameKr: "절", nameHanja: "絶", theme: "단절·전환·새 시작", order: 9 },
  { key: "tae", nameKr: "태", nameHanja: "胎", theme: "잉태·준비·기대", order: 10 },
  { key: "yang", nameKr: "양", nameHanja: "養", theme: "양육·성장·완성 전", order: 11 },
] as const;

// day_stem(0..9) × target_branch(0..11) → UnseongKey
const UNSEONG_TABLE: readonly (readonly UnseongKey[])[] = [
  ["mogyok", "gwandae", "geonnok", "jewang", "soe", "byeong", "sa", "myo", "jeol", "tae", "yang", "jangsaeng"], // stem 0
  ["byeong", "soe", "jewang", "geonnok", "gwandae", "mogyok", "jangsaeng", "yang", "tae", "jeol", "myo", "sa"], // stem 1
  ["tae", "yang", "jangsaeng", "mogyok", "gwandae", "geonnok", "jewang", "soe", "byeong", "sa", "myo", "jeol"], // stem 2
  ["jeol", "myo", "sa", "byeong", "soe", "jewang", "geonnok", "gwandae", "mogyok", "jangsaeng", "yang", "tae"], // stem 3
  ["tae", "yang", "jangsaeng", "mogyok", "gwandae", "geonnok", "jewang", "soe", "byeong", "sa", "myo", "jeol"], // stem 4
  ["jeol", "myo", "sa", "byeong", "soe", "jewang", "geonnok", "gwandae", "mogyok", "jangsaeng", "yang", "tae"], // stem 5
  ["sa", "myo", "jeol", "tae", "yang", "jangsaeng", "mogyok", "gwandae", "geonnok", "jewang", "soe", "byeong"], // stem 6
  ["jangsaeng", "yang", "tae", "jeol", "myo", "sa", "byeong", "soe", "jewang", "geonnok", "gwandae", "mogyok"], // stem 7
  ["jewang", "soe", "byeong", "sa", "myo", "jeol", "tae", "yang", "jangsaeng", "mogyok", "gwandae", "geonnok"], // stem 8
  ["geonnok", "gwandae", "mogyok", "jangsaeng", "yang", "tae", "jeol", "myo", "sa", "byeong", "soe", "jewang"], // stem 9
];

export function unseongAt(dayStem: number, targetBranch: number): UnseongKey {
  return UNSEONG_TABLE[dayStem][targetBranch];
}

const DEF_BY_KEY: Record<UnseongKey, UnseongDef> = Object.fromEntries(
  UNSEONGS.map((s) => [s.key, s])
) as Record<UnseongKey, UnseongDef>;

export const unseongDef = (k: UnseongKey): UnseongDef => DEF_BY_KEY[k];
