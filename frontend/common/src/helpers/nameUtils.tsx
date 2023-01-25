import React from "react";
import { IntlShape } from "react-intl";
import { Maybe } from "../api/generated";

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

export const getClassificationAbbvHtml = (
  intl: IntlShape,
  name: Maybe<string>,
  group: Maybe<string>,
  level?: Maybe<number>,
): React.ReactNode => {
  const fallbackTitle =
    name ??
    intl.formatMessage({
      id: "wSDrXG",
      defaultMessage: "Classification not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (name && group && !level) {
    const ariaLabel = `${group.split("").join(" ")}`;
    return (
      <abbr title={name ?? fallbackTitle} aria-label={ariaLabel}>
        <span aria-hidden="true">{group ?? fallbackTitle}</span>
      </abbr>
    );
  }

  const ariaLabel =
    group && level ? `${group.split("").join(" ")} ${level}` : "";
  const groupAndLevel = group && level ? `${group}-0${level}` : "";

  return (
    <abbr title={name ?? fallbackTitle} aria-label={ariaLabel}>
      <span aria-hidden="true">{groupAndLevel ?? fallbackTitle}</span>
    </abbr>
  );
};

export const getITAbbrHtml = (
  intl: IntlShape,
  level?: Maybe<number>,
): React.ReactNode =>
  getClassificationAbbvHtml(
    intl,
    intl.formatMessage({
      defaultMessage: "Information Technology",
      id: "nLW9zq",
    }),
    intl.formatMessage({ defaultMessage: "IT", id: "AoDRut" }),
    level,
  );

export const getASAbbrHtml = (
  intl: IntlShape,
  level?: Maybe<number>,
): React.ReactNode =>
  getClassificationAbbvHtml(
    intl,
    intl.formatMessage({
      defaultMessage: "Administrative Services",
      id: "6svHxg",
    }),
    intl.formatMessage({ defaultMessage: "AS", id: "L2u3Qn" }),
    level,
  );
