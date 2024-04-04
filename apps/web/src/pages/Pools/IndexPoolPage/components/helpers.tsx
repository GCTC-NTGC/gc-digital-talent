import React from "react";
import { IntlShape } from "react-intl";

import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";
import { Link, Chip } from "@gc-digital-talent/ui";
import {
  Classification,
  LocalizedString,
  Maybe,
  Pool,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

export function poolNameAccessor(pool: Pool, intl: IntlShape) {
  const name = getLocalizedName(pool.name, intl);
  return `${name.toLowerCase()} ${
    pool.stream ? intl.formatMessage(getPoolStream(pool.stream)) : ""
  }`;
}

export function viewCell(url: string, pool: Pool, intl: IntlShape) {
  return (
    <Link color="black" href={url}>
      {getLocalizedName(pool.name, intl)}
    </Link>
  );
}

export function viewTeamLinkCell(
  url: Maybe<string> | undefined,
  displayName: Maybe<LocalizedString> | undefined,
  intl: IntlShape,
) {
  return url ? (
    <Link color="black" href={url}>
      {intl.formatMessage(
        {
          defaultMessage: "<hidden>View team: </hidden>{teamName}",
          id: "ActH9H",
          description: "Text for a link to the Team table",
        },
        {
          teamName: getLocalizedName(displayName, intl),
        },
      )}
    </Link>
  ) : null;
}

export function fullNameCell(pool: Pool, intl: IntlShape) {
  return (
    <span>
      {getFullNameHtml(pool.owner?.firstName, pool.owner?.lastName, intl)}
    </span>
  );
}

export function classificationAccessor(
  classification: Maybe<Classification> | undefined,
) {
  return classification
    ? `${classification.group}-0${classification.level}`
    : "";
}

export function classificationSortFn(rowA: Pool, rowB: Pool) {
  // passing in sortType to override default sort
  const rowAGroup =
    rowA.classification && rowA.classification ? rowA.classification.group : "";
  const rowBGroup =
    rowB.classification && rowB.classification ? rowB.classification.group : "";
  const rowALevel =
    rowA.classification && rowA.classification ? rowA.classification.level : 0;
  const rowBLevel =
    rowB.classification && rowB.classification ? rowB.classification.level : 0;

  if (rowAGroup.toLowerCase() > rowBGroup.toLowerCase()) {
    return 1;
  }
  if (rowAGroup.toLowerCase() < rowBGroup.toLowerCase()) {
    return -1;
  }
  // if groups identical then sort by level
  if (rowALevel > rowBLevel) {
    return 1;
  }
  if (rowALevel < rowBLevel) {
    return -1;
  }
  return 0;
}

export function classificationCell(
  classification: Maybe<Classification> | undefined,
) {
  if (!classification) return null;

  return (
    <Chip color="primary">
      {`${classification.group}-0${classification.level}`}
    </Chip>
  );
}

export function emailLinkAccessor(pool: Pool, intl: IntlShape) {
  if (pool.owner?.email) {
    return (
      <Link color="black" external href={`mailto:${pool.owner.email}`}>
        {pool.owner.email}
      </Link>
    );
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
}

export function ownerNameAccessor(pool: Pool) {
  const firstName =
    pool.owner && pool.owner.firstName
      ? pool.owner.firstName.toLowerCase()
      : "";
  const lastName =
    pool.owner && pool.owner.lastName ? pool.owner.lastName.toLowerCase() : "";
  return `${firstName} ${lastName}`;
}

export function ownerEmailAccessor(pool: Pool) {
  return pool.owner && pool.owner.email ? pool.owner.email.toLowerCase() : "";
}
