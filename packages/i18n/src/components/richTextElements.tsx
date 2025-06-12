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
const strong = (text: ReactNode) => <span className="font-bold">{text}</span>;

/**
 * Wraps text in span to make invisible to sighted users
 * @param text text to wrap.
 */
const hidden = (text: ReactNode) => (
  <span className="sr-only whitespace-pre">{text}</span>
);

/**
 * Wraps text in tags to make it the primary color with a heavy weight
 * @param text text to wrap.
 */
const heavyPrimary = (text: ReactNode) => (
  <span className="font-bold text-primary-600 dark:text-primary-200">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the primary color
 * @param text text to wrap.
 */
const primary = (text: ReactNode) => (
  <span className="text-primary-600 dark:text-primary-200">{text}</span>
);

/**
 * Wraps text in tags to make it the secondary color with a heavy weight
 * @param text text to wrap.
 */
const heavySecondary = (text: ReactNode) => (
  <span className="font-bold text-secondary-600 dark:text-secondary-200">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it the secondary color
 * @param text text to wrap.
 */
const secondary = (text: ReactNode) => (
  <span className="text-secondary-600 dark:text-secondary-200">{text}</span>
);

/**
 * Wraps text in tags to make it red
 * @param text  text to wrap
 */
const red = (text: ReactNode) => (
  <span className="text-error-600 dark:text-error-100">{text}</span>
);

/**
 * Wraps text in tags to make it red and bold
 * @param text  text to wrap
 */
const heavyRed = (text: ReactNode) => (
  <span className="font-bold text-error-600 dark:text-error-100">{text}</span>
);

/**
 * Wraps text in tags to make it yellow
 * @param text  text to wrap
 */
const warning = (text: ReactNode) => (
  <span className="text-warning-500 dark:text-warning-300">{text}</span>
);

/**
 * Wraps text in tags to make it yellow bold
 * @param text  text to wrap
 */
const heavyWarning = (text: ReactNode) => (
  <span className="font-bold text-warning-500 dark:text-warning-300">
    {text}
  </span>
);

/**
 * Wraps text in tags to make it gray
 * @param text  text to wrap
 */
const gray = (text: ReactNode) => (
  <span className="text-gray-500 dark:text-gray-300">{text}</span>
);

/**
 * Wraps text in tags to make it underlined
 * @param text  text to wrap
 */
const underline = (text: ReactNode) => (
  <span className="underline">{text}</span>
);

/**
 * Wraps text in a strong tag and increases font weight.
 * This is meant for words that are important and need emphasizing.
 *
 *
 * @param text text to wrap.
 */
const emphasize = (text: ReactNode) => (
  <strong className="font-bold">{text}</strong>
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
const italic = (text: ReactNode) => <span className="italic">{text}</span>;

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
