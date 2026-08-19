import type { Locales } from "@gc-digital-talent/i18n";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const INSTRUCTIONS_MAX_WORDS_EN = 250;

export const instructionsWordCountLimits: Record<Locales, number> = {
  en: INSTRUCTIONS_MAX_WORDS_EN,
  fr: Math.round(INSTRUCTIONS_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;
