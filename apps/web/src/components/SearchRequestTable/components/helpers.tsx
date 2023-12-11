import React from "react";
import { IntlShape } from "react-intl";

import { Link, Pill, Spoiler } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getPoolCandidateSearchStatus,
} from "@gc-digital-talent/i18n";

import {
  Classification,
  Maybe,
  PoolCandidateSearchRequest,
  PoolCandidateSearchStatus,
  Scalars,
} from "~/api/generated";

export function classificationAccessor(
  classifications: Maybe<Maybe<Classification>[]> | undefined,
) {
  return classifications
    ?.filter(notEmpty)
    ?.map((c) => `${c.group}-0${c.level}`)
    ?.join(", ");
}

export function classificationsCell(
  classifications: Maybe<Maybe<Classification>[] | undefined> | undefined,
  intl: IntlShape,
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
  return pillsArray.length > 0 ? (
    <span>{pillsArray}</span>
  ) : (
    intl.formatMessage(commonMessages.notProvided)
  );
}

export function dateCell(date: Maybe<Scalars["DateTime"]>, intl: IntlShape) {
  return date ? (
    <span>
      {formatDate({
        date: parseDateTimeUtc(date),
        formatString: "PPP p",
        intl,
      })}
    </span>
  ) : null;
}

export const notesCell = (
  searchRequest: PoolCandidateSearchRequest,
  intl: IntlShape,
) =>
  searchRequest?.adminNotes ? (
    <Spoiler
      text={searchRequest.adminNotes}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "notes for {name}",
          id: "6eih3b",
          description:
            "Link text suffix to read more notes for a search request",
        },
        {
          name: searchRequest.jobTitle,
        },
      )}
    />
  ) : null;

export const detailsCell = (
  searchRequest: PoolCandidateSearchRequest,
  intl: IntlShape,
) =>
  searchRequest?.additionalComments ? (
    <Spoiler
      text={searchRequest.additionalComments}
      linkSuffix={intl.formatMessage(
        {
          defaultMessage: "details for {name}",
          id: "sl1kbp",
          description:
            "Link text suffix to read more details for a search request",
        },
        {
          name: searchRequest.jobTitle,
        },
      )}
    />
  ) : null;

export const statusCell = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) =>
  status
    ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
    : "";

export function viewCell(url: string, label: Maybe<string>, intl: IntlShape) {
  return (
    <Link href={url} color="black">
      {label ||
        intl.formatMessage({
          defaultMessage: "No name provided",
          id: "L9Ked5",
          description: "Fallback for team display name value",
        })}
    </Link>
  );
}
