import { ReactNode } from "react";

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
const strong = (text: ReactNode) => (
  <span data-h2-font-weight="base(700)">{text}</span>
);

/**
 * Wraps text in span to make invisible to sighted users
 * @param text text to wrap.
 */
const hidden = (text: ReactNode) => (
  <span data-h2-visually-hidden="base(invisible)" style={{ whiteSpace: "pre" }}>
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the primary color with a heavy weight
 * @param text text to wrap.
 */
const heavyPrimary = (text: ReactNode) => (
  <span data-h2-color="base(primary.darker)" data-h2-font-weight="base(700)">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the primary color
 * @param text text to wrap.
 */
const primary = (text: ReactNode) => (
  <span data-h2-color="base(primary.darker)">{text}</span>
);

/**
 * Wraps text in tags to make it the secondary color with a heavy weight
 * @param text text to wrap.
 */
const heavySecondary = (text: ReactNode) => (
  <span data-h2-color="base(secondary.darker)" data-h2-font-weight="base(700)">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the secondary color
 * @param text text to wrap.
 */
const secondary = (text: ReactNode) => (
  <span data-h2-color="base(secondary.darker)">{text}</span>
);

/**
 * Wraps text in tags to make it red
 * @param text  text to wrap
 */
const red = (text: ReactNode) => (
  <span data-h2-color="base(error.darker) base:dark(error.lightest)">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it red and bold
 * @param text  text to wrap
 */
const heavyRed = (text: ReactNode) => (
  <span
    data-h2-color="base(error.darker) base:dark(error.lightest)"
    data-h2-font-weight="base(700)"
  >
    {text}
  </span>
);

/**
 * Wraps text in tags to make it yellow
 * @param text  text to wrap
 */
const warning = (text: ReactNode) => (
  <span data-h2-color="base(warning.dark)">{text}</span>
);

/**
 * Wraps text in tags to make it yellow bold
 * @param text  text to wrap
 */
const heavyWarning = (text: ReactNode) => (
  <span data-h2-color="base(warning.darker)" data-h2-font-weight="base(700)">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it gray
 * @param text  text to wrap
 */
const gray = (text: ReactNode) => (
  <span data-h2-color="base(gray.dark)">{text}</span>
);

/**
 * Wraps text in tags to make it underlined
 * @param text  text to wrap
 */
const underline = (text: ReactNode) => (
  <span data-h2-text-decoration="base(underline)">{text}</span>
);

/**
 * Wraps text in a strong tag and increases font weight.
 * This is meant for words that are important and need emphasizing.
 *
 *
 * @param text text to wrap.
 */
const emphasize = (text: ReactNode) => (
  <strong data-h2-font-weight="base(700)">{text}</strong>
);

/**
 * Adds a soft hyphen.
 * This is meant to mark a hyphenation opportunity, which only becomes
 * visible as a hyphen at the end of a line after formatting.
 *
 *
 */
// eslint-disable-next-line formatjs/no-literal-string-in-jsx
const softHyphen = () => <>&shy;</>;

/**
 * Used to mark up the title of a cited creative work.
 */
const cite = (text: ReactNode) => <cite>{text}</cite>;

/**
 * Used to add a stylized cursive font
 */
const italic = (text: ReactNode) => (
  <span data-h2-font-style="base(italic)">{text}</span>
);

export default {
  strong,
  hidden,
  heavyPrimary,
  primary,
  heavySecondary,
  secondary,
  red,
  heavyRed,
  warning,
  heavyWarning,
  gray,
  underline,
  emphasize,
  softHyphen,
  cite,
  italic,
};
