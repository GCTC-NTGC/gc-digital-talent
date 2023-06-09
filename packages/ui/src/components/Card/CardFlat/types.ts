import type { Color } from "../../../types";

export type CardColor = Extract<
  Color,
  "primary" | "secondary" | "tertiary" | "quaternary" | "quinary" | "black"
>;
