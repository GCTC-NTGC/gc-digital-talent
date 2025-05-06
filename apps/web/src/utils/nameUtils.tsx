import { IntlShape } from "react-intl";
import { ReactNode } from "react";

import { nodeToString } from "@gc-digital-talent/helpers";
import { commonMessages, getAbbreviations } from "@gc-digital-talent/i18n";

export const getFullNameLabel = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  intl: IntlShape,
): string => {
  if (!firstName && !lastName) {
    return intl.formatMessage(commonMessages.noNameProvided);
  }
  if (!firstName) {
    return `${intl.formatMessage({
      defaultMessage: "No first name provided",
      id: "ZLPqdF",
      description: "Fallback for first name value",
    })} ${lastName}`;
  }
  if (!lastName) {
    return `${firstName} ${intl.formatMessage({
      defaultMessage: "No last name provided",
      id: "r7lf0k",
      description: "Fallback for last name value",
    })}`;
  }
  return `${firstName} ${lastName}`;
};

export const getFullNameAndEmailLabel = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null | undefined,
  intl: IntlShape,
): string => {
  const emailDefined =
    email ??
    intl.formatMessage({
      defaultMessage: "No email provided",
      id: "1JCjTP",
      description: "Fallback for email value",
    });

  if (!firstName && !lastName) {
    return `${intl.formatMessage(
      commonMessages.noNameProvided,
    )} - ${emailDefined}`;
  }

  if (!firstName) {
    return `${intl.formatMessage({
      defaultMessage: "No first name provided",
      id: "ZLPqdF",
      description: "Fallback for first name value",
    })} ${lastName} - ${emailDefined}`;
  }
  if (!lastName) {
    return `${firstName} ${intl.formatMessage({
      defaultMessage: "No last name provided",
      id: "r7lf0k",
      description: "Fallback for last name value",
    })} - ${emailDefined}`;
  }
  return `${firstName} ${lastName} - ${emailDefined}`;
};

export const getFullNameHtml = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  intl: IntlShape,
): ReactNode => {
  if (!firstName && !lastName) {
    return (
      <span data-h2-font-style="base(italic)">
        {intl.formatMessage(commonMessages.noNameProvided)}
      </span>
    );
  }
  if (!firstName) {
    return (
      <>
        <span data-h2-font-style="base(italic)">
          {intl.formatMessage({
            defaultMessage: "No first name provided",
            id: "ZLPqdF",
            description: "Fallback for first name value",
          })}
        </span>{" "}
        {lastName}
      </>
    );
  }
  if (!lastName) {
    return (
      <>
        {firstName}{" "}
        <span data-h2-font-style="base(italic)">
          {intl.formatMessage({
            defaultMessage: "No last name provided",
            id: "r7lf0k",
            description: "Fallback for last name value",
          })}
        </span>
      </>
    );
  }
  return `${firstName} ${lastName}`;
};

/**
 * Split a string into substrings using the specified separator, and then join all the elements into a string, separated by the specified separator string.
 *
 * @param text
 * @param split
 * @param join
 *
 * @return string
 */
export const splitAndJoin = (text: string, split = "", join = " ") =>
  text.split(split).join(join);

/**
 * Wraps common abbreviations in abbr tags to make them more accessible
 *
 * @param text   text to wrap
 * @param intl   react-intl object
 * @param title  abbreviation title
 *
 * @returns JSX.Element
 */
export const wrapAbbr = (text: ReactNode, intl: IntlShape, title?: string) => {
  const fallbackTitle = intl.formatMessage({
    id: "MuWdei",
    defaultMessage: "Abbreviation not found.",
    description:
      "Message shown to user when the abbreviation text is not found.",
  });
  const stringifyText =
    text && nodeToString(Array.isArray(text) ? (text[0] as ReactNode) : text);
  if (typeof stringifyText !== "string") {
    return (
      <abbr title={fallbackTitle}>
        <span>{text}</span>
      </abbr>
    );
  }
  switch (stringifyText) {
    // Regex that matches IT classifications with levels from 01-09
    case /[IT]-0\d/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("IT"))}>
          <span aria-label={splitAndJoin(stringifyText.replace("-0", ""))}>
            {text}
          </span>
        </abbr>
      );
    // Regex that matches IT classifications with levels from 10 and up
    case /[IT]-\d/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("IT"))}>
          <span aria-label={splitAndJoin(stringifyText.replace("-", ""))}>
            {text}
          </span>
        </abbr>
      );
    // Regex that matches all IT(en)/TI(fr)
    case /[IT][TI]/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("IT"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    // Regex that matches AS classifications with levels from 01-09
    case /[AS]-0\d/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("AS"))}>
          <span aria-label={splitAndJoin(stringifyText.replace("-0", ""))}>
            {text}
          </span>
        </abbr>
      );
    // Regex that matches AS classifications with levels from 10 and up
    case /[AS]-\d/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("AS"))}>
          <span aria-label={splitAndJoin(stringifyText.replace("-", ""))}>
            {text}
          </span>
        </abbr>
      );
    case /AS/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("AS"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    case /GC/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("GC"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    case /EX/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("EX"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    case /PM/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("PM"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    case /CS/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("CS"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    case /EC/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("EC"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    case /CR/.exec(stringifyText)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("CR"))}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
    default:
      return (
        <abbr title={title ?? fallbackTitle}>
          <span aria-label={splitAndJoin(stringifyText)}>{text}</span>
        </abbr>
      );
  }
};
