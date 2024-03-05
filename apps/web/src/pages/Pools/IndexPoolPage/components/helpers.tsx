import React from "react";
import { IntlShape } from "react-intl";

import { getLocalizedName, getPoolStream } from "@gc-digital-talent/i18n";
import { Link, Pill } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Classification,
  LocalizedString,
  Maybe,
  Pool,
} from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { getFullNameHtml } from "~/utils/nameUtils";

export function poolNameAccessor(pool: Pool, intl: IntlShape) {
  const name = getLocalizedName(pool.name, intl);
  return `${name.toLowerCase()} ${
    pool.stream ? intl.formatMessage(getPoolStream(pool.stream)) : ""
  }`;
}

export function poolCandidatesViewCell(
  poolCandidatesTableUrl: string,
  intl: IntlShape,
  pool: Maybe<Pool>,
) {
  return (
    <Link href={poolCandidatesTableUrl} color="black" data-h2-padding="base(0)">
      {intl.formatMessage(
        {
          defaultMessage: "View Candidates<hidden> for {label}</hidden>",
          id: "6R9N+h",
          description: "Text for a link to the Pool Candidates table",
        },
        { label: getShortPoolTitleHtml(intl, pool) },
      )}
    </Link>
  );
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
  classifications: Maybe<Maybe<Classification>[]> | undefined,
) {
  return classifications
    ?.filter(notEmpty)
    ?.map((c) => `${c.group}-0${c.level}`)
    ?.join(", ");
}

export function classificationSortFn(rowA: Pool, rowB: Pool) {
  // passing in sortType to override default sort
  const rowAGroup =
    rowA.classifications && rowA.classifications[0]
      ? rowA.classifications[0].group
      : "";
  const rowBGroup =
    rowB.classifications && rowB.classifications[0]
      ? rowB.classifications[0].group
      : "";
  const rowALevel =
    rowA.classifications && rowA.classifications[0]
      ? rowA.classifications[0].level
      : 0;
  const rowBLevel =
    rowB.classifications && rowB.classifications[0]
      ? rowB.classifications[0].level
      : 0;

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

export function classificationsCell(
  classifications: Maybe<Maybe<Classification>[] | undefined> | undefined,
) {
  const filteredClassifications = classifications
    ? classifications.filter(notEmpty)
    : [];
  const pillsArray = filteredClassifications.map((classification) => {
    return (
      <Pill
        key={`${classification.group}-0${classification.level}`}
        color="primary"
        mode="outline"
      >
        {`${classification.group}-0${classification.level}`}
      </Pill>
    );
  });
  return pillsArray.length > 0 ? <span>{pillsArray}</span> : null;
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
