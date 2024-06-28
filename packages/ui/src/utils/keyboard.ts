export const ARROW_KEY = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
} as const;

type ArrowKey = (typeof ARROW_KEY)[keyof typeof ARROW_KEY];

const arrowKeys = Object.values(ARROW_KEY);

/**
 * Determine if a key being pressed is an
 * arrow key or, not
 *
 * @param k {string}
 * @returns {boolean}
 */
export function isArrowKey(k: KeyboardEvent["key"]): k is ArrowKey {
  return arrowKeys.includes(k as ArrowKey);
}
