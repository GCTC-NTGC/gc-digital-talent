import type { SortingState } from "@tanstack/react-table";
import type { IntlShape } from "react-intl";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  type AdvancedOrderByInput,
  TalentRequestStatus,
  type TalentRequestInput,
  type Classification,
  type TalentRequest,
  type LocalizedTalentRequestStatus,
} from "@gc-digital-talent/graphql";
import { SortOrder } from "@gc-digital-talent/graphql";
import {
  Chip,
  Chips,
  Link,
  Spoiler,
  type ChipProps,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  DATE_FORMAT_LOCALIZED,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";

import type useRoutes from "~/hooks/useRoutes";
import { followUpDateOverdueInfo } from "~/utils/searchRequestUtils";
import cells from "~/components/Table/cells";

export interface FormValues {
  status?: TalentRequestStatus[];
  departments?: string[];
  classifications?: string[];
  workStreams?: string[];
}

export function transformFormValuesToTalentRequestFilterInput(
  data: FormValues,
): TalentRequestInput {
  return {
    talentRequestStatus: data.status?.length
      ? unpackMaybes(data.status)
      : undefined,
    departments: data.departments?.length ? data.departments : undefined,
    classifications: data.classifications?.length
      ? data.classifications
      : undefined,
    workStreams: data.workStreams?.length
      ? unpackMaybes(data.workStreams)
      : undefined,
  };
}

export function transformSortStateToOrderByClause(
  sortingRule: SortingState,
): AdvancedOrderByInput | AdvancedOrderByInput[] | undefined {
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["manager", "full_name"],
    ["jobTitle", "job_title"],
    ["email", "email"],
    ["status", "status_weight"],
    ["requestedDate", "created_at"],
    ["followUpDate", "follow_up_date"],
  ]);

  const orderBy = sortingRule.map((rule) => {
    const columnName = columnMap.get(rule.id);
    if (!columnName) return undefined;
    return {
      column: columnName,
      direction: rule.desc ? SortOrder.Desc : SortOrder.Asc,
    };
  });

  return orderBy.length ? unpackMaybes(orderBy) : undefined;
}

export function transformTalentRequestFilterInputToFormValues(
  input: TalentRequestInput | undefined,
): FormValues {
  return {
    status: unpackMaybes(input?.talentRequestStatus),
    departments: unpackMaybes(input?.departments) ?? [],
    classifications: unpackMaybes(input?.classifications) ?? [],
    workStreams: unpackMaybes(input?.workStreams) ?? [],
  };
}

export const transformTalentRequestInput = (
  filterState: TalentRequestInput,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): TalentRequestInput | null => {
  if (
    filterState === undefined &&
    searchBarTerm === undefined &&
    searchType === undefined
  ) {
    return null;
  }

  return {
    // from search bar
    generalSearch: !!searchBarTerm && !searchType ? searchBarTerm : undefined,
    id: searchType === "id" && !!searchBarTerm ? searchBarTerm : undefined,
    fullName:
      searchType === "fullName" && !!searchBarTerm ? searchBarTerm : undefined,
    email:
      searchType === "email" && !!searchBarTerm ? searchBarTerm : undefined,
    jobTitle:
      searchType === "jobTitle" && !!searchBarTerm ? searchBarTerm : undefined,
    additionalComments:
      searchType === "additionalComments" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    adminNotes:
      searchType === "adminNotes" && !!searchBarTerm
        ? searchBarTerm
        : undefined,
    // from filter
    talentRequestStatus: filterState?.talentRequestStatus,
    departments: filterState?.departments,
    classifications: filterState?.classifications,
    workStreams: filterState?.workStreams,
  };
};

export function classificationsAccessor(
  classifications: Classification[] | undefined,
) {
  return classifications
    ?.filter(notEmpty)
    ?.map((c) => c.groupAndLevel)
    ?.join(", ");
}

export function classificationsCell(
  classifications: Classification[] | undefined,
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
  searchRequest: TalentRequest,
  paths: ReturnType<typeof useRoutes>,
) => {
  return (
    <Link href={paths.searchRequestView(searchRequest.id)}>
      {searchRequest.jobTitle}
    </Link>
  );
};

export const notesCell = (searchRequest: TalentRequest, intl: IntlShape) =>
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

export const detailsCell = (searchRequest: TalentRequest, intl: IntlShape) =>
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

  const { isOverdue, isDueToday, daysOverdue } = followUpDateOverdueInfo(
    parseDateTimeUtc(followUpDate),
    now,
  );

  return isOverdue || isDueToday ? (
    <Chip color="error">
      {isOverdue
        ? intl.formatMessage(commonMessages.overdueDate, { daysOverdue })
        : intl.formatMessage(commonMessages.dueToday)}
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
