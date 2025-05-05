import { To } from "react-router";

import { HeadingRank } from "./types";

/**
 * Increment a heading rank to a higher rank (h1 ➡️ h2 for example)
 * @param  {HeadingRank} inRank - The heading rank to increment
 * @returns HeadingRank - The incremented heading rank
 */
export function incrementHeadingRank(inRank: HeadingRank): HeadingRank {
  switch (inRank) {
    case "h1":
      return "h2";
    case "h2":
      return "h3";
    case "h3":
      return "h4";
    case "h4":
      return "h5";
    case "h5":
      return "h6";
    // can't go higher than 6
    case "h6":
      return "h6";
    // should never happen
    default:
      return "h6";
  }
}

/**
 * Decrement a heading rank to a lower rank (h2 ➡️ h1 for example)
 * @param  {HeadingRank} inRank - The heading rank to decrement
 * @returns HeadingRank - The decremented heading rank
 */
export function decrementHeadingRank(inRank: HeadingRank): HeadingRank {
  switch (inRank) {
    case "h6":
      return "h5";
    case "h5":
      return "h4";
    case "h4":
      return "h3";
    case "h3":
      return "h2";
    case "h2":
      return "h1";
    // can't go lower than 1
    case "h1":
      return "h1";
    // should never happen
    default:
      return "h1";
  }
}

/**
 * Convert a `To` type to a string
 */

export function hrefToString(to?: To): string | undefined {
  if (typeof to !== "string") {
    return to?.pathname;
  }

  return to;
}
