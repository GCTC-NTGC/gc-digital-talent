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
export const strong = (text: React.ReactNode) => (
  <span data-h2-font-weight="base(700)">{text}</span>
);

/**
 * Wraps text in span to make invisible to sighted users
 * @param text text to wrap.
 */
export const hidden = (text: React.ReactNode) => (
  <span data-h2-visually-hidden="base(invisible)" style={{ whiteSpace: "pre" }}>
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the primary color with a heavy weight
 * @param text text to wrap.
 */
export const heavyPrimary = (text: React.ReactNode) => (
  <span data-h2-color="base(primary.dark)" data-h2-font-weight="base(700)">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the primary color
 * @param text text to wrap.
 */
export const primary = (text: React.ReactNode) => (
  <span data-h2-color="base(primary.darker)">{text}</span>
);

/**
 * Wraps text in tags to make it red
 * @param text  text to wrap
 */
export const red = (text: React.ReactNode) => (
  <span data-h2-color="base(error.dark)">{text}</span>
);

/**
 * Wraps text in tags to make it gray
 * @param text  text to wrap
 */
export const gray = (text: React.ReactNode) => (
  <span data-h2-color="base(gray.dark)">{text}</span>
);

/**
 * Wraps text in tags to make it underlined
 * @param text  text to wrap
 */
export const underline = (text: React.ReactNode) => (
  <span data-h2-text-decoration="base(underline)">{text}</span>
);

/**
 * Wraps text in a strong tag and increases font weight.
 * This is meant for words that are important and need emphasizing.
 *
 *
 * @param text text to wrap.
 */
export const emphasize = (text: React.ReactNode) => (
  <strong data-h2-font-weight="base(700)">{text}</strong>
);

/**
 * Adds a soft hyphen.
 * This is meant to mark a hyphenation opportunity, which only becomes
 * visible as a hyphen at the end of a line after formatting.
 *
 *
 */
export const softHyphen = () => <>&shy;</>;

export default {
  strong,
  hidden,
  heavyPrimary,
  primary,
  red,
  gray,
  underline,
  emphasize,
  softHyphen,
};
