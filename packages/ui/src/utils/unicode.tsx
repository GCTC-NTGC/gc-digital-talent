import { ReactNode } from "react";

export const UNICODE_CHAR = {
  BULLET: "\u2022",
  COMMA: "\u002C",
  ELLIPSE: "\u2026",
  EM_DASH: "\u2014",
  HYPHEN: "\u2010",
  LEFT_PAREN: "\u0028",
  RIGHT_PAREN: "\u0029",
};

export const wrapParens = (children: ReactNode) => (
  <>
    {UNICODE_CHAR.LEFT_PAREN}
    {children}
    {UNICODE_CHAR.RIGHT_PAREN}
  </>
);
