import type { IntlShape } from "react-intl";

import {
  Link,
  Chip,
  Spoiler,
  Chips,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import type {
  Classification,
  Maybe,
  PoolCandidateSearchRequest,
} from "@gc-digital-talent/graphql";
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import type useRoutes from "~/hooks/useRoutes";
import { followUpDateOverdueInfo } from "~/utils/searchRequestUtils";
import cells from "~/components/Table/cells";

export function classificationAccessor(
  classifications:
    | Maybe<Maybe<Pick<Classification, "group" | "level">>[]>
    | undefined,
) {
  return classifications
    ?.filter(notEmpty)
    ?.map((c) => `${c.group}-${c.level < 10 ? "0" : ""}${c.level}`)
    ?.join(", ");
}

export function classificationsCell(
  classifications:
    | Maybe<Maybe<Pick<Classification, "group" | "level">>[] | undefined>
    | undefined,
  intl: IntlShape,
) {
  const filteredClassifications = classifications
    ? classifications.filter(notEmpty)
    : [];
  const chipsArray = filteredClassifications.map((classification) => {
    return (
      <Chip
        key={`${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`}
        color="primary"
      >
        <>
          {classification.group}
          <span>{UNICODE_CHAR.HYPHEN}</span>
          {classification.level < 10 ? "0" : ""}
          {classification.level}
        </>
      </Chip>
    );
  });
  return chipsArray.length > 0 ? (
    <Chips>{chipsArray}</Chips>
  ) : (
    intl.formatMessage(commonMessages.notProvided)
  );
}

export const jobTitleCell = (
  searchRequest: Pick<PoolCandidateSearchRequest, "id" | "jobTitle">,
  paths: ReturnType<typeof useRoutes>,
) => {
  return (
    <Link href={paths.searchRequestView(searchRequest.id)}>
      {searchRequest.jobTitle}
    </Link>
  );
};

export const notesCell = (
  searchRequest: Pick<PoolCandidateSearchRequest, "adminNotes" | "jobTitle">,
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
  searchRequest: Pick<
    PoolCandidateSearchRequest,
    "additionalComments" | "jobTitle"
  >,
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

export const followUpDateCell = (
  followUpDate: string | null | undefined,
  now: Date,
  intl: IntlShape,
) => {
  if (!followUpDate) return null;

  const { isOverdue, daysOverdue } = followUpDateOverdueInfo(
    parseDateTimeUtc(followUpDate),
    now,
  );

  return isOverdue ? (
    <Chip color="error">
      {intl.formatMessage(commonMessages.overdueDate, { daysOverdue })}
    </Chip>
  ) : (
    cells.date(followUpDate, intl)
  );
};
