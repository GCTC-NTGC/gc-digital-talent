import React from "react";

/**
 * Wraps text in span to increase font-weight
 *
 * Note: This does not use `<strong>` tags since
 * those change the context of the text and how
 * assistive technology interprets it.
 *
 * REF: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong#usage_notes
 *
 * @param text text to wrap.
 */
export const strong = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-font-weight="b(800)">{text}</span>
);

/**
 * Wraps text in span to make invisible to sighted users
 * @param text text to wrap.
 */
export const hidden = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-visibility="b(invisible)">{text}</span>
);

/**
 * Wraps text in tags to make it the primary color with a heavy weight
 * @param text text to wrap.
 */
export const heavyPrimary = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-font-color="b(lightpurple)" data-h2-font-weight="b(800)">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the primary color
 * @param text text to wrap.
 */
export const primary = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-font-color="b(lightpurple)">{text}</span>
);

/**
 * Wraps text in tags to make it red
 * @param text  text to wrap
 */
export const red = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-font-color="b(red)">{text}</span>
);

/**
 * Wraps text in tags to make it gray
 * @param text  text to wrap
 */
export const gray = (text: React.ReactNode): React.ReactNode => (
  <span data-h2-font-color="b([dark]gray)">{text}</span>
);

export default {
  strong,
  hidden,
  heavyPrimary,
  primary,
  red,
  gray,
};
