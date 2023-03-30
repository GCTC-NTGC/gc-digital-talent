import type { Color } from "../../Button";

export type CardColor = Extract<
  Color,
  "yellow" | "red" | "blue" | "black" | "purple"
>;
