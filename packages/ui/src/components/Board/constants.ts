export const ARROW_KEY = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
} as const;

// eslint-disable-next-line import/no-unused-modules
export type ArrowKey = (typeof ARROW_KEY)[keyof typeof ARROW_KEY];

export const arrowKeys = Object.values(ARROW_KEY);
