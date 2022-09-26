import React from "react";
import { IntlShape } from "react-intl";

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
