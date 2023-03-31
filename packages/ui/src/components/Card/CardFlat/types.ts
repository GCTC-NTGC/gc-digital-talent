import type { Color } from "../../Button";

export type CardColor = Extract<
  Color,
  "primary" | "secondary" | "tertiary" | "quaternary" | "quinary" | "black"
>;
