import type { IntlShape } from "react-intl";

import {
  Link,
  Chip,
  Spoiler,
  Chips,
  type ChipProps,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  TalentRequestStatus,
  type Classification,
  type LocalizedTalentRequestStatus,
  type PoolCandidateSearchRequest,
} from "@gc-digital-talent/graphql";
import {
  DATE_FORMAT_LOCALIZED,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import type useRoutes from "~/hooks/useRoutes";
import { followUpDateOverdueInfo } from "~/utils/searchRequestUtils";
import cells from "~/components/Table/cells";

export function classificationsAccessor(
  classifications:
    | (Pick<Classification, "groupAndLevel"> | null | undefined)[]
    | undefined,
) {
  return classifications
    ?.filter(notEmpty)
    ?.map((c) => c.groupAndLevel)
    ?.join(", ");
}

export function classificationsCell(
  classifications:
    | (Pick<Classification, "id" | "groupAndLevel"> | null | undefined)[]
    | undefined,
  intl: IntlShape,
) {
  const filteredClassifications = classifications
    ? classifications.filter(notEmpty)
    : [];
  const chipsArray = filteredClassifications.map((classification) => {
    return (
      <Chip key={classification.id} color="primary">
        {classification.groupAndLevel}
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
    cells.date(followUpDate, intl, DATE_FORMAT_LOCALIZED)
  );
};

const COLOUR_MAP: Record<TalentRequestStatus, ChipProps["color"]> = {
  [TalentRequestStatus.New]: "warning",
  [TalentRequestStatus.InProgress]: "primary",
  [TalentRequestStatus.Completed]: "gray",
} as const;

export const statusCell = (status?: LocalizedTalentRequestStatus | null) => {
  if (!status) return null;

  return <Chip color={COLOUR_MAP[status.value]}>{status.label.localized}</Chip>;
};
