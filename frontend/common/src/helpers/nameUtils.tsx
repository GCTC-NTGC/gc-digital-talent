import React from "react";
import { IntlShape } from "react-intl";
import { getAbbreviations } from "../constants/localizedConstants";

export const getFullNameLabel = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  intl: IntlShape,
): string => {
  if (!firstName && !lastName) {
    return intl.formatMessage({
      defaultMessage: "No name provided",
      id: "n80lVV",
      description: "Fallback for name value",
    });
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

export const getFullNameHtml = (
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  intl: IntlShape,
): React.ReactNode => {
  if (!firstName && !lastName) {
    return (
      <span data-h2-font-style="base(italic)">
        {intl.formatMessage({
          defaultMessage: "No name provided",
          id: "n80lVV",
          description: "Fallback for name value",
        })}
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
 * Wraps common abbreviations in abbr tags to make them more accessible
 *
 * @param text   text to wrap
 * @param intl   react-intl object
 * @param title  abbreviation title
 */
export const wrapAbbr = (
  text: React.ReactNode,
  intl: IntlShape,
  title?: string,
): JSX.Element => {
  const stringifyText = text && text.toString(); // grabs text from React.ReactNode (is there a better way to get text from React.ReactNode type?)
  if (typeof stringifyText !== "string") {
    const fallbackTitle = intl.formatMessage({
      id: "MuWdei",
      defaultMessage: "Abbreviation not found.",
      description:
        "Message shown to user when the abbreviation text is not found.",
    });
    // eslint-disable-next-line no-console
    console.warn(
      "Error using wrapAbbr(): You must provide a string to <abbreviation />",
    );
    return (
      <abbr title={fallbackTitle}>
        <span>{text}</span>
      </abbr>
    );
  }
  switch (stringifyText) {
    // Regex that matches with all IT(en)/TI(fr) classification with levels
    case stringifyText.match(/[IT][TI]-0\d/)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("IT"))}>
          <span
            aria-label={stringifyText.replace("-0", "").split("").join(" ")}
          >
            {text}
          </span>
        </abbr>
      );
    // Regex that matches with all IT(en)/TI(fr) classification
    case stringifyText.match(/[IT][TI]/)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("IT"))}>
          <span aria-label={stringifyText.split("").join(" ")}>{text}</span>
        </abbr>
      );
    // Regex that matches with all AS classification with levels
    case stringifyText.match(/[AS][SA]-0\d/)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("AS"))}>
          <span
            aria-label={stringifyText.replace("-0", "").split("").join(" ")}
          >
            {text}
          </span>
        </abbr>
      );
    case stringifyText.match(/[AS][SA]/)?.input:
      return (
        <abbr title={intl.formatMessage(getAbbreviations("AS"))}>
          <span aria-label={stringifyText.split("").join(" ")}>{text}</span>
        </abbr>
      );
    default:
      return (
        <abbr title={title}>
          <span aria-label={(text as string).split("").join(" ")}>{text}</span>
        </abbr>
      );
  }
};
