import React from "react";
import { IntlShape } from "react-intl";
import { User } from "../api/generated";

export const getFullNameLabel = (u: User, intl: IntlShape): string => {
  if (!u.firstName && !u.lastName) {
    return intl.formatMessage({
      defaultMessage: "No name provided",
      id: "n80lVV",
      description: "Fallback for name value",
    });
  }
  if (!u.firstName) {
    return `${intl.formatMessage({
      defaultMessage: "No first name provided",
      id: "ZLPqdF",
      description: "Fallback for first name value",
    })} ${u.lastName}`;
  }
  if (!u.lastName) {
    return `${u.firstName} ${intl.formatMessage({
      defaultMessage: "No last name provided",
      id: "r7lf0k",
      description: "Fallback for last name value",
    })}`;
  }
  return `${u.firstName} ${u.lastName}`;
};

export const getFullNameHtml = (u: User, intl: IntlShape): React.ReactNode => {
  if (!u.firstName && !u.lastName) {
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
  if (!u.firstName) {
    return (
      <>
        <span data-h2-font-style="base(italic)">
          {intl.formatMessage({
            defaultMessage: "No first name provided",
            id: "ZLPqdF",
            description: "Fallback for first name value",
          })}
        </span>{" "}
        {u.lastName}
      </>
    );
  }
  if (!u.lastName) {
    return (
      <>
        {u.firstName}{" "}
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
  return `${u.firstName} ${u.lastName}`;
};
