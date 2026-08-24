import type { JSX, ReactNode } from "react";

import type { Locales } from "@gc-digital-talent/i18n";

export const UNICODE_CHAR = {
  NON_BREAKING_SPACE: "\u00A0",
  BULLET: "\u2022",
  COMMA: "\u002C",
  ELLIPSE: "\u2026",
  EM_DASH: "\u2014",
  HYPHEN: "\u2010",
  LEFT_PAREN: "\u0028",
  RIGHT_PAREN: "\u0029",
  LEFT_ENGLISH_QUOTE: "\u201C",
  RIGHT_ENGLISH_QUOTE: "\u201D",
  LEFT_FRENCH_QUOTE: "\u00AB",
  RIGHT_FRENCH_QUOTE: "\u00BB",
};

export const wrapParens = (children: ReactNode) => (
  <>
    {UNICODE_CHAR.LEFT_PAREN}
    {children}
    {UNICODE_CHAR.RIGHT_PAREN}
  </>
);

export const wrapQuotes = (children: ReactNode, lang: Locales): JSX.Element => {
  return lang === "en" ? (
    <>
      {UNICODE_CHAR.LEFT_ENGLISH_QUOTE}
      {children}
      {UNICODE_CHAR.RIGHT_ENGLISH_QUOTE}
    </>
  ) : (
    <>
      {UNICODE_CHAR.LEFT_FRENCH_QUOTE}
      {UNICODE_CHAR.NON_BREAKING_SPACE}
      {children}
      {UNICODE_CHAR.NON_BREAKING_SPACE}
      {UNICODE_CHAR.RIGHT_FRENCH_QUOTE}
    </>
  );
};
